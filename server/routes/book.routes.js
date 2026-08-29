const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// ✅ Try-catch for upload middleware (in case it fails)
let upload;
try {
  upload = require('../middleware/upload.middleware');
  console.log('✅ Upload middleware loaded');
} catch (error) {
  console.error('❌ Upload middleware error:', error.message);
  upload = (req, res, next) => next(); // Fallback
}

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/available', bookController.getAvailableBooks);
router.get('/:id', bookController.getBookById);

// Protected routes with file upload
router.post(
  '/', 
  authMiddleware, 
  roleMiddleware('admin', 'librarian'), 
  upload.single('file'),
  bookController.createBook
);

router.put('/:id', authMiddleware, roleMiddleware('admin', 'librarian'), bookController.updateBook);
router.delete('/:id', authMiddleware, roleMiddleware('admin', 'librarian'), bookController.deleteBook);
router.patch('/:id/availability', authMiddleware, roleMiddleware('admin', 'librarian'), bookController.updateAvailability);

module.exports = router;