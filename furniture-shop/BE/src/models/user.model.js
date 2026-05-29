const { sql, connect } = require('../configs/database.config');

const UserModel = {
  // Tìm user theo email
  findByEmail: async (email) => {
    const pool = await connect();
    const result = await pool.request()
      .input('Email', sql.NVarChar(150), email)
      .query(`
        SELECT MaNguoiDung, HoTen, Email, MatKhauHash, SoDienThoai,
               AnhDaiDien, VaiTro, TrangThai, NgayTao
        FROM dbo.NguoiDung
        WHERE Email = @Email
      `);
    return result.recordset[0] || null;
  },

  // Tìm user theo ID
  findById: async (id) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaNguoiDung', sql.Int, id)
      .query(`
        SELECT MaNguoiDung, HoTen, Email, SoDienThoai,
               AnhDaiDien, VaiTro, TrangThai, NgayTao
        FROM dbo.NguoiDung
        WHERE MaNguoiDung = @MaNguoiDung
      `);
    return result.recordset[0] || null;
  },

  // Tạo user mới
  create: async ({ hoTen, email, matKhauHash, soDienThoai }) => {
    const pool = await connect();
    const result = await pool.request()
      .input('HoTen',       sql.NVarChar(100), hoTen)
      .input('Email',       sql.NVarChar(150), email)
      .input('MatKhauHash', sql.NVarChar(255), matKhauHash)
      .input('SoDienThoai', sql.NVarChar(20),  soDienThoai || null)
      .query(`
        INSERT INTO dbo.NguoiDung (HoTen, Email, MatKhauHash, SoDienThoai)
        OUTPUT INSERTED.MaNguoiDung, INSERTED.HoTen, INSERTED.Email,
               INSERTED.SoDienThoai, INSERTED.VaiTro, INSERTED.TrangThai, INSERTED.NgayTao
        VALUES (@HoTen, @Email, @MatKhauHash, @SoDienThoai)
      `);
    return result.recordset[0];
  },

  // Kiểm tra email đã tồn tại chưa
  emailExists: async (email) => {
    const pool = await connect();
    const result = await pool.request()
      .input('Email', sql.NVarChar(150), email)
      .query(`SELECT COUNT(1) AS cnt FROM dbo.NguoiDung WHERE Email = @Email`);
    return result.recordset[0].cnt > 0;
  },
};

module.exports = UserModel;
