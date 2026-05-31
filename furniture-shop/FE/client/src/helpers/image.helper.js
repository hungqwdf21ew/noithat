const getBackendBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default-product.png';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/uploads')) {
    return `${getBackendBaseUrl()}${imagePath}`;
  }
  return imagePath;
};
