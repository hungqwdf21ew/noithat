const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/review.controller');
const auth    = require('../middlewares/auth.middleware');
const admin   = require('../middlewares/admin.middleware');

// Public: lấy đánh giá đã duyệt của sản phẩm
router.get('/product/:productId', ctrl.getByProduct);

// User đã đăng nhập: kiểm tra quyền đánh giá
router.get('/check/:productId', auth, ctrl.checkEligibility);

// User đã đăng nhập: tạo đánh giá mới
router.post('/', auth, ctrl.create);

// User đã đăng nhập: sửa đánh giá của mình
router.put('/:reviewId', auth, ctrl.update);

// Admin: lấy danh sách chờ duyệt
router.get('/admin/pending', auth, admin, ctrl.getPending);

// Admin: duyệt / từ chối
router.patch('/admin/:reviewId/status', auth, admin, ctrl.updateStatus);

module.exports = router;
