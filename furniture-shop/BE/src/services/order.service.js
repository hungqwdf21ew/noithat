const { sql, connect } = require('../configs/database.config');
const { sendOrderConfirmationEmail } = require('../helpers/mail.helper');

// Tạo mã đơn hàng duy nhất: DH + yyyyMMdd + 4 số ngẫu nhiên
const generateOrderCode = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `DH${date}${rand}`;
};

const buildOrderEmailHtml = ({ maDonHangCode, tenKhachHang, soDienThoai, diaChiGiaoHang, phuongThucThanhToan, tamTinh, tienGiam, phiVanChuyen, tongTien }) => `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Đơn hàng ${maDonHangCode} đã được ghi nhận</h2>
    <p>Xin chào <strong>${tenKhachHang}</strong>,</p>
    <p>Chúng tôi đã nhận được đơn hàng của bạn và đang tiến hành xử lý.</p>
    <h3>Thông tin đơn hàng</h3>
    <ul>
      <li><strong>Mã đơn hàng:</strong> ${maDonHangCode}</li>
      <li><strong>Phương thức thanh toán:</strong> ${phuongThucThanhToan}</li>
      <li><strong>Tạm tính:</strong> ${tamTinh.toLocaleString('vi-VN')}đ</li>
      <li><strong>Giảm giá:</strong> ${tienGiam.toLocaleString('vi-VN')}đ</li>
      <li><strong>Phí vận chuyển:</strong> ${phiVanChuyen.toLocaleString('vi-VN')}đ</li>
      <li><strong>Tổng cộng:</strong> ${tongTien.toLocaleString('vi-VN')}đ</li>
    </ul>
    <h3>Thông tin giao hàng</h3>
    <p>${tenKhachHang}<br />${soDienThoai}<br />${diaChiGiaoHang}</p>
    <p>Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận và giao hàng.</p>
    <p>Trân trọng,<br />Đội ngũ Lavish Heritage</p>
  </div>
`;

