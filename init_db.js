const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

const createTables = async () => {
    try {
        console.log('Creating tables...');

        // Featured Projects
        await pool.query(`
            CREATE TABLE IF NOT EXISTS featured_projects (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                title text,
                description text,
                tech_stack text[],
                image_url text,
                is_active boolean DEFAULT true,
                created_at timestamp DEFAULT now()
            );
        `);
        console.log('✅ featured_projects table created/verified');

        // Testimonials
        await pool.query(`
            CREATE TABLE IF NOT EXISTS testimonials (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                name text,
                course text,
                rating int,
                review text,
                created_at timestamp DEFAULT now()
            );
        `);
        console.log('✅ testimonials table created/verified');

        // Pricing Plans
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pricing_plans (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                title text,
                price numeric,
                features text[],
                is_popular boolean DEFAULT false
            );
        `);
        console.log('✅ pricing_plans table created/verified');

        // Contacts Table (Ensuring it exists with new fields from previous step just in case)
        // We won't alter it here to avoid conflicts, assuming previous steps handled it or we just insert blindly.
        // But the prompt specifically asked for these 3 new tables.

        console.log('All tables setup successfully.');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        await pool.end();
    }
};

createTables();
