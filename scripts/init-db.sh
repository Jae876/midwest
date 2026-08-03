#!/bin/bash
# Initialize Vercel Postgres Database

# This script sets up the database schema for the Interactive Brokers replica
# Run this AFTER deploying to Vercel and setting up your PostgreSQL database

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set"
  echo "Please set it and try again"
  exit 1
fi

echo "Initializing database with URL: ${DATABASE_URL:0:20}..."

# Run the database initialization
node -e "
import('pg').then(({ Pool }) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  const initSQL = \`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      account_type VARCHAR(50) DEFAULT 'individual',
      created_at_account TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      balance DECIMAL(15, 2) DEFAULT 0,
      buying_power DECIMAL(15, 2) DEFAULT 0,
      margin_level DECIMAL(5, 2) DEFAULT 2.0,
      total_deposits DECIMAL(15, 2) DEFAULT 0,
      unrealized_gains DECIMAL(15, 2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS positions (
      id SERIAL PRIMARY KEY,
      account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      symbol VARCHAR(10) NOT NULL,
      quantity INTEGER NOT NULL,
      avg_cost DECIMAL(10, 2) NOT NULL,
      current_price DECIMAL(10, 2) NOT NULL,
      unrealized_pl DECIMAL(15, 2),
      unrealized_pl_percent DECIMAL(10, 4),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      date VARCHAR(10) NOT NULL,
      type VARCHAR(50) NOT NULL,
      amount DECIMAL(15, 2) NOT NULL,
      description VARCHAR(255),
      balance DECIMAL(15, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  \`;

  (async () => {
    try {
      await pool.query(initSQL);
      console.log('✅ Database initialized successfully');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error initializing database:', err);
      process.exit(1);
    }
  })();
})
"
