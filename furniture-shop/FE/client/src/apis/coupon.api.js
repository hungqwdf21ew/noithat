import axiosInstance from './axios.config';

const couponApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get('/coupons');
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể tải mã giảm giá.' };
    }
  },

  getById: async (id) => {
    try {
      const res = await axiosInstance.get(`/coupons/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không tìm thấy mã giảm giá.' };
    }
  },

  create: async (data) => {
    try {
      const res = await axiosInstance.post('/coupons', data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể tạo mã giảm giá.' };
    }
  },

  update: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/coupons/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể cập nhật mã giảm giá.' };
    }
  },

  delete: async (id) => {
    try {
      const res = await axiosInstance.delete(`/coupons/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể xóa mã giảm giá.' };
    }
  },
};

export default couponApi;
