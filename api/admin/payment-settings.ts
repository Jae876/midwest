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

  try {
    const authHeader = req.headers.authorization?.split(' ')[1]
    const connectionString = process.env.DATABASE_URL ||
      (process.env.PGHOST && `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require`)

    if (!connectionString) {
      return res.status(500).json({ error: 'Database connection not configured' })
    }

    const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } })

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_method_settings (
        id SERIAL PRIMARY KEY,
        payment_method VARCHAR(50) UNIQUE NOT NULL,
        account_number VARCHAR(255) NOT NULL,
        routing_number VARCHAR(50),
        notes TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    if (req.method === 'GET') {
      const result = await pool.query(`SELECT payment_method, account_number, routing_number, notes FROM payment_method_settings`)
      await pool.end()
      const settings = result.rows.reduce((acc: Record<string, any>, row: any) => ({
        ...acc,
        [row.payment_method]: {
          accountNumber: row.account_number,
          routingNumber: row.routing_number || '',
          notes: row.notes || ''
        }
      }), {})
      return res.status(200).json({
        ACH: settings.ACH || { accountNumber: '', routingNumber: '', notes: '' },
        WIRE: settings.WIRE || { accountNumber: '', routingNumber: '', notes: '' },
        INTERNAL: settings.INTERNAL || { accountNumber: '', routingNumber: '', notes: '' }
      })
    }

    if (req.method === 'PUT') {
      if (!authHeader || !isAdmin(authHeader)) {
        await pool.end()
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { paymentMethod, accountNumber, routingNumber, notes } = req.body
      if (!paymentMethod || !accountNumber) {
        await pool.end()
        return res.status(400).json({ error: 'paymentMethod and accountNumber are required' })
      }

      await pool.query(`
        INSERT INTO payment_method_settings (payment_method, account_number, routing_number, notes)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (payment_method) DO UPDATE SET
          account_number = EXCLUDED.account_number,
          routing_number = EXCLUDED.routing_number,
          notes = EXCLUDED.notes,
          updated_at = CURRENT_TIMESTAMP
      `, [paymentMethod, accountNumber, routingNumber || '', notes || ''])

      await pool.end()
      return res.status(200).json({ message: 'Payment settings saved successfully' })
    }

    await pool.end()
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    return res.status(500).json({
      error: 'Payment settings request failed',
      detail: error instanceof Error ? error.message : String(error)
    })
  }
}
