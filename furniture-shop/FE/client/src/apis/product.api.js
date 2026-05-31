import axiosInstance from './axios.config';

export const productApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get('/products');
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể tải danh sách sản phẩm.' };
    }
  },

  getById: async (id) => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể tải chi tiết sản phẩm.' };
    }
  },

  create: async (data) => {
    try {
      const res = await axiosInstance.post('/products', data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể thêm sản phẩm mới.' };
    }
  },

  update: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/products/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể cập nhật sản phẩm.' };
    }
  },

  delete: async (id) => {
    try {
      const res = await axiosInstance.delete(`/products/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể xóa sản phẩm.' };
    }
  },

  uploadImage: async (formData) => {
    try {
      const res = await axiosInstance.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Không thể tải ảnh lên.' };
    }
  },
};

export default productApi;
