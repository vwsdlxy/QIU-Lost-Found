const { queryAsync } = require('../config/db');
const { sanitizeInput, sanitizeItem } = require('../middleware/validate');

// ─── GET /api/items ───────────────────────────────────────────────────────────
// Optional query params: ?category=Lost|Found  &status=Active|Claimed
const getAllItems = async (req, res, next) => {
    try {
        let sql = 'SELECT * FROM report WHERE 1=1';
        const params = [];

        // Filter by category
        if (req.query.category) {
            const cat = sanitizeInput(req.query.category);
            if (!['Lost', 'Found'].includes(cat)) {
                return res.status(400).json({ success: false, message: 'Invalid category' });
            }
            sql += ' AND category = ?';
            params.push(cat);
        }

        // Filter by status
        if (req.query.status) {
            const status = sanitizeInput(req.query.status);
            if (!['Active', 'Claimed'].includes(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status' });
            }
            sql += ' AND status = ?';
            params.push(status);
        }

        // Filter by email (for My Reports page)
        if (req.query.email) {
            sql += ' AND contact_email = ?';
            params.push(sanitizeInput(req.query.email));
        }

        sql += ' ORDER BY created_at DESC';

        const items = await queryAsync(sql, params);

        res.json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

// ─── GET /api/items/stats ─────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
    try {
        const stats = await queryAsync(`
            SELECT
                COUNT(*) AS total,
                SUM(category = 'Lost') AS lost,
                SUM(category = 'Found') AS found,
                SUM(status = 'Active') AS active,
                SUM(status = 'Claimed') AS claimed
            FROM report
        `, []);

        res.json({ success: true, data: stats[0] });
    } catch (error) {
        next(error);
    }
};

// ─── GET /api/items/category/:category ───────────────────────────────────────
const getItemsByCategory = async (req, res, next) => {
    try {
        const category = sanitizeInput(req.params.category);

        if (!['Lost', 'Found'].includes(category)) {
            return res.status(400).json({ success: false, message: 'Invalid category. Use Lost or Found.' });
        }

        // Parameterized query — prevents SQL injection
        const items = await queryAsync(
            'SELECT * FROM report WHERE category = ? ORDER BY created_at DESC',
            [category]
        );

        res.json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

// ─── GET /api/items/:id ───────────────────────────────────────────────────────
const getItem = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid item ID' });
        }

        const items = await queryAsync(
            'SELECT * FROM report WHERE id = ?',
            [id]
        );

        if (items.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        res.json({ success: true, data: items[0] });
    } catch (error) {
        next(error);
    }
};

// ─── POST /api/items ──────────────────────────────────────────────────────────
const createItem = async (req, res, next) => {
    try {
        // Server-side validation
        const { title, description, category, location, contact_email, contact_phone, status } = req.body;

        const errors = [];

        if (!title || title.trim().length === 0)           errors.push('Title is required');
        if (title && title.trim().length > 255)            errors.push('Title must be under 255 characters');
        if (!description || description.trim().length === 0) errors.push('Description is required');
        if (!category)                                     errors.push('Category is required');
        if (!['Lost', 'Found'].includes(category))         errors.push('Category must be Lost or Found');
        if (!location || location.trim().length === 0)     errors.push('Location is required');
        if (location && location.trim().length > 255)      errors.push('Location must be under 255 characters');

        if (!contact_email && !contact_phone) {
            errors.push('At least one contact method is required');
        }

        if (contact_email) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@qiu\.edu\.my$/;
            if (!emailPattern.test(contact_email.trim())) {
                errors.push('Please use a valid QIU email (xxxx@qiu.edu.my)');
            }
        }

        if (contact_phone) {
            const phoneDigits = contact_phone.replace(/\D/g, '');
            if (phoneDigits.length < 8 || phoneDigits.length > 15) {
                errors.push('Please enter a valid phone number');
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: errors.join(', ') });
        }

        // Sanitize all inputs before storing
        const clean = sanitizeItem({
            title, description, category, location,
            contact_email: contact_email || null,
            contact_phone: contact_phone || null,
            status: status || 'Active'
        });

        // Parameterized INSERT — prevents SQL injection
        const result = await queryAsync(
            `INSERT INTO report (title, description, category, location, contact_email, contact_phone, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [clean.title, clean.description, clean.category, clean.location,
             clean.contact_email, clean.contact_phone, clean.status]
        );

        // Fetch the newly created record
        const newItem = await queryAsync('SELECT * FROM report WHERE id = ?', [result.insertId]);

        res.status(201).json({ success: true, data: newItem[0] });
    } catch (error) {
        next(error);
    }
};

// ─── PUT /api/items/:id ───────────────────────────────────────────────────────
const updateItem = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid item ID' });
        }

        // Check item exists
        const existing = await queryAsync('SELECT * FROM report WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        const { title, description, category, location, contact_email, contact_phone, status } = req.body;

        const errors = [];

        if (title !== undefined) {
            if (title.trim().length === 0)   errors.push('Title cannot be empty');
            if (title.trim().length > 255)   errors.push('Title must be under 255 characters');
        }
        if (category !== undefined && !['Lost', 'Found'].includes(category)) {
            errors.push('Category must be Lost or Found');
        }
        if (status !== undefined && !['Active', 'Claimed'].includes(status)) {
            errors.push('Status must be Active or Claimed');
        }
        if (contact_email !== undefined && contact_email) {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@qiu\.edu\.my$/;
            if (!emailPattern.test(contact_email.trim())) {
                errors.push('Please use a valid QIU email');
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: errors.join(', ') });
        }

        // Build update fields dynamically — only update provided fields
        const fields = [];
        const params = [];

        if (title !== undefined)         { fields.push('title = ?');         params.push(sanitizeInput(title)); }
        if (description !== undefined)   { fields.push('description = ?');   params.push(sanitizeInput(description)); }
        if (category !== undefined)      { fields.push('category = ?');      params.push(sanitizeInput(category)); }
        if (location !== undefined)      { fields.push('location = ?');      params.push(sanitizeInput(location)); }
        if (contact_email !== undefined) { fields.push('contact_email = ?'); params.push(sanitizeInput(contact_email)); }
        if (contact_phone !== undefined) { fields.push('contact_phone = ?'); params.push(sanitizeInput(contact_phone)); }
        if (status !== undefined)        { fields.push('status = ?');        params.push(sanitizeInput(status)); }

        if (fields.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        params.push(id);
        await queryAsync(`UPDATE report SET ${fields.join(', ')} WHERE id = ?`, params);

        const updated = await queryAsync('SELECT * FROM report WHERE id = ?', [id]);
        res.json({ success: true, data: updated[0] });
    } catch (error) {
        next(error);
    }
};

// ─── PATCH /api/items/:id/status ─────────────────────────────────────────────
const updateItemStatus = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid item ID' });
        }

        const { status } = req.body;

        if (!status || !['Active', 'Claimed'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Status must be Active or Claimed' });
        }

        const existing = await queryAsync('SELECT * FROM report WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        await queryAsync('UPDATE report SET status = ? WHERE id = ?', [status, id]);

        const updated = await queryAsync('SELECT * FROM report WHERE id = ?', [id]);
        res.json({ success: true, data: updated[0] });
    } catch (error) {
        next(error);
    }
};

// ─── DELETE /api/items/:id ────────────────────────────────────────────────────
const deleteItem = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid item ID' });
        }

        const existing = await queryAsync('SELECT * FROM report WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        await queryAsync('DELETE FROM report WHERE id = ?', [id]);

        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllItems,
    getStats,
    getItemsByCategory,
    getItem,
    createItem,
    updateItem,
    updateItemStatus,
    deleteItem
};