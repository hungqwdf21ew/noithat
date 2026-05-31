const { sql, connect } = require('../configs/database.config');

const mapCoupon = (row) => ({
  id: row.MaGiamGia,
  code: row.MaCode,
  name: row.TenMa,
  type: row.KieuGiam,
  value: Number(row.GiaTriGiam),
  minOrder: Number(row.DonToiThieu),
  maxDiscount: row.GiamToiDa != null ? Number(row.GiamToiDa) : null,
  startDate: row.NgayBatDau,
  endDate: row.NgayKetThuc,
  limit: row.GioiHanSuDung,
  used: row.SoLanDaDung,
  status: row.TrangThai,
  createdAt: row.NgayTao,
});

exports.getAll = async () => {
  const pool = await connect();
  const res = await pool.request().query(`
    SELECT
      MaGiamGia, MaCode, TenMa, KieuGiam, GiaTriGiam, DonToiThieu, GiamToiDa,
      NgayBatDau, NgayKetThuc, GioiHanSuDung, SoLanDaDung, TrangThai, NgayTao
    FROM dbo.MaGiamGia
    ORDER BY NgayTao DESC
  `);
  return { success: true, data: res.recordset.map(mapCoupon) };
};

exports.getById = async (id) => {
  const pool = await connect();
  const res = await pool.request()
    .input('MaGiamGia', sql.Int, id)
    .query(`
      SELECT
        MaGiamGia, MaCode, TenMa, KieuGiam, GiaTriGiam, DonToiThieu, GiamToiDa,
        NgayBatDau, NgayKetThuc, GioiHanSuDung, SoLanDaDung, TrangThai, NgayTao
      FROM dbo.MaGiamGia
      WHERE MaGiamGia = @MaGiamGia
    `);

  const row = res.recordset[0];
  if (!row) return { success: false, message: 'Không tìm thấy mã giảm giá.' };
  return { success: true, data: mapCoupon(row) };
};

exports.create = async (payload) => {
  const {
    maCode,
    tenMa = null,
    kieuGiam,
    giaTriGiam,
    donToiThieu = 0,
    giamToiDa = null,
    ngayBatDau = null,
    ngayKetThuc = null,
    gioiHanSuDung = null,
    trangThai = 'HOAT_DONG',
  } = payload;

  if (!maCode?.trim()) return { success: false, message: 'Vui lòng nhập mã giảm giá.' };
  if (!['PHAN_TRAM', 'TIEN_MAT'].includes(kieuGiam)) {
    return { success: false, message: 'Loại giảm giá không hợp lệ.' };
  }
  if (giaTriGiam == null || Number(giaTriGiam) < 0) {
    return { success: false, message: 'Giá trị giảm không hợp lệ.' };
  }
  if (kieuGiam === 'PHAN_TRAM' && Number(giaTriGiam) > 100) {
    return { success: false, message: 'Giảm % tối đa là 100.' };
  }
  if (ngayBatDau && ngayKetThuc && new Date(ngayBatDau) > new Date(ngayKetThuc)) {
    return { success: false, message: 'Ngày kết thúc phải sau ngày bắt đầu.' };
  }
  if (!['HOAT_DONG', 'AN', 'HET_HAN'].includes(trangThai)) {
    return { success: false, message: 'Trạng thái không hợp lệ.' };
  }

  const pool = await connect();

  const dup = await pool.request()
    .input('MaCode', sql.NVarChar(50), maCode.trim().toUpperCase())
    .query(`SELECT MaGiamGia FROM dbo.MaGiamGia WHERE MaCode = @MaCode`);

  if (dup.recordset.length > 0) {
    return { success: false, message: 'Mã giảm giá đã tồn tại.' };
  }

  const res = await pool.request()
    .input('MaCode', sql.NVarChar(50), maCode.trim().toUpperCase())
    .input('TenMa', sql.NVarChar(150), tenMa?.trim() || null)
    .input('KieuGiam', sql.NVarChar(20), kieuGiam)
    .input('GiaTriGiam', sql.Decimal(18, 2), Number(giaTriGiam))
    .input('DonToiThieu', sql.Decimal(18, 2), Number(donToiThieu) || 0)
    .input('GiamToiDa', sql.Decimal(18, 2), giamToiDa != null ? Number(giamToiDa) : null)
    .input('NgayBatDau', sql.DateTime2, ngayBatDau || null)
    .input('NgayKetThuc', sql.DateTime2, ngayKetThuc || null)
    .input('GioiHanSuDung', sql.Int, gioiHanSuDung != null ? Number(gioiHanSuDung) : null)
    .input('TrangThai', sql.NVarChar(20), trangThai)
    .query(`
      INSERT INTO dbo.MaGiamGia
        (MaCode, TenMa, KieuGiam, GiaTriGiam, DonToiThieu, GiamToiDa,
         NgayBatDau, NgayKetThuc, GioiHanSuDung, TrangThai)
      OUTPUT INSERTED.MaGiamGia
      VALUES
        (@MaCode, @TenMa, @KieuGiam, @GiaTriGiam, @DonToiThieu, @GiamToiDa,
         @NgayBatDau, @NgayKetThuc, @GioiHanSuDung, @TrangThai)
    `);

  const newId = res.recordset[0].MaGiamGia;
  return exports.getById(newId).then((detail) => ({
    success: true,
    message: 'Tạo mã giảm giá thành công.',
    data: detail.data,
  }));
};

