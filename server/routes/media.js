const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();

// Configure Cloudinary
// Note: Credentials will be loaded from .env
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => !!process.env.CLOUDINARY_CLOUD_NAME;

// Configure Storage (Cloudinary vs Local)
let upload;

if (isCloudinaryConfigured()) {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'gallery-uploads',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'mov'],
            resource_type: 'auto', // Auto-detect image or video
        },
    });
    upload = multer({ storage: storage });
} else {
    // Fallback to local storage if no Cloudinary creds
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = 'uploads/';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    upload = multer({ storage });
}

// Middleware to check auth (simplified)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    const jwt = require('jsonwebtoken');
    const SECRET_KEY = process.env.SESSION_SECRET || 'supersecretkey';
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Upload Media
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    const { description, type } = req.body; // type: 'image' or 'video'
    const userId = req.user.id;

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Determine filename/path to store in DB
    // If Cloudinary: req.file.path (full URL)
    // If Local: req.file.filename (just name)
    let filename;
    if (isCloudinaryConfigured()) {
        filename = req.file.path; // Store full Cloudinary URL
    } else {
        filename = req.file.filename; // Store local filename
    }

    try {
        const result = await db.query(
            `INSERT INTO media (user_id, filename, type, description) VALUES ($1, $2, $3, $4) RETURNING id`,
            [userId, filename, type || 'image', description || '']
        );
        const newMediaId = result.rows[0].id;
        res.json({ message: 'Upload successful', media: { id: newMediaId, filename, description } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Media
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`SELECT media.*, users.username FROM media JOIN users ON media.user_id = users.id ORDER BY media.created_at DESC`);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Download Media (File access is handled by static middleware, but this is API to get info)
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM media WHERE id = $1`, [req.params.id]);
        const row = result.rows[0];
        if (!row) return res.status(404).json({ error: 'Media not found' });
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save/Bookmark Media
router.post('/save/:id', authenticateToken, async (req, res) => {
    const mediaId = req.params.id;
    const userId = req.user.id;

    try {
        await db.query(`INSERT INTO saved_media (user_id, media_id) VALUES ($1, $2)`, [userId, mediaId]);
        res.json({ message: 'Media saved' });
    } catch (err) {
        res.status(400).json({ error: 'Already saved or error' });
    }
});

// Get Saved Media
router.get('/user/saved', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await db.query(
            `SELECT media.*, users.username FROM saved_media 
             JOIN media ON saved_media.media_id = media.id 
             JOIN users ON media.user_id = users.id
             WHERE saved_media.user_id = $1`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
