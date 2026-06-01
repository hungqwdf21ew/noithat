const { sql, connect } = require('../configs/database.config');

/* ─────────────────────────────────────────
   GET /api/reviews/product/:productId
   Lấy danh sách đánh giá đã duyệt của sản phẩm
───────────────────────────────────────── */
exports.getByProduct = async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const pool = await connect();

    const result = await pool.request()
      .input('MaSanPham', sql.Int, productId)
      .query(`
        SELECT
          dg.MaDanhGia,
          dg.MaNguoiDung,
          nd.HoTen        AS TenNguoiDung,
          dg.SoSao,
          dg.NoiDung,
          dg.TrangThai,
          dg.NgayTao,
          dg.NgayCapNhat
        FROM dbo.DanhGiaSanPham dg
        JOIN dbo.NguoiDung nd ON nd.MaNguoiDung = dg.MaNguoiDung
        WHERE dg.MaSanPham = @MaSanPham
          AND dg.TrangThai = N'DA_DUYET'
        ORDER BY dg.NgayTao DESC
      `);

    // Tính điểm trung bình
    const reviews = result.recordset;
    const avgRating = reviews.length
      ? (reviews.reduce((s, r) => s + r.SoSao, 0) / reviews.length).toFixed(1)
      : 0;

    return res.json({
      success: true,
      data: {
        reviews,
        totalReviews: reviews.length,
        avgRating: Number(avgRating),
      },
    });
  } catch (error) {
    console.error('[review.getByProduct]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   GET /api/reviews/check/:productId
   Kiểm tra user có quyền đánh giá không
   + lấy đánh giá cũ nếu đã đánh giá
───────────────────────────────────────── */
exports.checkEligibility = async (req, res) => {
  try {
    const userId    = req.user.id;
    const productId = Number(req.params.productId);
    const pool      = await connect();

    // 1. Kiểm tra đã mua và đơn hàng đã giao/hoàn thành
    const purchaseCheck = await pool.request()
      .input('MaNguoiDung', sql.Int, userId)
      .input('MaSanPham',   sql.Int, productId)
      .query(`
        SELECT TOP 1 dh.MaDonHang, dh.TrangThaiDonHang
        FROM dbo.ChiTietDonHang ct
        JOIN dbo.DonHang dh ON dh.MaDonHang = ct.MaDonHang
        WHERE dh.MaNguoiDung = @MaNguoiDung
          AND ct.MaSanPham   = @MaSanPham
          AND dh.TrangThaiDonHang IN (N'DANG_GIAO', N'HOAN_THANH')
      `);

    const canReview = purchaseCheck.recordset.length > 0;

    // 2. Kiểm tra đã đánh giá chưa (bất kể trạng thái)
    const existingReview = await pool.request()
      .input('MaNguoiDung', sql.Int, userId)
      .input('MaSanPham',   sql.Int, productId)
      .query(`
        SELECT MaDanhGia, SoSao, NoiDung, TrangThai, NgayTao
        FROM dbo.DanhGiaSanPham
        WHERE MaNguoiDung = @MaNguoiDung AND MaSanPham = @MaSanPham
      `);

    return res.json({
      success: true,
      data: {
        canReview,
        existingReview: existingReview.recordset[0] || null,
      },
    });
  } catch (error) {
    console.error('[review.checkEligibility]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   POST /api/reviews
   Tạo đánh giá mới
   Body: { productId, soSao, noiDung }
───────────────────────────────────────── */
exports.create = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, soSao, noiDung } = req.body;

    if (!productId || !soSao) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đánh giá.' });
    }
    if (soSao < 1 || soSao > 5) {
      return res.status(400).json({ success: false, message: 'Số sao phải từ 1 đến 5.' });
    }

    const pool = await connect();

    // Kiểm tra đã mua và đơn hàng đã giao/hoàn thành
    const purchaseCheck = await pool.request()
      .input('MaNguoiDung', sql.Int, userId)
      .input('MaSanPham',   sql.Int, productId)
      .query(`
        SELECT TOP 1 1 AS ok
        FROM dbo.ChiTietDonHang ct
        JOIN dbo.DonHang dh ON dh.MaDonHang = ct.MaDonHang
        WHERE dh.MaNguoiDung = @MaNguoiDung
          AND ct.MaSanPham   = @MaSanPham
          AND dh.TrangThaiDonHang IN (N'DANG_GIAO', N'HOAN_THANH')
      `);

    if (!purchaseCheck.recordset[0]) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chỉ có thể đánh giá sản phẩm đã mua và đã được giao hàng.',
      });
    }

    // Kiểm tra đã đánh giá chưa
    const existing = await pool.request()
      .input('MaNguoiDung', sql.Int, userId)
      .input('MaSanPham',   sql.Int, productId)
      .query('SELECT MaDanhGia FROM dbo.DanhGiaSanPham WHERE MaNguoiDung = @MaNguoiDung AND MaSanPham = @MaSanPham');

    if (existing.recordset[0]) {
      return res.status(409).json({
        success: false,
        message: 'Bạn đã đánh giá sản phẩm này rồi. Vui lòng sử dụng chức năng sửa đánh giá.',
      });
    }

    // Tạo đánh giá mới (trạng thái CHO_DUYET)
    const result = await pool.request()
      .input('MaNguoiDung', sql.Int,          userId)
      .input('MaSanPham',   sql.Int,          productId)
      .input('SoSao',       sql.Int,          soSao)
      .input('NoiDung',     sql.NVarChar(1000), noiDung || null)
      .query(`
        INSERT INTO dbo.DanhGiaSanPham (MaNguoiDung, MaSanPham, SoSao, NoiDung, TrangThai)
        OUTPUT INSERTED.MaDanhGia, INSERTED.SoSao, INSERTED.NoiDung,
               INSERTED.TrangThai, INSERTED.NgayTao
        VALUES (@MaNguoiDung, @MaSanPham, @SoSao, @NoiDung, N'CHO_DUYET')
      `);

    return res.status(201).json({
      success: true,
      message: 'Đánh giá của bạn đã được gửi và đang chờ duyệt.',
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('[review.create]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   PUT /api/reviews/:reviewId
   Sửa đánh giá (chỉ chủ sở hữu)
   Body: { soSao, noiDung }
───────────────────────────────────────── */
exports.update = async (req, res) => {
  try {
    const userId   = req.user.id;
    const reviewId = Number(req.params.reviewId);
    const { soSao, noiDung } = req.body;

    if (soSao && (soSao < 1 || soSao > 5)) {
      return res.status(400).json({ success: false, message: 'Số sao phải từ 1 đến 5.' });
    }

    const pool = await connect();

    // Kiểm tra đánh giá tồn tại và thuộc về user
    const existing = await pool.request()
      .input('MaDanhGia',   sql.Int, reviewId)
      .input('MaNguoiDung', sql.Int, userId)
      .query('SELECT MaDanhGia FROM dbo.DanhGiaSanPham WHERE MaDanhGia = @MaDanhGia AND MaNguoiDung = @MaNguoiDung');

    if (!existing.recordset[0]) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đánh giá.' });
    }

    // Cập nhật — reset về CHO_DUYET để admin duyệt lại
    const result = await pool.request()
      .input('MaDanhGia', sql.Int,          reviewId)
      .input('SoSao',     sql.Int,          soSao)
      .input('NoiDung',   sql.NVarChar(1000), noiDung || null)
      .query(`
        UPDATE dbo.DanhGiaSanPham
        SET SoSao       = @SoSao,
            NoiDung     = @NoiDung,
            TrangThai   = N'CHO_DUYET',
            NgayCapNhat = SYSDATETIME()
        OUTPUT INSERTED.MaDanhGia, INSERTED.SoSao, INSERTED.NoiDung,
               INSERTED.TrangThai, INSERTED.NgayCapNhat
        WHERE MaDanhGia = @MaDanhGia
      `);

    return res.json({
      success: true,
      message: 'Đánh giá đã được cập nhật và đang chờ duyệt lại.',
      data: result.recordset[0],
    });
  } catch (error) {
    console.error('[review.update]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   GET /api/reviews/admin/pending
   Admin: lấy danh sách đánh giá chờ duyệt
───────────────────────────────────────── */
exports.getPending = async (req, res) => {
  try {
    const pool = await connect();
    const result = await pool.request().query(`
      SELECT
        dg.MaDanhGia, dg.MaSanPham, dg.MaNguoiDung,
        nd.HoTen AS TenNguoiDung, nd.Email,
        sp.TenSanPham,
        dg.SoSao, dg.NoiDung, dg.TrangThai, dg.NgayTao
      FROM dbo.DanhGiaSanPham dg
      JOIN dbo.NguoiDung nd ON nd.MaNguoiDung = dg.MaNguoiDung
      JOIN dbo.SanPham   sp ON sp.MaSanPham   = dg.MaSanPham
      WHERE dg.TrangThai = N'CHO_DUYET'
      ORDER BY dg.NgayTao ASC
    `);
    return res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('[review.getPending]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

/* ─────────────────────────────────────────
   PATCH /api/reviews/admin/:reviewId/status
   Admin: duyệt hoặc từ chối đánh giá
   Body: { status: 'DA_DUYET' | 'TU_CHOI' }
───────────────────────────────────────── */
exports.updateStatus = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);
    const { status } = req.body;

    if (!['DA_DUYET', 'TU_CHOI'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
    }

    const pool = await connect();
    await pool.request()
      .input('MaDanhGia', sql.Int,        reviewId)
      .input('TrangThai', sql.NVarChar(20), status)
      .query(`
        UPDATE dbo.DanhGiaSanPham
        SET TrangThai = @TrangThai, NgayCapNhat = SYSDATETIME()
        WHERE MaDanhGia = @MaDanhGia
      `);

    return res.json({
      success: true,
      message: status === 'DA_DUYET' ? 'Đã phê duyệt đánh giá.' : 'Đã ẩn đánh giá.',
    });
  } catch (error) {
    console.error('[review.updateStatus]', error.message);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};
