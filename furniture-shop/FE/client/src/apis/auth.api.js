import axiosInstance from './axios.config';

export const authApi = {
  // Đăng nhập
  login: async ({ email, password }) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể kết nối máy chủ.' };
    }
  },

  // Đăng ký
  register: async ({ fullName, email, password, phone }) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        fullName,
        email,
        password,
        phone,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể kết nối máy chủ.' };
    }
  },

  // Lấy thông tin user hiện tại (cần token)
  getMe: async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Phiên đăng nhập hết hạn.' };
    }
  },

  // Cập nhật thông tin cá nhân
  updateProfile: async ({ fullName, phone }) => {
    try {
      const response = await axiosInstance.put('/auth/profile', { fullName, phone });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể cập nhật thông tin.' };
    }
  },
};