// ── Tạo đơn hàng (dùng chung cho khách vãng lai & đã đăng nhập) ──────────────
exports.createOrder = async (orderData, userId = null, userEmail = null) => {
  const pool = await connect();

  const {
    tenKhachHang,
    email = null,
    soDienThoai,
    diaChiGiaoHang,
    ghiChu = null,
    phuongThucThanhToan = 'THANH_TOAN_KHI_NHAN_HANG',
    items,           // [{ maSanPham, tenSanPham, donGia, soLuong }]
    maCode = null,   // mã giảm giá (tuỳ chọn)
  } = orderData;

  const customerEmail = email?.trim() || userEmail || null;

  if (!items || items.length === 0) {
    return { success: false, message: 'Đơn hàng phải có ít nhất một sản phẩm.' };
  }

  // Tính tạm tính
  const tamTinh = items.reduce((sum, i) => sum + i.donGia * i.soLuong, 0);
  const phiVanChuyen = tamTinh >= 10000000 ? 0 : 500000;

  // Xử lý mã giảm giá
  let tienGiam = 0;
  let maGiamGiaId = null;

  if (maCode) {
    const couponRes = await pool.request()
      .input('MaCode', sql.NVarChar(50), maCode.trim().toUpperCase())
      .query(`
        SELECT MaGiamGia, KieuGiam, GiaTriGiam, DonToiThieu, GiamToiDa,
               GioiHanSuDung, SoLanDaDung, NgayBatDau, NgayKetThuc, TrangThai
        FROM dbo.MaGiamGia
        WHERE MaCode = @MaCode
      `);

    const coupon = couponRes.recordset[0];
    if (!coupon) return { success: false, message: 'Mã giảm giá không tồn tại.' };
    if (coupon.TrangThai !== 'HOAT_DONG') return { success: false, message: 'Mã giảm giá đã hết hạn hoặc bị vô hiệu.' };
    if (tamTinh < coupon.DonToiThieu) return { success: false, message: `Đơn hàng tối thiểu ${coupon.DonToiThieu.toLocaleString('vi-VN')}đ để dùng mã này.` };
    if (coupon.GioiHanSuDung && coupon.SoLanDaDung >= coupon.GioiHanSuDung) return { success: false, message: 'Mã giảm giá đã hết lượt sử dụng.' };

    const now = new Date();
    if (coupon.NgayBatDau && new Date(coupon.NgayBatDau) > now) return { success: false, message: 'Mã giảm giá chưa có hiệu lực.' };
    if (coupon.NgayKetThuc && new Date(coupon.NgayKetThuc) < now) return { success: false, message: 'Mã giảm giá đã hết hạn.' };

    if (coupon.KieuGiam === 'PHAN_TRAM') {
      tienGiam = Math.round(tamTinh * coupon.GiaTriGiam / 100);
      if (coupon.GiamToiDa) tienGiam = Math.min(tienGiam, coupon.GiamToiDa);
    } else {
      tienGiam = coupon.GiaTriGiam;
    }

    maGiamGiaId = coupon.MaGiamGia;
  }

  const tongTien = Math.max(0, tamTinh - tienGiam + phiVanChuyen);
  const maDonHangCode = generateOrderCode();

  // Insert đơn hàng
  const orderRes = await pool.request()
    .input('MaDonHangCode',         sql.NVarChar(30),  maDonHangCode)
    .input('MaNguoiDung',           sql.Int,           userId)
    .input('MaGiamGia',             sql.Int,           maGiamGiaId)
    .input('TenKhachHang',          sql.NVarChar(100), tenKhachHang)
    .input('SoDienThoai',           sql.NVarChar(20),  soDienThoai)
    .input('DiaChiGiaoHang',        sql.NVarChar(255), diaChiGiaoHang)
    .input('GhiChu',                sql.NVarChar(500), ghiChu)
    .input('TamTinh',               sql.Decimal(18,2), tamTinh)
    .input('TienGiam',              sql.Decimal(18,2), tienGiam)
    .input('PhiVanChuyen',          sql.Decimal(18,2), phiVanChuyen)
    .input('TongTien',              sql.Decimal(18,2), tongTien)
    .input('PhuongThucThanhToan',   sql.NVarChar(30),  phuongThucThanhToan)
    .query(`
      INSERT INTO dbo.DonHang
        (MaDonHangCode, MaNguoiDung, MaGiamGia, TenKhachHang, SoDienThoai,
         DiaChiGiaoHang, GhiChu, TamTinh, TienGiam, PhiVanChuyen, TongTien,
         PhuongThucThanhToan)
      OUTPUT INSERTED.MaDonHang, INSERTED.MaDonHangCode, INSERTED.TrangThaiDonHang,
             INSERTED.NgayTao
      VALUES
        (@MaDonHangCode, @MaNguoiDung, @MaGiamGia, @TenKhachHang, @SoDienThoai,
         @DiaChiGiaoHang, @GhiChu, @TamTinh, @TienGiam, @PhiVanChuyen, @TongTien,
         @PhuongThucThanhToan)
    `);

  const order = orderRes.recordset[0];

  // Insert chi tiết đơn hàng
  for (const item of items) {
    await pool.request()
      .input('MaDonHang',  sql.Int,           order.MaDonHang)
      .input('MaSanPham',  sql.Int,           item.maSanPham)
      .input('TenSanPham', sql.NVarChar(255), item.tenSanPham)
      .input('DonGia',     sql.Decimal(18,2), item.donGia)
      .input('SoLuong',    sql.Int,           item.soLuong)
      .query(`
        INSERT INTO dbo.ChiTietDonHang (MaDonHang, MaSanPham, TenSanPham, DonGia, SoLuong)
        VALUES (@MaDonHang, @MaSanPham, @TenSanPham, @DonGia, @SoLuong)
      `);
  }

  // Tăng SoLanDaDung nếu dùng mã giảm giá
  if (maGiamGiaId) {
    await pool.request()
      .input('MaGiamGia', sql.Int, maGiamGiaId)
      .query(`UPDATE dbo.MaGiamGia SET SoLanDaDung = SoLanDaDung + 1 WHERE MaGiamGia = @MaGiamGia`);
  }

  if (customerEmail) {
    try {
      await sendOrderConfirmationEmail({
        to: customerEmail,
        subject: `Xác nhận đơn hàng ${maDonHangCode}`,
        html: buildOrderEmailHtml({
          maDonHangCode,
          tenKhachHang,
          soDienThoai,
          diaChiGiaoHang,
          phuongThucThanhToan,
          tamTinh,
          tienGiam,
          phiVanChuyen,
          tongTien,
        }),
      });
    } catch (mailError) {
      console.error('[sendOrderConfirmationEmail]', mailError);
    }
  }

  return {
    success: true,
    message: 'Đặt hàng thành công!',
    data: {
      maDonHang:      order.MaDonHang,
      maDonHangCode:  order.MaDonHangCode,
      trangThai:      order.TrangThaiDonHang,
      tamTinh,
      tienGiam,
      phiVanChuyen,
      tongTien,
      ngayTao:        order.NgayTao,
    },
  };
};

