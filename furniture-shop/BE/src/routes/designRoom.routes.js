const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/designRoom.controller');
const authenticate = require('../middlewares/auth.middleware');

// POST   /api/design-room          — Lưu thiết kế (không bắt buộc đăng nhập)
router.post('/', ctrl.saveDesign);

// GET    /api/design-room/my-designs — Lấy danh sách dự án của user (cần đăng nhập)
router.get('/my-designs', authenticate, ctrl.getMyDesigns);

// GET    /api/design-room/:id       — Load thiết kế theo ID
router.get('/:id', ctrl.loadDesign);

module.exports = router;
