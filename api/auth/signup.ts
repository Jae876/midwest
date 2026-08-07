import { VercelRequest, VercelResponse } from '@vercel/node'
import { Pool } from 'pg'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { generateAccountNumber, generateRoutingNumber } from '../lib/banking.js'

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password: string): boolean {
  return password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
}

function generateToken(userId: number, email: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({ 
    userId, 
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
  })).toString('base64url')
  const signature = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret').update(`${header}.${payload}`).digest('base64url')
  return `${header}.${payload}.${signature}`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  try {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' })
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Weak password' })
    }

    // Support both single DATABASE_URL or individual connection vars
    const connectionString = process.env.DATABASE_URL || 
      (process.env.PGHOST && `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`)

    if (!connectionString) {
      return res.status(500).json({ message: 'Database connection not configured' })
    }

    console.log('Connecting to:', connectionString.substring(0, 50) + '...')

    const pool = new Pool({ 
      connectionString, 
      ssl: { rejectUnauthorized: false }
    })

    // Create users table
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

    // Create accounts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL,
        balance DECIMAL(15, 2),
        buying_power DECIMAL(15, 2),
        total_deposits DECIMAL(15, 2),
        unrealized_gains DECIMAL(15, 2),
        account_number VARCHAR(20) DEFAULT '',
        routing_number VARCHAR(9) DEFAULT '',
        account_type VARCHAR(50) DEFAULT 'individual',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      ALTER TABLE accounts
      ADD COLUMN IF NOT EXISTS account_number VARCHAR(20) DEFAULT '',
      ADD COLUMN IF NOT EXISTS routing_number VARCHAR(9) DEFAULT '',
      ADD COLUMN IF NOT EXISTS account_type VARCHAR(50) DEFAULT 'individual'
    `)

    // Check email
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      await pool.end()
      return res.status(409).json({ message: 'Email exists' })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Insert user
    const accountTypeValue = req.body.accountType || 'individual'
    const userRes = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, account_type) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name',
      [email, hashedPassword, firstName, lastName, accountTypeValue]
    )

    const user = userRes.rows[0]

    // Insert account
    const accountNumber = generateAccountNumber()
    const routingNumber = generateRoutingNumber()

    const accountRes = await pool.query(
      'INSERT INTO accounts (user_id, balance, buying_power, total_deposits, unrealized_gains, account_type, account_number, routing_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user.id, 50000, 25000, 0, 0, 'individual', accountNumber, routingNumber]
    )

    const account = accountRes.rows[0]
    const token = generateToken(user.id, user.email)

    await pool.end()

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        account: {
          balance: parseFloat(account.balance || 0),
          buyingPower: parseFloat(account.buying_power || 0),
          totalDeposits: parseFloat(account.total_deposits || 0),
          unrealizedGains: parseFloat(account.unrealized_gains || 0),
          accountNumber: account.account_number,
          routingNumber: account.routing_number,
          createdAt: account.created_at,
          positions: [],
          transactions: []
        }
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error',
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
