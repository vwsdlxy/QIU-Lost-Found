const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lost_found_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool to use promises
const promisePool = pool.promise();

// Test database connection
const connectDB = async () => {
    try {
        await promisePool.query('SELECT 1');
        console.log('MySQL connected successfully');
        console.log(`Database: ${process.env.DB_NAME || 'lost_found_db'}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

// Helper function for queries (callback style for compatibility)
const query = (sql, params, callback) => {
    pool.query(sql, params, (error, results) => {
        if (error) {
            console.error('Query error:', error);
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
};

// Helper function for promises
const queryAsync = async (sql, params) => {
    try {
        const [results] = await promisePool.query(sql, params);
        return results;
    } catch (error) {
        console.error('Query async error:', error);
        throw error;
    }
};

module.exports = { 
    promisePool, 
    connectDB,
    query,
    queryAsync 
};