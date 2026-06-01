const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Cấu hình Cloudinary bằng các biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpxb2vldh', // Giá trị mặc định hoặc từ env
  api_key: process.env.CLOUDINARY_API_KEY || '825946845331586',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Z7_mO6sM2Xk2h7Xq3r6_2G_pXzo'
});

module.exports = cloudinary;
