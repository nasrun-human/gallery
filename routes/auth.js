const express = require('express');


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database');

const router = express.Router();
const SECRET_KEY = 'supersecretkey'; // In prod, use .env

// Register
router.post('/register', (req, res) => {
    const { username, password, email, phone } = req.body;
    const role = 'user'; // Default role

    if (!username || !password || !email || !phone) {
        return res.status(400).json({ error: 'Please fill all fields' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        `INSERT INTO users (username, password, email, phone, role) VALUES (?, ?, ?, ?, ?)`,
        [username, hashedPassword, email, phone, role],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'Username or Email already exists' });
            }
            res.json({ message: 'User registered successfully' });
        }
    );
});

// Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) {
            console.log('Login failed: User not found or DB error', err);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            console.log('Login failed: Invalid password for user', username);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, email: user.email, phone: user.phone } });
    });
});

module.exports = router;
