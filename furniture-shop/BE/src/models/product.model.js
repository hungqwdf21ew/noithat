const { sql, connect } = require('../configs/database.config');

const ProductModel = {
  // Lấy tất cả sản phẩm cùng danh mục
  findAll: async () => {
    const pool = await connect();
    const result = await pool.request().query(`
      SELECT p.MaSanPham, p.MaDanhMuc, p.TenSanPham, p.DuongDan, p.MaSKU, p.MoTa,
             p.GiaBan, p.GiaKhuyenMai, p.SoLuongTon, p.ChatLieu, p.MauSac, p.KichThuoc,
             p.HinhAnhChinh, p.LaNoiBat, p.TrangThai, c.TenDanhMuc
      FROM dbo.SanPham p
      INNER JOIN dbo.DanhMuc c ON p.MaDanhMuc = c.MaDanhMuc
      ORDER BY p.NgayTao DESC
    `);
    return result.recordset;
  },

  // Tìm sản phẩm theo ID
  findById: async (id) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaSanPham', sql.Int, id)
      .query(`
        SELECT p.MaSanPham, p.MaDanhMuc, p.TenSanPham, p.DuongDan, p.MaSKU, p.MoTa,
               p.GiaBan, p.GiaKhuyenMai, p.SoLuongTon, p.ChatLieu, p.MauSac, p.KichThuoc,
               p.HinhAnhChinh, p.LaNoiBat, p.TrangThai, c.TenDanhMuc
        FROM dbo.SanPham p
        INNER JOIN dbo.DanhMuc c ON p.MaDanhMuc = c.MaDanhMuc
        WHERE p.MaSanPham = @MaSanPham
      `);
    return result.recordset[0] || null;
  },

  // Lấy tất cả danh mục để hiển thị trong select dropdown
  findAllCategories: async () => {
    const pool = await connect();
    const result = await pool.request().query(`
      SELECT MaDanhMuc, TenDanhMuc, DuongDan
      FROM dbo.DanhMuc
      WHERE TrangThai = N'HOAT_DONG'
    `);
    return result.recordset;
  },

  // Tạo sản phẩm mới
  create: async (data) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaDanhMuc',     sql.Int,           data.maDanhMuc)
      .input('TenSanPham',    sql.NVarChar(255), data.tenSanPham)
      .input('DuongDan',      sql.NVarChar(255), data.duongDan)
      .input('MaSKU',         sql.NVarChar(50),  data.maSKU || null)
      .input('MoTa',          sql.NVarChar(sql.MAX), data.moTa || null)
      .input('GiaBan',        sql.Decimal(18,2), data.giaBan)
      .input('GiaKhuyenMai',  sql.Decimal(18,2), data.giaKhuyenMai || null)
      .input('SoLuongTon',    sql.Int,           data.soLuongTon)
      .input('ChatLieu',      sql.NVarChar(100), data.chatLieu || null)
      .input('MauSac',        sql.NVarChar(100), data.mauSac || null)
      .input('KichThuoc',     sql.NVarChar(100), data.kichThuoc || null)
      .input('HinhAnhChinh',  sql.NVarChar(500), data.hinhAnhChinh || null)
      .input('TrangThai',     sql.NVarChar(30),  data.trangThai || 'HOAT_DONG')
      .query(`
        INSERT INTO dbo.SanPham (MaDanhMuc, TenSanPham, DuongDan, MaSKU, MoTa, GiaBan, GiaKhuyenMai, SoLuongTon, ChatLieu, MauSac, KichThuoc, HinhAnhChinh, TrangThai)
        OUTPUT INSERTED.MaSanPham, INSERTED.TenSanPham, INSERTED.GiaBan, INSERTED.SoLuongTon, INSERTED.HinhAnhChinh
        VALUES (@MaDanhMuc, @TenSanPham, @DuongDan, @MaSKU, @MoTa, @GiaBan, @GiaKhuyenMai, @SoLuongTon, @ChatLieu, @MauSac, @KichThuoc, @HinhAnhChinh, @TrangThai)
      `);
    return result.recordset[0];
  },

  // Cập nhật sản phẩm
  update: async (id, data) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaSanPham',     sql.Int,           id)
      .input('MaDanhMuc',     sql.Int,           data.maDanhMuc)
      .input('TenSanPham',    sql.NVarChar(255), data.tenSanPham)
      .input('DuongDan',      sql.NVarChar(255), data.duongDan)
      .input('MaSKU',         sql.NVarChar(50),  data.maSKU || null)
      .input('MoTa',          sql.NVarChar(sql.MAX), data.moTa || null)
      .input('GiaBan',        sql.Decimal(18,2), data.giaBan)
      .input('GiaKhuyenMai',  sql.Decimal(18,2), data.giaKhuyenMai || null)
      .input('SoLuongTon',    sql.Int,           data.soLuongTon)
      .input('ChatLieu',      sql.NVarChar(100), data.chatLieu || null)
      .input('MauSac',        sql.NVarChar(100), data.mauSac || null)
      .input('KichThuoc',     sql.NVarChar(100), data.kichThuoc || null)
      .input('HinhAnhChinh',  sql.NVarChar(500), data.hinhAnhChinh || null)
      .input('TrangThai',     sql.NVarChar(30),  data.trangThai || 'HOAT_DONG')
      .query(`
        UPDATE dbo.SanPham
        SET MaDanhMuc = @MaDanhMuc,
            TenSanPham = @TenSanPham,
            DuongDan = @DuongDan,
            MaSKU = @MaSKU,
            MoTa = @MoTa,
            GiaBan = @GiaBan,
            GiaKhuyenMai = @GiaKhuyenMai,
            SoLuongTon = @SoLuongTon,
            ChatLieu = @ChatLieu,
            MauSac = @MauSac,
            KichThuoc = @KichThuoc,
            HinhAnhChinh = @HinhAnhChinh,
            TrangThai = @TrangThai,
            NgayCapNhat = SYSDATETIME()
        OUTPUT INSERTED.MaSanPham, INSERTED.TenSanPham, INSERTED.GiaBan, INSERTED.SoLuongTon, INSERTED.HinhAnhChinh
        WHERE MaSanPham = @MaSanPham
      `);
    return result.recordset[0] || null;
  },

  // Xóa sản phẩm
  delete: async (id) => {
    const pool = await connect();
    const result = await pool.request()
      .input('MaSanPham', sql.Int, id)
      .query(`
        DELETE FROM dbo.SanPham
        WHERE MaSanPham = @MaSanPham
      `);
    return result.rowsAffected[0] > 0;
  }
};

module.exports = ProductModel;
