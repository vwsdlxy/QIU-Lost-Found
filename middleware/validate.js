const sanitizeInput = (value) => {
    if (value === null || value === undefined) return value;
    if (typeof value !== 'string') return value;

    return value
        .trim()
        // Remove script tags and their contents
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove all remaining HTML tags
        .replace(/<[^>]+>/g, '')
        // Remove javascript: protocol references
        .replace(/javascript:/gi, '')
        // Remove on* event handlers (e.g. onerror=, onclick=)
        .replace(/on\w+\s*=/gi, '');
};

/**
 * Sanitizes all string fields on an item object at once.
 */
const sanitizeItem = (item) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(item)) {
        sanitized[key] = typeof value === 'string' ? sanitizeInput(value) : value;
    }
    return sanitized;
};

/**
 * Sets security-related HTTP response headers on every request.
 * Added as global middleware in server.js.
 */
const securityHeaders = (req, res, next) => {
    // Instructs browsers to enable their built-in XSS filter
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Prevents MIME-type sniffing (stops browsers from interpreting
    // files as a different MIME type than what is declared)
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Prevents the page from being embedded in an iframe (clickjacking)
    res.setHeader('X-Frame-Options', 'DENY');

    // Restricts referrer information to improve privacy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
};

/**
 * Ensures POST/PUT/PATCH requests declare Content-Type: application/json.
 * Rejects other content types early before parsing begins.
 */
const validateContentType = (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        const contentType = req.headers['content-type'] || '';
        if (!contentType.includes('application/json')) {
            return res.status(415).json({
                success: false,
                message: 'Content-Type must be application/json'
            });
        }
    }
    next();
};

module.exports = { sanitizeInput, sanitizeItem, securityHeaders, validateContentType };