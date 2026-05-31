const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');

const SALT_ROUNDS = 10;

// Helper to translate roles between Frontend and Database
const mapRoleToDb = (role) => {
  if (role === 'CUSTOMER') return 'KHACH_HANG';
  if (role === 'STAFF') return 'NHAN_VIEN';
  return role; // 'ADMIN' or others
};

const mapRoleToFe = (role) => {
  if (role === 'KHACH_HANG') return 'CUSTOMER';
  if (role === 'NHAN_VIEN') return 'STAFF';
  return role; // 'ADMIN' or others
};

// Helper to translate status between Frontend and Database
const mapStatusToDb = (status) => {
  if (status === 'ACTIVE') return 'HOAT_DONG';
  if (status === 'SUSPENDED') return 'KHOA';
  return status; // Keep original if already matching
};

const mapStatusToFe = (status) => {
  if (status === 'HOAT_DONG') return 'ACTIVE';
  if (status === 'KHOA' || status === 'VO_HIEU') return 'SUSPENDED';
  return 'SUSPENDED';
};

exports.getAllUsers = async () => {
  const users = await UserModel.findAll();
  return {
    success: true,
    data: users.map(u => ({
      id: u.MaNguoiDung,
      name: u.HoTen,
      email: u.Email,
      phone: u.SoDienThoai,
      avatar: u.AnhDaiDien,
      role: mapRoleToFe(u.VaiTro),
      status: mapStatusToFe(u.TrangThai),
      createdAt: u.NgayTao
    }))
  };
};

exports.createUser = async (data) => {
  const payload = {
    hoTen: data.name,
    email: data.email,
    matKhau: data.password,
    role: mapRoleToDb(data.role || 'CUSTOMER')
  };

  if (!payload.hoTen || !payload.email || !payload.matKhau) {
    return { success: false, message: 'Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu.' };
  }

  // Check email
  const emailExists = await UserModel.emailExists(payload.email);
  if (emailExists) {
    return { success: false, message: 'Email này đã tồn tại trong hệ thống.' };
  }

  const matKhauHash = await bcrypt.hash(payload.matKhau, SALT_ROUNDS);
  const newUser = await UserModel.createByAdmin({
    hoTen: payload.hoTen,
    email: payload.email,
    matKhauHash,
    role: payload.role
  });

  return {
    success: true,
    message: 'Tạo tài khoản thành công!',
    data: {
      id: newUser.MaNguoiDung,
      name: newUser.HoTen,
      email: newUser.Email,
      role: mapRoleToFe(newUser.VaiTro),
      status: mapStatusToFe(newUser.TrangThai),
      createdAt: newUser.NgayTao
    }
  };
};

exports.updateUser = async (id, data) => {
  const payload = {
    hoTen: data.name,
    email: data.email,
    role: mapRoleToDb(data.role),
    status: mapStatusToDb(data.status)
  };

  if (!payload.hoTen || !payload.email || !payload.role || !payload.status) {
    return { success: false, message: 'Vui lòng cung cấp đầy đủ họ tên, email, quyền và trạng thái.' };
  }

  const updatedUser = await UserModel.updateByAdmin(id, payload);
  if (!updatedUser) {
    return { success: false, message: 'Không tìm thấy tài khoản để cập nhật.' };
  }

  return {
    success: true,
    message: 'Cập nhật tài khoản thành công!',
    data: {
      id: updatedUser.MaNguoiDung,
      name: updatedUser.HoTen,
      email: updatedUser.Email,
      role: mapRoleToFe(updatedUser.VaiTro),
      status: mapStatusToFe(updatedUser.TrangThai),
      createdAt: updatedUser.NgayTao
    }
  };
};

exports.resetPassword = async (id, newPassword) => {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'Mật khẩu mới phải từ 6 ký tự trở lên.' };
  }

  const matKhauHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const ok = await UserModel.updatePassword(id, matKhauHash);
  if (!ok) {
    return { success: false, message: 'Không thể cập nhật mật khẩu, có thể tài khoản không tồn tại.' };
  }

  return {
    success: true,
    message: 'Đặt lại mật khẩu thành công!'
  };
};

exports.deleteUser = async (id) => {
  const ok = await UserModel.delete(id);
  if (!ok) {
    return { success: false, message: 'Không thể xóa tài khoản, có thể tài khoản không tồn tại.' };
  }

  return {
    success: true,
    message: 'Xóa tài khoản thành công!'
  };
};
