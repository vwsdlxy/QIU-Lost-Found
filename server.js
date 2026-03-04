const dotenv = require('dotenv');
dotenv.config(); // MUST be FIRST - before any other code

const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectDB } = require('./config/db');
const itemRoutes = require('./routes/items');
const authRoutes = require('./routes/auth'); // We'll create this
const errorHandler = require('./middleware/errorHandler');

// Connect to database (now env vars are loaded)
connectDB();

console.log('Environment:', {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME
});

const app = express();

// CORS middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

console.log('Static path:', path.join(__dirname, 'public'));

// Routes
app.use('/api/items', itemRoutes);
app.use('/api', authRoutes); // Add auth routes (includes login)

// Home route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Lost and Found API',
        endpoints: {
            items: '/api/items',
            login: '/api/login',
            lost: '/api/items?category=Lost',
            found: '/api/items?category=Found'
        }
    });
});

// Test endpoint to check if API is working
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the app at http://localhost:${PORT}`);
    console.log(`Test login at http://localhost:${PORT}/api/test`);
});