const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

router.get('/', collectionController.getAll);
router.get('/:id', collectionController.getById);

// Secure Admin Collection CRUD routes
router.post('/', authMiddleware, adminMiddleware, collectionController.create);
router.put('/:id', authMiddleware, adminMiddleware, collectionController.update);
router.delete('/:id', authMiddleware, adminMiddleware, collectionController.delete);

module.exports = router;
