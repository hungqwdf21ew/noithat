const sql = require('mssql');

// Đọc config lazily (trong hàm connect) để đảm bảo dotenv đã load xong
const getConfig = () => ({
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server:   process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  port:     Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
});

let pool = null;

const connect = async () => {
  if (pool) return pool;

  try {
    pool = await sql.connect(getConfig());
    console.log('✅ Connected to SQL Server');
    return pool;
  } catch (error) {
    console.error('❌ SQL Server connection error:', error.message || error);
    throw error;
  }
};

module.exports = { sql, connect };