exports.validateCoupon = async ({ maCode, tamTinh }) => {
  const pool = await connect();
  if (!maCode) {
    return { success: false, message: 'Vui lòng nhập mã giảm giá.' };
  }

  const couponRes = await pool.request()
    .input('MaCode', sql.NVarChar(50), maCode.trim().toUpperCase())
    .query(`
      SELECT MaGiamGia, KieuGiam, GiaTriGiam, DonToiThieu, GiamToiDa,
             GioiHanSuDung, SoLanDaDung, NgayBatDau, NgayKetThuc, TrangThai
      FROM dbo.MaGiamGia
      WHERE MaCode = @MaCode
    `);

  const coupon = couponRes.recordset[0];
  if (!coupon) return { success: false, message: 'Mã giảm giá không tồn tại.' };
  if (coupon.TrangThai !== 'HOAT_DONG') return { success: false, message: 'Mã giảm giá đã hết hạn hoặc bị vô hiệu.' };
  if (tamTinh < coupon.DonToiThieu) return { success: false, message: `Đơn hàng tối thiểu ${coupon.DonToiThieu.toLocaleString('vi-VN')}đ để dùng mã này.` };
  if (coupon.GioiHanSuDung && coupon.SoLanDaDung >= coupon.GioiHanSuDung) return { success: false, message: 'Mã giảm giá đã hết lượt sử dụng.' };

  const now = new Date();
  if (coupon.NgayBatDau && new Date(coupon.NgayBatDau) > now) return { success: false, message: 'Mã giảm giá chưa có hiệu lực.' };
  if (coupon.NgayKetThuc && new Date(coupon.NgayKetThuc) < now) return { success: false, message: 'Mã giảm giá đã hết hạn.' };

  const discount = coupon.KieuGiam === 'PHAN_TRAM'
    ? Math.round(tamTinh * coupon.GiaTriGiam / 100)
    : coupon.GiaTriGiam;
  const discountAmount = coupon.GiamToiDa ? Math.min(discount, coupon.GiamToiDa) : discount;

  return {
    success: true,
    message: 'Mã giảm giá hợp lệ.',
    data: {
      discount: discountAmount,
      code: maCode.trim().toUpperCase(),
    },
  };
};

// ── Lấy danh sách đơn hàng của user đã đăng nhập ─────────────────────────────
exports.getMyOrders = async (userId) => {
  const pool = await connect();

  const res = await pool.request()
    .input('MaNguoiDung', sql.Int, userId)
    .query(`
      SELECT
        dh.MaDonHang, dh.MaDonHangCode, dh.TenKhachHang, dh.SoDienThoai,
        dh.DiaChiGiaoHang, dh.GhiChu,
        dh.TamTinh, dh.TienGiam, dh.PhiVanChuyen, dh.TongTien,
        dh.TrangThaiDonHang, dh.PhuongThucThanhToan, dh.TrangThaiThanhToan,
        dh.NgayTao, dh.NgayCapNhat
      FROM dbo.DonHang dh
      WHERE dh.MaNguoiDung = @MaNguoiDung
      ORDER BY dh.NgayTao DESC
    `);

  return { success: true, data: res.recordset };
};

// ── Lấy chi tiết 1 đơn hàng (user chỉ xem được đơn của mình) ─────────────────
exports.getOrderDetail = async (maDonHang, userId = null) => {
  const pool = await connect();

  // Lấy header đơn hàng
  const orderReq = pool.request().input('MaDonHang', sql.Int, maDonHang);
  if (userId) orderReq.input('MaNguoiDung', sql.Int, userId);

  const orderRes = await orderReq.query(`
    SELECT
      dh.MaDonHang, dh.MaDonHangCode, dh.TenKhachHang, dh.SoDienThoai,
      dh.DiaChiGiaoHang, dh.GhiChu,
      dh.TamTinh, dh.TienGiam, dh.PhiVanChuyen, dh.TongTien,
      dh.TrangThaiDonHang, dh.PhuongThucThanhToan, dh.TrangThaiThanhToan,
      dh.NgayTao, dh.NgayCapNhat
    FROM dbo.DonHang dh
    WHERE dh.MaDonHang = @MaDonHang
    ${userId ? 'AND dh.MaNguoiDung = @MaNguoiDung' : ''}
  `);

  const order = orderRes.recordset[0];
  if (!order) return { success: false, message: 'Không tìm thấy đơn hàng.' };

  // Lấy chi tiết sản phẩm
  const itemsRes = await pool.request()
    .input('MaDonHang', sql.Int, maDonHang)
    .query(`
      SELECT ct.MaChiTietDonHang, ct.MaSanPham, ct.TenSanPham, ct.DonGia, ct.SoLuong,
             sp.HinhAnhChinh, sp.DuongDan
      FROM dbo.ChiTietDonHang ct
      LEFT JOIN dbo.SanPham sp ON sp.MaSanPham = ct.MaSanPham
      WHERE ct.MaDonHang = @MaDonHang
    `);

  return {
    success: true,
    data: { ...order, chiTiet: itemsRes.recordset },
  };
};

// ── Huỷ đơn hàng (chỉ khi đang CHO_XAC_NHAN) ─────────────────────────────────
exports.cancelOrder = async (maDonHang, userId) => {
  const pool = await connect();

  const res = await pool.request()
    .input('MaDonHang',   sql.Int, maDonHang)
    .input('MaNguoiDung', sql.Int, userId)
    .query(`
      UPDATE dbo.DonHang
      SET TrangThaiDonHang = N'DA_HUY', NgayCapNhat = SYSDATETIME()
      OUTPUT INSERTED.MaDonHang, INSERTED.TrangThaiDonHang
      WHERE MaDonHang = @MaDonHang
        AND MaNguoiDung = @MaNguoiDung
        AND TrangThaiDonHang = N'CHO_XAC_NHAN'
    `);

  if (res.recordset.length === 0) {
    return { success: false, message: 'Không thể huỷ đơn hàng này. Đơn hàng không tồn tại hoặc đã được xử lý.' };
  }

  return { success: true, message: 'Đã huỷ đơn hàng thành công.' };
};
