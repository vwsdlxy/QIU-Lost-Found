const dotenv = require('dotenv');
dotenv.config(); // MUST be first — loads .env before anything else reads process.env

const express = require('express');
const path = require('path');
const cors = require('cors');

const { connectDB } = require('./config/db');
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const { securityHeaders, validateContentType } = require('./middleware/validate');

// Connect to MySQL
connectDB();

const app = express();

// ─── Security Headers (sets X-XSS-Protection, X-Frame-Options, etc.) ─────────
app.use(securityHeaders);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Body Parsing Middleware ───────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Content-Type Validation ──────────────────────────────────────────────────
app.use(validateContentType);

// ─── Static Files (your frontend HTML/CSS/JS) ─────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/items', itemRoutes);
app.use('/api', authRoutes);

// ─── API Info ─────────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'Lost and Found API',
        version: '1.0.0',
        endpoints: {
            'GET    /api/items':                  'Get all items (supports ?category=Lost|Found &status=Active|Claimed &email=)',
            'GET    /api/items/stats':            'Get item statistics',
            'GET    /api/items/category/:cat':    'Get items by category',
            'GET    /api/items/:id':              'Get single item',
            'POST   /api/items':                  'Create new report',
            'PUT    /api/items/:id':              'Update full item',
            'PATCH  /api/items/:id/status':       'Update item status only',
            'DELETE /api/items/:id':              'Delete a report',
            'POST   /api/login':                  'Login with QIU email'
        }
    });
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'API is working!', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`API info: http://localhost:${PORT}/api`);
});