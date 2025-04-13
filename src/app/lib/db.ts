import { Pool } from 'pg';
import process from "node:process";

// Create a new Pool instance using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function to execute SQL queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

// Function to create the tables if they don't exist
export async function initDatabase() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255),
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      provider VARCHAR(50) DEFAULT 'email',
      google_id VARCHAR(255),
      profile_picture TEXT
    );
  `;

  const createProjectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      goal_amount DECIMAL(12, 2) NOT NULL,
      current_amount DECIMAL(12, 2) DEFAULT 0.00,
      image_url TEXT,
      user_id INTEGER NOT NULL,
      status VARCHAR(50) DEFAULT 'draft' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createContributionsTable = `
    CREATE TABLE IF NOT EXISTS contributions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      amount DECIMAL(12, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );
  `;

  const createSystemSettingsTable = `
    CREATE TABLE IF NOT EXISTS system_settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) NOT NULL UNIQUE,
      value TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Insert default system settings if they don't exist
  const insertDefaultSettings = `
    INSERT INTO system_settings (key, value)
    VALUES ('test_payment_enabled', 'true')
    ON CONFLICT (key) DO NOTHING;
  `;

  try {
    await query(createUsersTable);
    await query(createProjectsTable);
    await query(createContributionsTable);
    await query(createSystemSettingsTable);
    await query(insertDefaultSettings);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database', error);
    throw error;
  }
}

// Export the pool directly for advanced use cases
export default pool;