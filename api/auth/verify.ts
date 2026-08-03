import { VercelRequest, VercelResponse } from '@vercel/node'
import { Pool } from 'pg'
import crypto from 'crypto'

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    const connectionString = process.env.DATABASE_URL || 
      (process.env.PGHOST && `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`)

    if (!connectionString) {
      return res.status(500).json({ message: 'Database connection not configured' })
    }

    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })

    // Get user data
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId])
    
    if (userResult.rows.length === 0) {
      await pool.end()
      return res.status(404).json({ message: 'User not found' })
    }

    const user = userResult.rows[0]
    const accountResult = await pool.query('SELECT * FROM accounts WHERE user_id = $1', [user.id])
    
    if (!accountResult.rows[0]) {
      await pool.end()
      return res.status(404).json({ message: 'Account not found' })
    }

    const account = accountResult.rows[0]

    await pool.end()

    return res.status(200).json({
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
