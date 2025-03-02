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

// Function to create the projects table if it doesn't exist
export async function initDatabase() {
  const createProjectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      goal_amount DECIMAL(12, 2) NOT NULL,
      current_amount DECIMAL(12, 2) DEFAULT 0.00,
      image_url TEXT,
      creator_name VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'draft' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await query(createProjectsTable);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database', error);
    throw error;
  }
}

// Export the pool directly for advanced use cases
export default pool;