const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// Public routes
router.get('/', categoryController.getAllCategories);

// Admin only routes
router.post('/', authMiddleware, roleMiddleware('admin'), categoryController.createCategory);
router.put('/:id', authMiddleware, roleMiddleware('admin'), categoryController.updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), categoryController.deleteCategory);

module.exports = router;