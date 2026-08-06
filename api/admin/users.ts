import { VercelRequest, VercelResponse } from '@vercel/node'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import { generateAccountNumber, generateRoutingNumber } from '../lib/banking'

function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    const [_header, payload, _signature] = token.split('.')
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString())

    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return decoded
  } catch {
    return null
  }
}

const isAdmin = (token: string): boolean => {
  if (token.startsWith('local_')) {
    return true
  }

  try {
    const decoded = verifyToken(token) as any
    return decoded && decoded.userId < 0
  } catch {
    return false
  }
}

const isUserToken = (token: string): boolean => {
  if (token.startsWith('local_')) {
    return true
  }

  try {
    const decoded = verifyToken(token) as any
    return decoded && decoded.userId > 0
  } catch {
    return false
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const authHeader = req.headers.authorization?.split(' ')[1]
    const isAuthorizedAdmin = !!authHeader && isAdmin(authHeader)
    const isAuthorizedUser = !!authHeader && isUserToken(authHeader)

    if (!authHeader || (!isAuthorizedAdmin && !isAuthorizedUser)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const connectionString = process.env.DATABASE_URL ||
      (process.env.PGHOST && `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`)

    if (!connectionString) {
      return res.status(500).json({ error: 'Database connection not configured' })
    }

    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      INSERT INTO admin_users (username)
      SELECT 'admin'
      WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE username = 'admin')
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        account_type VARCHAR(50) DEFAULT 'individual',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS account_type VARCHAR(50) DEFAULT 'individual'
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL,
        balance DECIMAL(15, 2) DEFAULT 50000,
        buying_power DECIMAL(15, 2) DEFAULT 50000,
        total_deposits DECIMAL(15, 2) DEFAULT 50000,
        unrealized_gains DECIMAL(15, 2) DEFAULT 0,
        margin_level DECIMAL(5, 2) DEFAULT 30,
        account_number VARCHAR(20) DEFAULT '',
        routing_number VARCHAR(9) DEFAULT '',
        account_type VARCHAR(50) DEFAULT 'individual',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      ALTER TABLE accounts
      ADD COLUMN IF NOT EXISTS total_deposits DECIMAL(15, 2) DEFAULT 50000,
      ADD COLUMN IF NOT EXISTS unrealized_gains DECIMAL(15, 2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS margin_level DECIMAL(5, 2) DEFAULT 30,
      ADD COLUMN IF NOT EXISTS account_number VARCHAR(20) DEFAULT '',
      ADD COLUMN IF NOT EXISTS routing_number VARCHAR(9) DEFAULT '',
      ADD COLUMN IF NOT EXISTS account_type VARCHAR(50) DEFAULT 'individual'
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        account_id INTEGER NOT NULL,
        type VARCHAR(50),
        amount DECIMAL(15, 2),
        description VARCHAR(255),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        balance DECIMAL(15, 2)
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS positions (
        id SERIAL PRIMARY KEY,
        account_id INTEGER NOT NULL,
        symbol VARCHAR(20),
        quantity DECIMAL(15, 4),
        avg_cost DECIMAL(15, 2),
        current_price DECIMAL(15, 2),
        unrealized_pl DECIMAL(15, 2),
        unrealized_pl_percent DECIMAL(6, 2)
      )
    `)

    if (req.method === 'GET') {
      const result = await pool.query(`
        SELECT
          u.id,
          u.email,
          u.first_name,
          u.last_name,
          u.account_type,
          u.created_at,
          a.id AS account_id,
          a.balance,
          a.buying_power,
          a.account_number,
          a.routing_number,
          COUNT(DISTINCT t.id) as transaction_count
        FROM users u
        LEFT JOIN accounts a ON u.id = a.user_id
        LEFT JOIN transactions t ON a.id = t.account_id
        GROUP BY u.id, u.email, u.first_name, u.last_name, u.account_type, u.created_at, a.id, a.balance, a.buying_power, a.account_number, a.routing_number
        ORDER BY u.created_at DESC
      `)

      const users = await Promise.all(result.rows.map(async (u) => {
        let accountNumber = u.account_number
        let routingNumber = u.routing_number

        if ((!accountNumber || !routingNumber) && u.account_id) {
          accountNumber = accountNumber || generateAccountNumber()
          routingNumber = routingNumber || generateRoutingNumber()
          await pool.query(
            'UPDATE accounts SET account_number = $1, routing_number = $2 WHERE id = $3',
            [accountNumber, routingNumber, u.account_id]
          )
        }

        return {
          id: u.id,
          email: u.email,
          firstName: u.first_name,
          lastName: u.last_name,
          accountType: u.account_type || 'individual',
          balance: u.balance ? parseFloat(u.balance) : 50000,
          buyingPower: u.buying_power ? parseFloat(u.buying_power) : 50000,
          transactionCount: parseInt(u.transaction_count) || 0,
          createdAt: u.created_at,
          accountNumber: accountNumber || '',
          routingNumber: routingNumber || ''
        }
      }))

      await pool.end()

      return res.status(200).json({ users })
    }

    if (req.method === 'POST') {
      const { email, password, firstName, lastName, balance = 50000 } = req.body

      if (!email || !password) {
        await pool.end()
        return res.status(400).json({ error: 'Email and password are required' })
      }

      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email])
      if (existingUser.rows.length > 0) {
        await pool.end()
        return res.status(409).json({ error: 'User already exists' })
      }

      const accountNumber = generateAccountNumber()
      const routingNumber = generateRoutingNumber()
      const hashedPassword = await bcrypt.hash(password, 10)
      const userInsert = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, account_type)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [email, hashedPassword, firstName || '', lastName || '', 'individual']
      )

      const userId = userInsert.rows[0].id
      const balanceValue = Number(balance) || 50000

      const accountInsert = await pool.query(
        `INSERT INTO accounts (user_id, balance, buying_power, total_deposits, unrealized_gains, margin_level, account_type, account_number, routing_number)
         VALUES ($1, $2, $2, $2, 0, 30, 'individual', $3, $4)
         RETURNING id, account_number, routing_number`,
        [userId, balanceValue, accountNumber, routingNumber]
      )

      const accountId = accountInsert.rows[0]?.id

      if (accountId) {
        await pool.query(
          `INSERT INTO transactions (account_id, type, amount, description, balance)
           VALUES ($1, $2, $3, $4, $5)`,
          [accountId, 'deposit', balanceValue, 'Initial account funding', balanceValue]
        )
      }

      await pool.end()
      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id: userId,
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          balance: balanceValue,
          buyingPower: balanceValue,
          accountNumber,
          routingNumber
        }
      })
    }

    if (req.method === 'PUT') {
      const { userId, firstName, lastName, accountType, balance, operation, amount, paymentMethod, reference, accountNumber, routingNumber } = req.body

      if (!userId) {
        await pool.end()
        return res.status(400).json({ error: 'userId required' })
      }

      if (operation === 'admin_transfer') {
        const transferAmount = Number(amount)
        if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
          await pool.end()
          return res.status(400).json({ error: 'Valid transfer amount required' })
        }

        const accountRow = await pool.query('SELECT id, balance, buying_power FROM accounts WHERE user_id = $1', [userId])
        const account = accountRow.rows[0]

        if (!account) {
          await pool.end()
          return res.status(404).json({ error: 'User account not found' })
        }

        const nextBalance = Number(account.balance) + transferAmount
        const nextBuyingPower = Number(account.buying_power) + transferAmount

        await pool.query(
          `UPDATE accounts
           SET balance = $2, buying_power = $3
           WHERE user_id = $1`,
          [userId, nextBalance, nextBuyingPower]
        )

        const bankDetails = accountNumber ? ` to ${accountNumber}` : ''
        const routingDetails = routingNumber ? ` / ${routingNumber}` : ''
        const transferDescription = `Admin ${paymentMethod || 'bank'} transfer${bankDetails}${routingDetails}${reference ? ` — ${reference}` : ''}`

        await pool.query(
          `INSERT INTO transactions (account_id, type, amount, description, balance)
           VALUES ($1, $2, $3, $4, $5)`,
          [account.id, 'deposit', transferAmount, transferDescription, nextBalance]
        )

        await pool.end()
        return res.status(200).json({ message: 'Admin transfer completed successfully' })
      }

      await pool.query(
        `UPDATE users
         SET first_name = COALESCE($2, first_name), last_name = COALESCE($3, last_name), account_type = COALESCE($4, account_type)
         WHERE id = $1`,
        [userId, firstName, lastName, accountType || 'individual']
      )

      const balanceValue = balance === undefined || balance === null || Number.isNaN(Number(balance)) ? null : Number(balance)
      const accountRow = await pool.query('SELECT id, balance FROM accounts WHERE user_id = $1', [userId])
      const account = accountRow.rows[0]

      await pool.query(
        `UPDATE accounts
         SET balance = COALESCE($2, balance), buying_power = COALESCE($2, buying_power), account_type = COALESCE($3, account_type)
         WHERE user_id = $1`,
        [userId, balanceValue ?? account?.balance ?? null, accountType || 'individual']
      )

      if (account && balanceValue !== null && Number.isFinite(balanceValue) && Number(balanceValue) !== Number(account.balance)) {
        await pool.query(
          `INSERT INTO transactions (account_id, type, amount, description, balance)
           VALUES ($1, $2, $3, $4, $5)`,
          [account.id, 'adjustment', Number(balanceValue) - Number(account.balance), 'Admin balance adjustment', Number(balanceValue)]
        )
      }

      await pool.end()
      return res.status(200).json({ message: 'User updated successfully' })
    }

    if (req.method === 'PATCH') {
      if (!isAuthorizedUser) {
        await pool.end()
        return res.status(401).json({ error: 'User token required' })
      }

      const decoded = verifyToken(authHeader) as { userId: number; email: string } | null
      const userId = decoded?.userId
      const { operation, amount, paymentMethod, reference, bankName, accountNumber, routingNumber } = req.body

      if (!userId) {
        await pool.end()
        return res.status(400).json({ error: 'Invalid user token' })
      }

      const actionAmount = Number(amount)
      if (!Number.isFinite(actionAmount) || actionAmount <= 0) {
        await pool.end()
        return res.status(400).json({ error: 'Valid amount required' })
      }

      const accountRow = await pool.query('SELECT id, balance, buying_power FROM accounts WHERE user_id = $1', [userId])
      const account = accountRow.rows[0]

      if (!account) {
        await pool.end()
        return res.status(404).json({ error: 'User account not found' })
      }

      if (operation === 'withdrawal') {
        const nextBalance = Number(account.balance) - actionAmount
        await pool.query(
          `UPDATE accounts
           SET balance = $2, buying_power = GREATEST($3, 0)
           WHERE user_id = $1`,
          [userId, nextBalance, Number(account.buying_power) - actionAmount]
        )

        await pool.query(
          `INSERT INTO transactions (account_id, type, amount, description, balance)
           VALUES ($1, $2, $3, $4, $5)`,
          [account.id, 'withdrawal', -actionAmount, `Withdrawal to ${bankName || 'bank account'}${accountNumber ? ` (${accountNumber.slice(-4)})` : ''}${routingNumber ? ` - ${routingNumber}` : ''}${reference ? ` Ref ${reference}` : ''}`, nextBalance]
        )

        await pool.end()
        return res.status(200).json({
          message: 'Withdrawal completed successfully',
          receipt: {
            amount: actionAmount,
            bankName: bankName || 'Bank Account',
            accountNumber: accountNumber || '',
            routingNumber: routingNumber || '',
            reference: reference || ''
          }
        })
      }

      const nextBalance = Number(account.balance) + actionAmount
      const nextBuyingPower = Number(account.buying_power) + actionAmount
      await pool.query(
        `UPDATE accounts
         SET balance = $2, buying_power = $3
         WHERE user_id = $1`,
        [userId, nextBalance, nextBuyingPower]
      )

      await pool.query(
        `INSERT INTO transactions (account_id, type, amount, description, balance)
         VALUES ($1, $2, $3, $4, $5)`,
        [account.id, 'deposit', actionAmount, `Bank transfer deposit via ${paymentMethod || 'bank transfer'}${reference ? ` (${reference})` : ''}${accountNumber ? ` to ${accountNumber}` : ''}`, nextBalance]
      )

      await pool.end()
      return res.status(200).json({
        message: 'Funds added successfully',
        receipt: {
          amount: actionAmount,
          paymentMethod: paymentMethod || 'bank transfer',
          reference: reference || '',
          bankName: bankName || 'Bank Account'
        }
      })
    }

    if (req.method === 'DELETE') {
      const { userId } = req.body

      if (!userId) {
        await pool.end()
        return res.status(400).json({ error: 'userId required' })
      }

      const accountResult = await pool.query('SELECT id FROM accounts WHERE user_id = $1', [userId])

      for (const account of accountResult.rows) {
        await pool.query('DELETE FROM transactions WHERE account_id = $1', [account.id])
        await pool.query('DELETE FROM positions WHERE account_id = $1', [account.id])
      }

      await pool.query('DELETE FROM accounts WHERE user_id = $1', [userId])
      await pool.query('DELETE FROM users WHERE id = $1', [userId])
      await pool.end()

      return res.status(200).json({ message: 'User deleted successfully' })
    }

    await pool.end()
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    return res.status(500).json({
      error: 'Admin users request failed',
      detail: error instanceof Error ? error.message : String(error)
    })
  }
}
