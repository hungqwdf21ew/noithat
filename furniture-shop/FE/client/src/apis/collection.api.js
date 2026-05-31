import axiosInstance from './axios.config';

const collectionApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get('/collections');
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Lỗi khi lấy danh sách bộ sưu tập' };
    }
  },

  getById: async (id) => {
    try {
      const res = await axiosInstance.get(`/collections/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Lỗi khi lấy bộ sưu tập' };
    }
  },

  create: async (data) => {
    try {
      const res = await axiosInstance.post('/collections', data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Lỗi khi tạo bộ sưu tập' };
    }
  },

  update: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/collections/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Lỗi khi cập nhật bộ sưu tập' };
    }
  },

  delete: async (id) => {
    try {
      const res = await axiosInstance.delete(`/collections/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Lỗi khi xóa bộ sưu tập' };
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
      throw error.response?.data || { success: false, message: 'Lỗi khi tải ảnh lên' };
    }
  }
};

export default collectionApi;
