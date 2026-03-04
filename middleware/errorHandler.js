const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    // MySQL specific errors
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'Duplicate entry found' });
    }
    if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ success: false, message: 'Referenced record not found' });
    }
    if (err.code === 'ER_BAD_FIELD_ERROR') {
        return res.status(400).json({ success: false, message: 'Invalid field in request' });
    }
    if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
        return res.status(503).json({ success: false, message: 'Database connection lost. Please try again.' });
    }

    // Generic server error — hide details in production
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;