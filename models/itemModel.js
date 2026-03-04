const { promisePool } = require('../config/db');

// Get all items with optional filters
const getAllItems = async (filters = {}) => {
    let query = 'SELECT * FROM report';
    const values = [];
    const conditions = [];

    if (filters.category) {
        conditions.push('category = ?');
        values.push(filters.category);
    }
    if (filters.status) {
        conditions.push('status = ?');
        values.push(filters.status);
    }
    if (filters.search) {
        conditions.push('(title LIKE ? OR description LIKE ? OR location LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        values.push(searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await promisePool.query(query, values);
    return rows;
};

// Get item by ID
const getItemById = async (id) => {
    const [rows] = await promisePool.query('SELECT * FROM report WHERE id = ?', [id]);
    return rows[0];
};

// Create new item
const createItem = async (itemData) => {
    console.log('Model received:', JSON.stringify(itemData, null, 2));
    const {
        title,
        description,
        category,
        location,
        contact_email,
        contact_phone,
        status = 'Active'
    } = itemData;
    try {
        console.log('Attempting to insert with values:', [
            title, description, category, location, 
            contact_email || null, contact_phone || null, status
        ]);
        
        const [result] = await promisePool.query(
            `INSERT INTO report
            (title, description, category, location, contact_email, contact_phone, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description, category, location, contact_email || null, contact_phone || null, status]
        );
        
        console.log('Insert result:', result);
        return result.insertId;
    } catch (error) {
        console.error('Database error in createItem:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('SQL:', error.sql);
        throw error;
    }
};

// Update item
const updateItem = async (id, itemData) => {
    const {
        title,
        description,
        category,
        location,
        contact_email,
        contact_phone,
        status
    } = itemData;

    let query = 'UPDATE report SET ';
    const values = [];
    const updates = [];

    if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
    }
    if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
    }
    if (category !== undefined) {
        updates.push('category = ?');
        values.push(category);
    }
    if (location !== undefined) {
        updates.push('location = ?');
        values.push(location);
    }
    if (contact_email !== undefined) {
        updates.push('contact_email = ?');
        values.push(contact_email);
    }
    if (contact_phone !== undefined) {
        updates.push('contact_phone = ?');
        values.push(contact_phone);
    }
    if (status !== undefined) {
        updates.push('status = ?');
        values.push(status);
    }

    if (updates.length === 0) return false;

    query += updates.join(', ') + ' WHERE id = ?';
    values.push(id);

    const [result] = await promisePool.query(query, values);
    return result.affectedRows > 0;
};

// Delete item
const deleteItem = async (id) => {
    const [result] = await promisePool.query('DELETE FROM report WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

// Get items by category
const getItemsByCategory = async (category) => {
    const [rows] = await promisePool.query(
        'SELECT * FROM report WHERE category = ? ORDER BY created_at DESC',
        [category]
    );
    return rows;
};

// Get items by status
const getItemsByStatus = async (status) => {
    const [rows] = await promisePool.query(
        'SELECT * FROM report WHERE status = ? ORDER BY created_at DESC',
        [status]
    );
    return rows;
};

// Get statistics
const getStats = async () => {
    const [rows] = await promisePool.query(`
        SELECT
            COUNT(*) as total,
            SUM(CASE WHEN category = 'Lost' THEN 1 ELSE 0 END) as lost_count,
            SUM(CASE WHEN category = 'Found' THEN 1 ELSE 0 END) as found_count,
            SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_count,
            SUM(CASE WHEN status = 'Claimed' THEN 1 ELSE 0 END) as claimed_count
        FROM report
    `);
    return rows[0];
};

// Search items by keyword
const searchItems = async (keyword) => {
    const searchTerm = `%${keyword}%`;
    const [rows] = await promisePool.query(
        `SELECT * FROM report
         WHERE title LIKE ? OR description LIKE ? OR location LIKE ?
         ORDER BY created_at DESC`,
        [searchTerm, searchTerm, searchTerm]
    );
    return rows;
};

// Get recent items (limit)
const getRecentItems = async (limit = 10) => {
    const [rows] = await promisePool.query(
        'SELECT * FROM report ORDER BY created_at DESC LIMIT ?',
        [limit]
    );
    return rows;
};

module.exports = {
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getItemsByCategory,
    getItemsByStatus,
    getStats,
    searchItems,
    getRecentItems
};