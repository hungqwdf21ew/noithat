const express = require('express');
const router = express.Router();
const dbController = require('../controllers/db.controller');

router.get('/test', dbController.test);

module.exports = router;
