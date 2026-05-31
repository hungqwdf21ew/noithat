const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Middleware tuỳ chọn: gắn req.user nếu có token, không bắt buộc
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  const token = authHeader.split(' ')[1];
  if (!token) return next();
  try {
    const jwt = require('jsonwebtoken');
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_) {
    // token không hợp lệ → bỏ qua, vẫn cho đặt hàng như khách
  }
  next();
};

// POST /api/orders — tạo đơn (khách vãng lai hoặc đã đăng nhập)
router.post('/', optionalAuth, orderController.create);
// POST /api/orders/validate-coupon — kiểm tra mã giảm giá
router.post('/validate-coupon', optionalAuth, orderController.validateCoupon);

// GET /api/orders/my — đơn hàng của tôi (bắt buộc đăng nhập)
router.get('/my', authMiddleware, orderController.getMyOrders);

// GET /api/orders — Quản lý toàn bộ đơn hàng (Admin chỉ định)
router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders);

// GET /api/orders/:id — chi tiết đơn hàng
router.get('/:id', optionalAuth, orderController.getDetail);

// PATCH /api/orders/:id/status — Cập nhật trạng thái đơn hàng (Admin chỉ định)
router.patch('/:id/status', authMiddleware, adminMiddleware, orderController.updateStatus);

// PATCH /api/orders/:id/cancel — huỷ đơn (bắt buộc đăng nhập)
router.patch('/:id/cancel', authMiddleware, orderController.cancel);

module.exports = router;
