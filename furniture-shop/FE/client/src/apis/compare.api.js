import axiosInstance from './axios.config';

export const compareApi = {
  add: async (productId) => {
    try {
      const response = await axiosInstance.post('/compare', { productId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosInstance.get(`/compare/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/compare/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
