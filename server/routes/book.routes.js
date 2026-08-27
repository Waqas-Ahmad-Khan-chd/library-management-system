const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/available', bookController.getAvailableBooks);
router.get('/:id', bookController.getBookById);

// Protected routes (Admin & Librarian only)
router.post('/', authMiddleware, roleMiddleware('admin', 'librarian'), bookController.createBook);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'librarian'), bookController.updateBook);
router.delete('/:id', authMiddleware, roleMiddleware('admin', 'librarian'), bookController.deleteBook);
router.patch('/:id/availability', authMiddleware, roleMiddleware('admin', 'librarian'), bookController.updateAvailability);

module.exports = router;