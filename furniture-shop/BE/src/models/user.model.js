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

  // Cập nhật thông tin cá nhân
  updateProfile: async (id, { hoTen, soDienThoai }) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaNguoiDung', sql.Int, id)
      .input('HoTen', sql.NVarChar(100), hoTen)
      .input('SoDienThoai', sql.NVarChar(20), soDienThoai || null)
      .query(`
        UPDATE dbo.NguoiDung
        SET HoTen = @HoTen,
            SoDienThoai = @SoDienThoai,
            NgayCapNhat = SYSDATETIME()
        OUTPUT INSERTED.MaNguoiDung, INSERTED.HoTen, INSERTED.Email,
               INSERTED.SoDienThoai, INSERTED.AnhDaiDien, INSERTED.VaiTro,
               INSERTED.TrangThai, INSERTED.NgayTao
        WHERE MaNguoiDung = @MaNguoiDung
      `);
    return result.recordset[0] || null;
  },

  // Lấy danh sách tất cả người dùng
  findAll: async () => {
    const pool = await connect();
    const result = await pool.request().query(`
      SELECT MaNguoiDung, HoTen, Email, SoDienThoai, AnhDaiDien, VaiTro, TrangThai, NgayTao
      FROM dbo.NguoiDung
      ORDER BY NgayTao DESC
    `);
    return result.recordset;
  },

  // Tạo tài khoản bởi Admin
  createByAdmin: async ({ hoTen, email, matKhauHash, role }) => {
    const pool = await connect();
    const result = await pool.request()
      .input('HoTen',       sql.NVarChar(100), hoTen)
      .input('Email',       sql.NVarChar(150), email)
      .input('MatKhauHash', sql.NVarChar(255), matKhauHash)
      .input('VaiTro',      sql.NVarChar(20),  role)
      .query(`
        INSERT INTO dbo.NguoiDung (HoTen, Email, MatKhauHash, VaiTro)
        OUTPUT INSERTED.MaNguoiDung, INSERTED.HoTen, INSERTED.Email,
               INSERTED.VaiTro, INSERTED.TrangThai, INSERTED.NgayTao
        VALUES (@HoTen, @Email, @MatKhauHash, @VaiTro)
      `);
    return result.recordset[0];
  },

  // Cập nhật người dùng bởi Admin
  updateByAdmin: async (id, { hoTen, email, role, status }) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaNguoiDung', sql.Int, id)
      .input('HoTen',       sql.NVarChar(100), hoTen)
      .input('Email',       sql.NVarChar(150), email)
      .input('VaiTro',      sql.NVarChar(20),  role)
      .input('TrangThai',   sql.NVarChar(20),  status)
      .query(`
        UPDATE dbo.NguoiDung
        SET HoTen = @HoTen,
            Email = @Email,
            VaiTro = @VaiTro,
            TrangThai = @TrangThai,
            NgayCapNhat = SYSDATETIME()
        OUTPUT INSERTED.MaNguoiDung, INSERTED.HoTen, INSERTED.Email,
               INSERTED.VaiTro, INSERTED.TrangThai, INSERTED.NgayTao
        WHERE MaNguoiDung = @MaNguoiDung
      `);
    return result.recordset[0] || null;
  },

  // Thay đổi mật khẩu người dùng bởi Admin
  updatePassword: async (id, matKhauHash) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaNguoiDung', sql.Int, id)
      .input('MatKhauHash', sql.NVarChar(255), matKhauHash)
      .query(`
        UPDATE dbo.NguoiDung
        SET MatKhauHash = @MatKhauHash,
            NgayCapNhat = SYSDATETIME()
        WHERE MaNguoiDung = @MaNguoiDung
      `);
    return result.rowsAffected[0] > 0;
  },

  // Xóa tài khoản người dùng
  delete: async (id) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaNguoiDung', sql.Int, id)
      .query(`
        DELETE FROM dbo.NguoiDung
        WHERE MaNguoiDung = @MaNguoiDung
      `);
    return result.rowsAffected[0] > 0;
  },
};

module.exports = UserModel;
