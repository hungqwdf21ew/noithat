require('dotenv').config();
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const { connect } = require('./configs/database.config');

async function resetAllPasswords() {
  try {
    const pool = await connect();
    console.log('Connected to DB.');
    
    // Hash '123456'
    const newHash = await bcrypt.hash('123456', 10);
    console.log('New hash generated:', newHash);

    // Update Admin
    await pool.request()
      .input('MatKhauHash', sql.NVarChar(500), newHash)
      .input('Email', sql.NVarChar(255), 'admin@noithat.com')
      .query('UPDATE dbo.NguoiDung SET MatKhauHash = @MatKhauHash WHERE Email = @Email');
    console.log('✅ Reset admin@noithat.com successfully!');

    // Update Customer
    await pool.request()
      .input('MatKhauHash', sql.NVarChar(500), newHash)
      .input('Email', sql.NVarChar(255), 'khachhang@gmail.com')
      .query('UPDATE dbo.NguoiDung SET MatKhauHash = @MatKhauHash WHERE Email = @Email');
    console.log('✅ Reset khachhang@gmail.com successfully!');

    process.exit(0);
  } catch (err) {
    console.error('Error resetting passwords:', err);
    process.exit(1);
  }
}

resetAllPasswords();
