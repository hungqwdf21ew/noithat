const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.get('/products/:productId/reviews', reviewController.getByProduct);

module.exports = router;
