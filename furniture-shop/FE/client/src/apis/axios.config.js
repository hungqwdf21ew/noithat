import axios from 'axios';
import { getToken, removeToken } from '../helpers/storage.helper';
import { getApiBaseUrl } from '../helpers/api.helper';

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/auth/login')
      || error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthRequest) {
      const path = window.location.pathname;
      const isProtectedPage = path.startsWith('/profile')
        || path.startsWith('/orders')
        || path.startsWith('/admin');
      if (isProtectedPage) {
        removeToken();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
