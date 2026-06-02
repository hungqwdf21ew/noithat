const getBackendBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.includes('::')) {
      return `http://${hostname}:5000`;
    }
  }
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

// Map empty/placeholder paths to beautiful local assets already present in public/images
const BEAUTIFUL_IMAGES = {
  // Categories
  '/uploads/categories/sofa.jpg': '/images/anhghesofa.png',
  '/uploads/categories/ban.jpg': '/images/bantra.png',
  '/uploads/categories/ghe.jpg': '/images/anhghebandenkh.png',
  '/uploads/categories/giuong.jpg': '/images/giuongtancodien.png',
  '/uploads/categories/tu.jpg': '/images/tuda.png',
  '/uploads/categories/den.jpg': '/images/dendung.png',
  
  // Styles
  '/uploads/styles/toi-gian.jpg': '/images/noi_that_cao_cap_boi_canh_01.png',
  '/uploads/styles/hien-dai.jpg': '/images/noi_that_cao_cap_boi_canh_02.png',
  '/uploads/styles/sang-trong.jpg': '/images/noi_that_cao_cap_boi_canh_03.png',
  '/uploads/styles/co-dien.jpg': '/images/noi_that_cao_cap_boi_canh_05.png',
  '/uploads/styles/bac-au.jpg': '/images/anhbobanghe.png',
  
  // Collections
  '/uploads/collections/phong-khach.jpg': '/images/bst1.png',
  '/uploads/collections/phong-ngu.jpg': '/images/bst12.png',
  
  // Banners
  '/uploads/banners/home-banner.jpg': '/images/bst13.png',
  '/uploads/banners/sale.jpg': '/images/bst10.png',

  // Fallbacks for specific product paths if they are missing
  '/images/anhgiuong.png': '/images/giuongngu_ct_maube_1.png',
  '/images/anhbanan.png': '/images/anhbanandai.png',
  '/images/anhbanghekh.png': '/images/anhbanghekh.png',
  '/images/anhlogo.png': '/images/anhlogo.png'
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/default-product.png';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Return beautiful local high-res images from public/images
  if (BEAUTIFUL_IMAGES[imagePath]) {
    return BEAUTIFUL_IMAGES[imagePath];
  }

  if (imagePath.startsWith('/uploads')) {
    return `${getBackendBaseUrl()}${imagePath}`;
  }
  return imagePath;
};
