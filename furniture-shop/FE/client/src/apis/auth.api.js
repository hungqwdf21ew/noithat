import axiosInstance from './axios.config';

export const authApi = {
  login: async (data) => {
    try {
      const response = await axiosInstance.post('/auth/login', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  register: async (data) => {
    try {
      const response = await axiosInstance.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
