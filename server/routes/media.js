const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database');

const router = express.Router();

// Configure Multer for storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Middleware to check auth (simplified)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    const jwt = require('jsonwebtoken');
    jwt.verify(token, 'supersecretkey', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Upload Media
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
    const { description, type } = req.body; // type: 'image' or 'video'
    const userId = req.user.id;
    const filename = req.file.filename;

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    db.run(
        `INSERT INTO media (user_id, filename, type, description) VALUES (?, ?, ?, ?)`,
        [userId, filename, type || 'image', description || ''],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Upload successful', media: { id: this.lastID, filename, description } });
        }
    );
});

// Get All Media
router.get('/', (req, res) => {
    db.all(`SELECT media.*, users.username FROM media JOIN users ON media.user_id = users.id ORDER BY media.created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Download Media (File access is handled by static middleware, but this is API to get info)
router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM media WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Media not found' });
        res.json(row);
    });
});

// Save/Bookmark Media
router.post('/save/:id', authenticateToken, (req, res) => {
    const mediaId = req.params.id;
    const userId = req.user.id;

    db.run(`INSERT INTO saved_media (user_id, media_id) VALUES (?, ?)`, [userId, mediaId], function(err) {
        if (err) return res.status(400).json({ error: 'Already saved or error' });
        res.json({ message: 'Media saved' });
    });
});

// Get Saved Media
router.get('/user/saved', authenticateToken, (req, res) => {
    const userId = req.user.id;
    db.all(
        `SELECT media.*, users.username FROM saved_media 
         JOIN media ON saved_media.media_id = media.id 
         JOIN users ON media.user_id = users.id
         WHERE saved_media.user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

module.exports = router;
