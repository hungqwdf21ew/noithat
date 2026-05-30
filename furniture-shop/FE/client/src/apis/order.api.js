import axiosInstance from './axios.config';

export const orderApi = {
  // Tạo đơn hàng (khách vãng lai hoặc đã đăng nhập)
  createOrder: async (orderData) => {
    try {
      const res = await axiosInstance.post('/orders', orderData);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể kết nối máy chủ.' };
    }
  },

  validateCoupon: async ({ maCode, tamTinh }) => {
    try {
      const res = await axiosInstance.post('/orders/validate-coupon', { maCode, tamTinh });
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể kiểm tra mã giảm giá.' };
    }
  },

  // Lấy danh sách đơn hàng của tôi (cần đăng nhập)
  getMyOrders: async () => {
    try {
      const res = await axiosInstance.get('/orders/my');
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể tải đơn hàng.' };
    }
  },

  // Chi tiết đơn hàng
  getOrderDetail: async (id) => {
    try {
      const res = await axiosInstance.get(`/orders/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không tìm thấy đơn hàng.' };
    }
  },

  // Huỷ đơn hàng
  cancelOrder: async (id) => {
    try {
      const res = await axiosInstance.patch(`/orders/${id}/cancel`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể huỷ đơn hàng.' };
    }
  },
};
