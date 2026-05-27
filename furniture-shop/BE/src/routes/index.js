const express = require('express');
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const orderRoutes = require('./order.routes');
const reviewRoutes = require('./review.routes');
const favoriteRoutes = require('./favorite.routes');
const compareRoutes = require('./compare.routes');
const dbRoutes = require('./db.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/', reviewRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/compare', compareRoutes);
router.use('/db', dbRoutes);

module.exports = router;