exports.update = async (id, payload) => {
  const existing = await exports.getById(id);
  if (!existing.success) return existing;

  const kieuGiam = payload.kieuGiam || existing.data.type;
  const giaTriGiam = payload.giaTriGiam != null ? Number(payload.giaTriGiam) : existing.data.value;
  if (kieuGiam === 'PHAN_TRAM' && giaTriGiam > 100) {
    return { success: false, message: 'Giảm % tối đa là 100.' };
  }

  const ngayBatDau = payload.ngayBatDau !== undefined ? payload.ngayBatDau : existing.data.startDate;
  const ngayKetThuc = payload.ngayKetThuc !== undefined ? payload.ngayKetThuc : existing.data.endDate;
  if (ngayBatDau && ngayKetThuc && new Date(ngayBatDau) > new Date(ngayKetThuc)) {
    return { success: false, message: 'Ngày kết thúc phải sau ngày bắt đầu.' };
  }

  const pool = await connect();

  const maCode = payload.maCode?.trim().toUpperCase() || existing.data.code;
  if (payload.maCode) {
    const dup = await pool.request()
      .input('MaCode', sql.NVarChar(50), maCode)
      .input('MaGiamGia', sql.Int, id)
      .query(`
        SELECT MaGiamGia FROM dbo.MaGiamGia
        WHERE MaCode = @MaCode AND MaGiamGia <> @MaGiamGia
      `);
    if (dup.recordset.length > 0) {
      return { success: false, message: 'Mã giảm giá đã được sử dụng bởi coupon khác.' };
    }
  }

  const res = await pool.request()
    .input('MaGiamGia', sql.Int, id)
    .input('MaCode', sql.NVarChar(50), maCode)
    .input('TenMa', sql.NVarChar(150), payload.tenMa !== undefined ? (payload.tenMa?.trim() || null) : existing.data.name)
    .input('KieuGiam', sql.NVarChar(20), payload.kieuGiam || existing.data.type)
    .input('GiaTriGiam', sql.Decimal(18, 2), payload.giaTriGiam != null ? Number(payload.giaTriGiam) : existing.data.value)
    .input('DonToiThieu', sql.Decimal(18, 2), payload.donToiThieu != null ? Number(payload.donToiThieu) : existing.data.minOrder)
    .input('GiamToiDa', sql.Decimal(18, 2), payload.giamToiDa !== undefined ? (payload.giamToiDa != null ? Number(payload.giamToiDa) : null) : existing.data.maxDiscount)
    .input('NgayBatDau', sql.DateTime2, payload.ngayBatDau !== undefined ? payload.ngayBatDau : existing.data.startDate)
    .input('NgayKetThuc', sql.DateTime2, payload.ngayKetThuc !== undefined ? payload.ngayKetThuc : existing.data.endDate)
    .input('GioiHanSuDung', sql.Int, payload.gioiHanSuDung !== undefined ? (payload.gioiHanSuDung != null ? Number(payload.gioiHanSuDung) : null) : existing.data.limit)
    .input('TrangThai', sql.NVarChar(20), payload.trangThai || existing.data.status)
    .query(`
      UPDATE dbo.MaGiamGia
      SET MaCode = @MaCode, TenMa = @TenMa, KieuGiam = @KieuGiam,
          GiaTriGiam = @GiaTriGiam, DonToiThieu = @DonToiThieu, GiamToiDa = @GiamToiDa,
          NgayBatDau = @NgayBatDau, NgayKetThuc = @NgayKetThuc,
          GioiHanSuDung = @GioiHanSuDung, TrangThai = @TrangThai
      WHERE MaGiamGia = @MaGiamGia
    `);

  if (res.rowsAffected[0] === 0) {
    return { success: false, message: 'Không thể cập nhật mã giảm giá.' };
  }

  const detail = await exports.getById(id);
  return { success: true, message: 'Cập nhật mã giảm giá thành công.', data: detail.data };
};

exports.remove = async (id) => {
  const pool = await connect();

  const usedRes = await pool.request()
    .input('MaGiamGia', sql.Int, id)
    .query(`SELECT COUNT(*) AS cnt FROM dbo.DonHang WHERE MaGiamGia = @MaGiamGia`);

  if (usedRes.recordset[0].cnt > 0) {
    await pool.request()
      .input('MaGiamGia', sql.Int, id)
      .query(`UPDATE dbo.MaGiamGia SET TrangThai = N'AN' WHERE MaGiamGia = @MaGiamGia`);
    return { success: true, message: 'Mã đã được dùng trong đơn hàng — đã chuyển sang trạng thái ẩn.' };
  }

  const res = await pool.request()
    .input('MaGiamGia', sql.Int, id)
    .query(`DELETE FROM dbo.MaGiamGia WHERE MaGiamGia = @MaGiamGia`);

  if (res.rowsAffected[0] === 0) {
    return { success: false, message: 'Không tìm thấy mã giảm giá.' };
  }

  return { success: true, message: 'Đã xóa mã giảm giá.' };
};
