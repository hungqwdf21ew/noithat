const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// POST /api/ai/bundle-image
router.post('/bundle-image', aiController.generateBundleImage);

module.exports = router;
