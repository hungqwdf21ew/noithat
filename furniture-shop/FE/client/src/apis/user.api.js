import axiosInstance from './axios.config';

export const userApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get('/users');
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể tải danh sách tài khoản.' };
    }
  },

  create: async (data) => {
    try {
      const res = await axiosInstance.post('/users', data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể tạo tài khoản mới.' };
    }
  },

  update: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/users/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể cập nhật thông tin tài khoản.' };
    }
  },

  resetPassword: async (id, newPassword) => {
    try {
      const res = await axiosInstance.put(`/users/${id}/password`, { newPassword });
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể đặt lại mật khẩu tài khoản.' };
    }
  },

  delete: async (id) => {
    try {
      const res = await axiosInstance.delete(`/users/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể xóa tài khoản.' };
    }
  },
};
export default userApi;
