const express = require('express');
const router = express.Router();
const { query } = require('../config/db'); // Fix: Import the query function

// Login endpoint
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log('🔑 Login attempt:', { email }); // Don't log password
    
    // Validate input
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }
    
    // Query the member table for the email
    const sql = 'SELECT id, name, qiu_email, contact, password FROM member WHERE qiu_email = ?';
    
    query(sql, [email], (err, results) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        console.log('📊 Query results count:', results ? results.length : 0);
        
        // Check if user exists
        if (!results || results.length === 0) {
            console.log('❌ User not found:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid account.' 
            });
        }
        
        const user = results[0];
        
        // Compare passwords (plain text for now - use bcrypt in production)
        if (user.password !== password) {
            console.log('❌ Invalid password for:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid account.' 
            });
        }
        
        // Login successful
        console.log('✅ Login successful for:', email);
        res.json({
            success: true,
            message: 'Login successful',
            userId: user.id,
            name: user.name,
            email: user.qiu_email,
            contact: user.contact
        });
    });
});

// Get user by ID
router.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    
    const sql = 'SELECT id, name, qiu_email, contact FROM member WHERE id = ?';
    
    query(sql, [userId], (err, results) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        }
        
        if (!results || results.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        res.json({
            success: true,
            data: results[0]
        });
    });
});

module.exports = router;