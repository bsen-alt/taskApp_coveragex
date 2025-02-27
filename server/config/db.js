require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'todo_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to test the connection with retries
async function connectWithRetry() {
  let retries = 5;
  while (retries) {
    try {
      await pool.getConnection();
      console.log('MySQL Database Connected');
      break;
    } catch (err) {
      console.error('MySQL Connection Error:', err);
      retries -= 1;
      if (retries === 0) {
        throw new Error('Unable to connect to MySQL after several attempts');
      }
      console.log('Retrying in 5 seconds...');
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

connectWithRetry();

module.exports = pool;
