require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

const updateSchema = async () => {
    try {
        await pool.query(`
            ALTER TABLE contacts 
            ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
            ADD COLUMN IF NOT EXISTS qualification VARCHAR(100),
            ADD COLUMN IF NOT EXISTS college VARCHAR(255),
            ADD COLUMN IF NOT EXISTS tech_stack VARCHAR(100);
        `);
        console.log('Contacts table schema updated successfully.');
    } catch (err) {
        console.error('Error updating schema:', err);
    } finally {
        pool.end();
    }
};

updateSchema();
