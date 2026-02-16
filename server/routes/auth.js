const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database');

const router = express.Router();
const SECRET_KEY = process.env.SESSION_SECRET || 'supersecretkey';

// Register
router.post('/register', async (req, res) => {
    const { username, password, email, phone } = req.body;
    const role = 'user'; // Default role

    if (!username || !password || !email || !phone) {
        return res.status(400).json({ error: 'Please fill all fields' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        await db.query(
            `INSERT INTO users (username, password, email, phone, role) VALUES ($1, $2, $3, $4, $5)`,
            [username, hashedPassword, email, phone, role]
        );
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        if (err.code === '23505') { // Postgres unique violation code
            return res.status(400).json({ error: 'Username or Email already exists' });
        }
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
        const user = result.rows[0];

        if (!user) {
            console.log('Login failed: User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            console.log('Login failed: Invalid password for user', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, email: user.email, phone: user.phone } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

module.exports = router;
