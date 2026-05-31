const { sql, connect } = require('../configs/database.config');
const fs = require('fs');
const path = require('path');

/* ─────────────────────────────────────────
   POST /api/design-room
   Lưu dự án phối phòng mới
───────────────────────────────────────── */
exports.saveDesign = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { tenDuAn, hinhAnhBase64, items = [] } = req.body;

    if (!tenDuAn) {
      return res.status(400).json({ success: false, message: 'Thiếu tên dự án.' });
    }

    // Lưu ảnh snapshot nếu có
    let hinhAnhPath = null;
    if (hinhAnhBase64) {
      const uploadsDir = path.join(__dirname, '../../uploads/designs');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const fileName = `design_${Date.now()}.png`;
      const base64Data = hinhAnhBase64.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(path.join(uploadsDir, fileName), Buffer.from(base64Data, 'base64'));
      hinhAnhPath = `/uploads/designs/${fileName}`;
    }

    const pool = await connect();

    // Tạo dự án
    const duAnResult = await pool.request()
      .input('MaNguoiDung', sql.Int, userId)
      .input('TenDuAn', sql.NVarChar(150), tenDuAn)
      .input('HinhAnhKhongGian', sql.NVarChar(500), hinhAnhPath)
      .input('TrangThai', sql.NVarChar(20), 'DA_LUU')
      .query(`
        INSERT INTO dbo.DuAnPhoiPhong (MaNguoiDung, TenDuAn, HinhAnhKhongGian, TrangThai)
        OUTPUT INSERTED.MaDuAnPhoiPhong
        VALUES (@MaNguoiDung, @TenDuAn, @HinhAnhKhongGian, @TrangThai)
      `);

    const maDuAn = duAnResult.recordset[0].MaDuAnPhoiPhong;

    // Lưu từng item
    for (const item of items) {
      await pool.request()
        .input('MaDuAnPhoiPhong', sql.Int, maDuAn)
        .input('MaSanPham', sql.Int, item.maSanPham || 1)
        .input('SoLuong', sql.Int, item.soLuong || 1)
        .input('ViTriX', sql.Decimal(10, 2), item.viTriX || 0)
        .input('ViTriY', sql.Decimal(10, 2), item.viTriY || 0)
        .input('TiLe', sql.Decimal(10, 2), item.tiLe || 1)
        .input('GocXoay', sql.Decimal(10, 2), item.gocXoay || 0)
        .query(`
          INSERT INTO dbo.ChiTietPhoiPhong
            (MaDuAnPhoiPhong, MaSanPham, SoLuong, ViTriX, ViTriY, TiLe, GocXoay)
          VALUES
            (@MaDuAnPhoiPhong, @MaSanPham, @SoLuong, @ViTriX, @ViTriY, @TiLe, @GocXoay)
        `);
    }

    return res.status(201).json({
      success: true,
      message: 'Lưu thiết kế thành công!',
      data: { maDuAn, hinhAnhPath },
    });
  } catch (error) {
    console.error('[designRoom.saveDesign]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   GET /api/design-room/:id
   Load dự án theo ID
───────────────────────────────────────── */
exports.loadDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await connect();

    const duAnResult = await pool.request()
      .input('MaDuAnPhoiPhong', sql.Int, id)
      .query(`
        SELECT MaDuAnPhoiPhong, MaNguoiDung, TenDuAn,
               HinhAnhKhongGian, TrangThai, NgayTao
        FROM dbo.DuAnPhoiPhong
        WHERE MaDuAnPhoiPhong = @MaDuAnPhoiPhong
      `);

    if (!duAnResult.recordset[0]) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy dự án.' });
    }

    const chiTietResult = await pool.request()
      .input('MaDuAnPhoiPhong', sql.Int, id)
      .query(`
        SELECT ct.MaChiTietPhoiPhong, ct.MaSanPham, ct.SoLuong,
               ct.ViTriX, ct.ViTriY, ct.TiLe, ct.GocXoay,
               sp.TenSanPham, sp.HinhAnhChinh, sp.GiaBan
        FROM dbo.ChiTietPhoiPhong ct
        JOIN dbo.SanPham sp ON sp.MaSanPham = ct.MaSanPham
        WHERE ct.MaDuAnPhoiPhong = @MaDuAnPhoiPhong
      `);

    return res.json({
      success: true,
      data: {
        duAn: duAnResult.recordset[0],
        items: chiTietResult.recordset,
      },
    });
  } catch (error) {
    console.error('[designRoom.loadDesign]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   GET /api/design-room/my-designs
   Lấy danh sách dự án của user
───────────────────────────────────────── */
exports.getMyDesigns = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Chưa đăng nhập.' });

    const pool = await connect();
    const result = await pool.request()
      .input('MaNguoiDung', sql.Int, userId)
      .query(`
        SELECT MaDuAnPhoiPhong, TenDuAn, HinhAnhKhongGian, TrangThai, NgayTao
        FROM dbo.DuAnPhoiPhong
        WHERE MaNguoiDung = @MaNguoiDung
        ORDER BY NgayTao DESC
      `);

    return res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('[designRoom.getMyDesigns]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};
