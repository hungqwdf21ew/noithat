require('dotenv').config();
const sql = require('mssql');
const { connect } = require('./configs/database.config');

async function queryUsers() {
  try {
    const pool = await connect();
    console.log('Connected to DB.');
    const res = await pool.request().query('SELECT MaNguoiDung, HoTen, Email, VaiTro, TrangThai FROM dbo.NguoiDung');
    console.log('--- ALL REGISTERED USERS ---');
    console.log(res.recordset);
    process.exit(0);
  } catch (err) {
    console.error('Error querying users:', err);
    process.exit(1);
  }
}

queryUsers();
