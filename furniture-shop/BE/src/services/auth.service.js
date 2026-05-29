const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const { validateRegister, validateLogin } = require('../validators/auth.validator');

const SALT_ROUNDS = 10;

// ── Đăng ký ──────────────────────────────────────────────
exports.register = async (data) => {
  // Map từ FE field names sang BE field names
  const payload = {
    hoTen:       data.fullName || data.hoTen,
    email:       data.email,
    matKhau:     data.password || data.matKhau,
    soDienThoai: data.phone    || data.soDienThoai,
  };

  // Validate
  const { isValid, errors } = validateRegister(payload);
  if (!isValid) {
    return { success: false, message: Object.values(errors)[0], errors };
  }

  // Kiểm tra email đã tồn tại
  const emailExists = await UserModel.emailExists(payload.email);
  if (emailExists) {
    return { success: false, message: 'Email này đã được đăng ký. Vui lòng dùng email khác.' };
  }

  // Hash mật khẩu
  const matKhauHash = await bcrypt.hash(payload.matKhau, SALT_ROUNDS);

  // Tạo user
  const newUser = await UserModel.create({
    hoTen:       payload.hoTen.trim(),
    email:       payload.email.toLowerCase().trim(),
    matKhauHash,
    soDienThoai: payload.soDienThoai || null,
  });

  // Tạo token
  const token = generateToken({
    id:    newUser.MaNguoiDung,
    email: newUser.Email,
    role:  newUser.VaiTro,
  });

  return {
    success: true,
    message: 'Đăng ký thành công!',
    data: {
      token,
      user: {
        id:          newUser.MaNguoiDung,
        fullName:    newUser.HoTen,
        email:       newUser.Email,
        phone:       newUser.SoDienThoai,
        role:        newUser.VaiTro,
        status:      newUser.TrangThai,
        createdAt:   newUser.NgayTao,
      },
    },
  };
};

// ── Đăng nhập ─────────────────────────────────────────────
exports.login = async (data) => {
  // Map field names
  const payload = {
    email:   data.email,
    matKhau: data.password || data.matKhau,
  };

  // Validate
  const { isValid, errors } = validateLogin(payload);
  if (!isValid) {
    return { success: false, message: Object.values(errors)[0], errors };
  }

  // Tìm user theo email
  const user = await UserModel.findByEmail(payload.email.toLowerCase().trim());
  if (!user) {
    return { success: false, message: 'Email hoặc mật khẩu không đúng.' };
  }

  // Kiểm tra tài khoản bị khóa
  if (user.TrangThai === 'KHOA' || user.TrangThai === 'VO_HIEU') {
    return { success: false, message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.' };
  }

  // So sánh mật khẩu
  const isMatch = await bcrypt.compare(payload.matKhau, user.MatKhauHash);
  if (!isMatch) {
    return { success: false, message: 'Email hoặc mật khẩu không đúng.' };
  }

  // Tạo token
  const token = generateToken({
    id:    user.MaNguoiDung,
    email: user.Email,
    role:  user.VaiTro,
  });

  return {
    success: true,
    message: 'Đăng nhập thành công!',
    data: {
      token,
      user: {
        id:        user.MaNguoiDung,
        fullName:  user.HoTen,
        email:     user.Email,
        phone:     user.SoDienThoai,
        avatar:    user.AnhDaiDien,
        role:      user.VaiTro,
        status:    user.TrangThai,
        createdAt: user.NgayTao,
      },
    },
  };
};

// ── Lấy thông tin user hiện tại ───────────────────────────
exports.getMe = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    return { success: false, message: 'Không tìm thấy người dùng.' };
  }

  return {
    success: true,
    data: {
      id:        user.MaNguoiDung,
      fullName:  user.HoTen,
      email:     user.Email,
      phone:     user.SoDienThoai,
      avatar:    user.AnhDaiDien,
      role:      user.VaiTro,
      status:    user.TrangThai,
      createdAt: user.NgayTao,
    },
  };
};
