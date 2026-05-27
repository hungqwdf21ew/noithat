const { sql, connect } = require('../configs/database.config');

exports.test = async (req, res) => {
  try {
    const pool = await connect();
    const result = await pool.request().query('SELECT 1 AS connected');
    return res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('DB test error:', error.message || error);
    return res.status(500).json({ success: false, message: 'DB connection test failed' });
  }
};
