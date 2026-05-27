const express = require('express');
const router = express.Router();
const compareController = require('../controllers/compare.controller');

router.post('/', compareController.getCompare);
router.get('/:id', compareController.getCompare);
router.delete('/:id', compareController.deleteCompare);

module.exports = router;
