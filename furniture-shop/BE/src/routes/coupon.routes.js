const express = require('express');
const router = express.Router();
const couponController = require('../controllers/coupon.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/', authMiddleware, adminMiddleware, couponController.getAll);
router.get('/:id', authMiddleware, adminMiddleware, couponController.getById);
router.post('/', authMiddleware, adminMiddleware, couponController.create);
router.put('/:id', authMiddleware, adminMiddleware, couponController.update);
router.delete('/:id', authMiddleware, adminMiddleware, couponController.remove);

module.exports = router;
