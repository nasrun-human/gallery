const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDatabase } = require('./database');
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. Serve Frontend Static Files (Built React App)
const webDistPath = fs.existsSync(path.join(__dirname, '../web/dist')) 
    ? path.join(__dirname, '../web/dist') 
    : path.join(__dirname, 'web/dist');
app.use(express.static(webDistPath));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Initialize Database
initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

// 3. Handle React Routing (SPA) - Send index.html for any other requests
// Fix: Use a regex or simple middleware to catch non-API routes
app.get(/^(?!\/api).+/, (req, res) => {
    const indexHtmlPath = path.join(__dirname, 'web/dist/index.html');
    if (fs.existsSync(indexHtmlPath)) {
        res.sendFile(indexHtmlPath);
    } else {
        res.status(404).send('Frontend build not found. Please run build command.');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
