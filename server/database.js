const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

const dbPath = path.resolve(__dirname, 'gallery.db');
const db = new sqlite3.Database(dbPath);

const initDatabase = () => {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT,
            phone TEXT,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Media Table (Images/Videos)
        db.run(`CREATE TABLE IF NOT EXISTS media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            filename TEXT,
            type TEXT, -- 'image' or 'video'
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // Saved/Bookmarked Media Table
        db.run(`CREATE TABLE IF NOT EXISTS saved_media (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            media_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(media_id) REFERENCES media(id)
        )`);
        
        // Check and create default admin user
        db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
            if (!row) {
                const hashedPassword = bcrypt.hashSync('admin1234', 10);
                db.run(
                    `INSERT INTO users (username, password, email, phone, role) VALUES (?, ?, ?, ?, ?)`,
                    ['admin', hashedPassword, 'admin@example.com', '0000000000', 'admin'],
                    (err) => {
                        if (err) console.error(err.message);
                        else console.log('Default admin user created: admin / admin1234');
                    }
                );
            }
        });

        console.log('Database initialized');
    });
};

module.exports = { db, initDatabase };
