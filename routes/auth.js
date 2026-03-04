const express = require('express');
const router = express.Router();
const { queryAsync } = require('../config/db');
const { sanitizeInput } = require('../middleware/validate');

// POST /api/login
// Validates credentials against the member table
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Server-side validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@qiu\.edu\.my$/;
        if (!emailPattern.test(email.trim())) {
            return res.status(400).json({ success: false, message: 'Please use a valid QIU email' });
        }

        const cleanEmail    = sanitizeInput(email);
        const cleanPassword = sanitizeInput(password);

        // Parameterized query — prevents SQL injection
        const members = await queryAsync(
            'SELECT id, name, qiu_email FROM member WHERE qiu_email = ? AND password = ?',
            [cleanEmail, cleanPassword]
        );

        if (members.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const member = members[0];

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                id:    member.id,
                name:  member.name,
                email: member.qiu_email
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/members (for admin/debug use)
router.get('/members', async (req, res, next) => {
    try {
        // Never return passwords — select only safe fields
        const members = await queryAsync(
            'SELECT id, name, qiu_email, contact FROM member',
            []
        );
        res.json({ success: true, data: members });
    } catch (error) {
        next(error);
    }
});

module.exports = router;