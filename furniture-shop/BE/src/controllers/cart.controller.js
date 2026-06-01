const { sql, connect } = require('../configs/database.config');

/* ─────────────────────────────────────────
   Lấy hoặc tạo GioHang cho user
───────────────────────────────────────── */
const getOrCreateCart = async (pool, userId) => {
  let result = await pool.request()
    .input('MaNguoiDung', sql.Int, userId)
    .query('SELECT MaGioHang FROM dbo.GioHang WHERE MaNguoiDung = @MaNguoiDung');

  if (result.recordset[0]) return result.recordset[0].MaGioHang;

  result = await pool.request()
    .input('MaNguoiDung', sql.Int, userId)
    .query(`
      INSERT INTO dbo.GioHang (MaNguoiDung)
      OUTPUT INSERTED.MaGioHang
      VALUES (@MaNguoiDung)
    `);
  return result.recordset[0].MaGioHang;
};

/* ─────────────────────────────────────────
   GET /api/cart  — Lấy giỏ hàng của user
───────────────────────────────────────── */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await connect();
    const cartId = await getOrCreateCart(pool, userId);

    const result = await pool.request()
      .input('MaGioHang', sql.Int, cartId)
      .query(`
        SELECT
          ct.MaChiTietGioHang,
          ct.MaSanPham        AS id,
          ct.SoLuong          AS quantity,
          sp.TenSanPham       AS name,
          sp.DuongDan         AS slug,
          sp.MaSKU            AS sku,
          sp.HinhAnhChinh     AS image,
          CASE WHEN sp.GiaKhuyenMai IS NOT NULL
               THEN sp.GiaKhuyenMai
               ELSE sp.GiaBan
          END                 AS price,
          sp.GiaBan           AS originalPrice,
          sp.SoLuongTon       AS stock
        FROM dbo.ChiTietGioHang ct
        JOIN dbo.SanPham sp ON sp.MaSanPham = ct.MaSanPham
        WHERE ct.MaGioHang = @MaGioHang
        ORDER BY ct.NgayTao DESC
      `);

    return res.json({
      success: true,
      data: {
        cartId,
        items: result.recordset.map(r => ({
          ...r,
          price:         Number(r.price),
          originalPrice: Number(r.originalPrice),
          selectedColor: null,
          selectedSize:  null,
        })),
      },
    });
  } catch (error) {
    console.error('[cart.getCart]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   POST /api/cart  — Thêm sản phẩm vào giỏ
   Body: { productId, quantity }
───────────────────────────────────────── */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) return res.status(400).json({ success: false, message: 'Thiếu productId.' });

    const pool = await connect();
    const cartId = await getOrCreateCart(pool, userId);

    // Kiểm tra đã có chưa
    const existing = await pool.request()
      .input('MaGioHang', sql.Int, cartId)
      .input('MaSanPham', sql.Int, productId)
      .query('SELECT MaChiTietGioHang, SoLuong FROM dbo.ChiTietGioHang WHERE MaGioHang = @MaGioHang AND MaSanPham = @MaSanPham');

    if (existing.recordset[0]) {
      // Cộng thêm số lượng
      await pool.request()
        .input('MaChiTietGioHang', sql.Int, existing.recordset[0].MaChiTietGioHang)
        .input('SoLuong', sql.Int, existing.recordset[0].SoLuong + quantity)
        .query('UPDATE dbo.ChiTietGioHang SET SoLuong = @SoLuong, NgayCapNhat = SYSDATETIME() WHERE MaChiTietGioHang = @MaChiTietGioHang');
    } else {
      // Thêm mới
      await pool.request()
        .input('MaGioHang', sql.Int, cartId)
        .input('MaSanPham', sql.Int, productId)
        .input('SoLuong', sql.Int, quantity)
        .query('INSERT INTO dbo.ChiTietGioHang (MaGioHang, MaSanPham, SoLuong) VALUES (@MaGioHang, @MaSanPham, @SoLuong)');
    }

    return res.json({ success: true, message: 'Đã thêm vào giỏ hàng.' });
  } catch (error) {
    console.error('[cart.addToCart]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   PUT /api/cart/:productId  — Cập nhật số lượng
   Body: { quantity }
───────────────────────────────────────── */
exports.updateItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    if (!quantity || quantity < 1) return res.status(400).json({ success: false, message: 'Số lượng không hợp lệ.' });

    const pool = await connect();
    const cartId = await getOrCreateCart(pool, userId);

    await pool.request()
      .input('MaGioHang', sql.Int, cartId)
      .input('MaSanPham', sql.Int, productId)
      .input('SoLuong', sql.Int, quantity)
      .query('UPDATE dbo.ChiTietGioHang SET SoLuong = @SoLuong, NgayCapNhat = SYSDATETIME() WHERE MaGioHang = @MaGioHang AND MaSanPham = @MaSanPham');

    return res.json({ success: true, message: 'Đã cập nhật số lượng.' });
  } catch (error) {
    console.error('[cart.updateItem]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   DELETE /api/cart/:productId  — Xóa 1 sản phẩm
───────────────────────────────────────── */
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);
    const pool = await connect();
    const cartId = await getOrCreateCart(pool, userId);

    await pool.request()
      .input('MaGioHang', sql.Int, cartId)
      .input('MaSanPham', sql.Int, productId)
      .query('DELETE FROM dbo.ChiTietGioHang WHERE MaGioHang = @MaGioHang AND MaSanPham = @MaSanPham');

    return res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ.' });
  } catch (error) {
    console.error('[cart.removeItem]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   DELETE /api/cart  — Xóa toàn bộ giỏ hàng
───────────────────────────────────────── */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = await connect();
    const cartId = await getOrCreateCart(pool, userId);

    await pool.request()
      .input('MaGioHang', sql.Int, cartId)
      .query('DELETE FROM dbo.ChiTietGioHang WHERE MaGioHang = @MaGioHang');

    return res.json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng.' });
  } catch (error) {
    console.error('[cart.clearCart]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   POST /api/cart/sync  — Đồng bộ cart từ localStorage lên DB
   Body: { items: [{ productId, quantity }] }
   Gọi khi user vừa đăng nhập (sau khi merge guest cart)
───────────────────────────────────────── */
exports.syncCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items = [] } = req.body;
    const pool = await connect();
    const cartId = await getOrCreateCart(pool, userId);

    for (const item of items) {
      if (!item.productId || !item.quantity) continue;

      const existing = await pool.request()
        .input('MaGioHang', sql.Int, cartId)
        .input('MaSanPham', sql.Int, item.productId)
        .query('SELECT MaChiTietGioHang, SoLuong FROM dbo.ChiTietGioHang WHERE MaGioHang = @MaGioHang AND MaSanPham = @MaSanPham');

      if (existing.recordset[0]) {
        await pool.request()
          .input('MaChiTietGioHang', sql.Int, existing.recordset[0].MaChiTietGioHang)
          .input('SoLuong', sql.Int, Math.max(existing.recordset[0].SoLuong, item.quantity))
          .query('UPDATE dbo.ChiTietGioHang SET SoLuong = @SoLuong, NgayCapNhat = SYSDATETIME() WHERE MaChiTietGioHang = @MaChiTietGioHang');
      } else {
        await pool.request()
          .input('MaGioHang', sql.Int, cartId)
          .input('MaSanPham', sql.Int, item.productId)
          .input('SoLuong', sql.Int, item.quantity)
          .query('INSERT INTO dbo.ChiTietGioHang (MaGioHang, MaSanPham, SoLuong) VALUES (@MaGioHang, @MaSanPham, @SoLuong)');
      }
    }

    return res.json({ success: true, message: 'Đồng bộ giỏ hàng thành công.' });
  } catch (error) {
    console.error('[cart.syncCart]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};
