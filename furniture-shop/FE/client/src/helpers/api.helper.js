export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Dynamically resolve backend IP in local networks for multi-device support
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('::')) {
      return `http://${hostname}:5000/api`;
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};
