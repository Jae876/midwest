import { VercelRequest, VercelResponse } from '@vercel/node'
import { Pool } from 'pg'
import crypto from 'crypto'

async function comparePassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(key == derivedKey.toString('hex'))
    })
  })
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

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ message: 'Password is required' })
    }

    // Support both single DATABASE_URL or individual connection vars
    const connectionString = process.env.DATABASE_URL || 
      (process.env.PGHOST && `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`)

    if (!connectionString) {
      return res.status(500).json({ message: 'Database connection not configured' })
    }

    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })

    // Get admin user
    const adminResult = await pool.query('SELECT * FROM admin_users WHERE username = $1 LIMIT 1', ['admin'])

    if (adminResult.rows.length === 0) {
      await pool.end()
      return res.status(500).json({ message: 'Admin not configured' })
    }

    const admin = adminResult.rows[0]

    // Verify password
    const isPasswordValid = password === process.env.ADMIN_PASSWORD

    if (!isPasswordValid) {
      await pool.end()
      return res.status(401).json({ message: 'Invalid admin password' })
    }

    // Generate token
    const token = generateToken(-admin.id, `admin_${admin.username}`)

    await pool.end()

    return res.status(200).json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: 'admin'
      }
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Admin login failed',
      error: error instanceof Error ? error.message : String(error)
    })
  }
}
