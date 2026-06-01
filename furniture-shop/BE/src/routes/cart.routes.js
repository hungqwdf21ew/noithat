const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cart.controller');
const auth = require('../middlewares/auth.middleware');

// Tất cả cart routes đều yêu cầu đăng nhập
router.get('/',              auth, cartCtrl.getCart);
router.post('/',             auth, cartCtrl.addToCart);
router.post('/sync',         auth, cartCtrl.syncCart);
router.put('/:productId',    auth, cartCtrl.updateItem);
router.delete('/:productId', auth, cartCtrl.removeItem);
router.delete('/',           auth, cartCtrl.clearCart);

module.exports = router;
