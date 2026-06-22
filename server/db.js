import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Establish database pool config
const isProduction = process.env.NODE_ENV === 'production';

let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });
} else {
  pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'lexora_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
  });
}

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

// Helper function to query
export const query = (text, params) => pool.query(text, params);

// Auto-initialize the database tables
export const initDb = async () => {
  const usersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  const alterUsersQuery = `
    ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;
    ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
  `;
  const casesTableQuery = `
    CREATE TABLE IF NOT EXISTS cases (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      case_number VARCHAR(100) NOT NULL,
      court_name VARCHAR(255) NOT NULL,
      status VARCHAR(100) NOT NULL,
      next_hearing_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database.');
    
    // Create users
    await client.query(usersTableQuery);
    // Alter users to add name and is_demo if they don't exist
    await client.query(alterUsersQuery);
    console.log('Database table "users" verified/updated.');

    // Create cases
    await client.query(casesTableQuery);
    console.log('Database table "cases" verified/created.');

    client.release();
  } catch (err) {
    console.error('Database connection failed. Please check your PostgreSQL server and credentials.', err.message);
  }
};

export default pool;
