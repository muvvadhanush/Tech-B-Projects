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

const createTables = async () => {
    try {
        // Create Orders Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                order_code text UNIQUE,
                user_email text,
                project_title text,
                mentor_name text,
                status text DEFAULT 'confirmed',
                expected_delivery date,
                support_until date,
                created_at timestamp DEFAULT now()
            );
        `);
        console.log('Orders table created/verified.');

        // Create Order Status History Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS order_status_history (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
                status text,
                notes text,
                updated_at timestamp DEFAULT now()
            );
        `);
        console.log('Order Status History table created/verified.');

        // Enable RLS on orders (Example - might need specific user role logic in real app)
        // await pool.query(`ALTER TABLE orders ENABLE ROW LEVEL SECURITY;`);
        // console.log('RLS enabled for orders.');

        // Insert Dummy Data for Testing (Order ID: TB-2025-001)
        const checkOrder = await pool.query(`SELECT * FROM orders WHERE order_code = 'TB-2025-001'`);
        if (checkOrder.rowCount === 0) {
            const orderInsert = await pool.query(`
                INSERT INTO orders (order_code, user_email, project_title, mentor_name, status, expected_delivery, support_until)
                VALUES ('TB-2025-001', 'demo@techb.com', 'AI Resume Analyzer', 'Rahul K.', 'development', '2026-03-25', '2026-04-24')
                RETURNING id;
            `);
            const orderId = orderInsert.rows[0].id;

            // Insert History
            await pool.query(`
                INSERT INTO order_status_history (order_id, status, notes, updated_at) VALUES 
                ($1, 'confirmed', 'Order received', NOW() - INTERVAL '5 days'),
                ($1, 'analysis', 'Requirements gathered', NOW() - INTERVAL '3 days'),
                ($1, 'design', 'Architecture finalized', NOW() - INTERVAL '2 days'),
                ($1, 'development', 'Core modules in progress', NOW());
            `, [orderId]);
            console.log('Dummy order TB-2025-001 created.');
        } else {
            console.log('Dummy order TB-2025-001 already exists.');
        }

    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        pool.end();
    }
};

createTables();
