// Validate đăng ký
const validateRegister = (data) => {
  const errors = {};

  if (!data.hoTen || data.hoTen.trim().length < 2) {
    errors.hoTen = 'Họ tên phải có ít nhất 2 ký tự';
  }

  if (!data.email) {
    errors.email = 'Email là bắt buộc';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!data.matKhau) {
    errors.matKhau = 'Mật khẩu là bắt buộc';
  } else if (data.matKhau.length < 6) {
    errors.matKhau = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (data.soDienThoai && !/^(0|\+84)[0-9]{9}$/.test(data.soDienThoai)) {
    errors.soDienThoai = 'Số điện thoại không hợp lệ';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate đăng nhập
const validateLogin = (data) => {
  const errors = {};

  if (!data.email) {
    errors.email = 'Email là bắt buộc';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!data.matKhau) {
    errors.matKhau = 'Mật khẩu là bắt buộc';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = { validateRegister, validateLogin };
