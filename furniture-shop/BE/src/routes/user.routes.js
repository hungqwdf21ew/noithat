const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Tất cả routes quản trị đều cần Đăng nhập & Quyền Admin
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', userController.getAll);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.put('/:id/password', userController.resetPassword);
router.delete('/:id', userController.delete);

module.exports = router;
