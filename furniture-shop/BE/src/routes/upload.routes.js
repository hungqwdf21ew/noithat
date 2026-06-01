const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../configs/cloudinary.config');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Chỉ chấp nhận các tệp hình ảnh (jpg, jpeg, png, webp, gif)!'));
  }
});

// Single image upload route
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn hình ảnh để tải lên.' });
    }

    // Tải hình ảnh lên Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'furniture-shop',
      use_filename: true,
      unique_filename: true
    });

    // Xóa file tạm thời trên ổ đĩa server cục bộ
    try {
      fs.unlinkSync(req.file.path);
    } catch (unlinkErr) {
      console.error('Không thể xóa file tạm:', unlinkErr.message);
    }

    return res.json({
      success: true,
      message: 'Tải ảnh lên đám mây thành công!',
      url: result.secure_url // Trả về link HTTPS đám mây tuyệt đối
    });
  } catch (error) {
    console.error('[Upload error]', error);
    // Nếu có lỗi, cũng cố gắng dọn dẹp file tạm
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    return res.status(500).json({ success: false, message: 'Không thể tải ảnh lên đám mây.' });
  }
});

module.exports = router;
