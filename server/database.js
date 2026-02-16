const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

// Connection string from environment variable
// Format: postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn("WARNING: DATABASE_URL is missing in .env file. Please set it to connect to Supabase.");
}

const db = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false // Required for Supabase connection from some environments
    }
});

const initDatabase = async () => {
    try {
        // Users Table
        await db.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT,
            phone TEXT,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // Media Table (Images/Videos)
        await db.query(`CREATE TABLE IF NOT EXISTS media (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            filename TEXT,
            type TEXT, -- 'image' or 'video'
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // Saved/Bookmarked Media Table
        await db.query(`CREATE TABLE IF NOT EXISTS saved_media (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            media_id INTEGER REFERENCES media(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Check and create default admin user
        const adminCheck = await db.query("SELECT * FROM users WHERE username = $1", ['admin']);
        if (adminCheck.rows.length === 0) {
            const hashedPassword = bcrypt.hashSync('admin1234', 10);
            await db.query(
                `INSERT INTO users (username, password, email, phone, role) VALUES ($1, $2, $3, $4, $5)`,
                ['admin', hashedPassword, 'admin@example.com', '0000000000', 'admin']
            );
            console.log('Default admin user created: admin / admin1234');
        }

        console.log('Database initialized (PostgreSQL)');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

module.exports = { db, initDatabase };
