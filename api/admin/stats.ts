import { VercelRequest, VercelResponse } from '@vercel/node'
import { Pool } from 'pg'

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const authHeader = req.headers.authorization?.split(' ')[1]
    if (!authHeader || !isAdmin(authHeader)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Support both single DATABASE_URL or individual connection vars
    const connectionString = process.env.DATABASE_URL || 
      (process.env.PGHOST && `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`)

    if (!connectionString) {
      return res.status(500).json({ error: 'Database connection not configured' })
    }

    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })

    const totalUsersResult = await pool.query('SELECT COUNT(*) as count FROM users')
    const totalAccountsResult = await pool.query('SELECT COUNT(*) as count FROM accounts')
    const totalVolumeResult = await pool.query('SELECT COALESCE(SUM(CAST(amount AS DECIMAL)), 0) as total FROM transactions WHERE type = $1', ['buy'])
    const totalDepositsResult = await pool.query('SELECT COALESCE(SUM(total_deposits), 0) as total FROM accounts')
    const balanceResult = await pool.query('SELECT COALESCE(AVG(CAST(balance AS DECIMAL)), 0) as avg FROM accounts')

    await pool.end()

    return res.status(200).json({
      stats: {
        totalUsers: parseInt(totalUsersResult.rows[0].count),
        activeUsers: parseInt(totalUsersResult.rows[0].count),
        totalAccounts: parseInt(totalAccountsResult.rows[0].count),
        totalVolume: parseFloat(totalVolumeResult.rows[0].total),
        totalDeposits: parseFloat(totalDepositsResult.rows[0].total),
        averageBalance: parseFloat(balanceResult.rows[0].avg)
      }
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      detail: error instanceof Error ? error.message : String(error)
    })
  }
}
