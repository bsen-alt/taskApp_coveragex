require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  // host: process.env.DB_HOST || '127.0.0.1',
  host: process.env.DB_HOST || 'db:3306',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'todo_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection()
  .then(() => console.log('MySQL Database Connected'))
  .catch(err => console.error('MySQL Connection Error:', err));

module.exports = pool;
