const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  getAllTransactions,
  getUserTransactions,
  getActiveTransactions
} = require('../controllers/transaction.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// All transaction routes require authentication
router.use(authMiddleware);

// Issue and return routes (Admin & Librarian only)
router.post('/issue', roleMiddleware('admin', 'librarian'), issueBook);
router.post('/return', roleMiddleware('admin', 'librarian'), returnBook);

// Get all transactions (Admin & Librarian only)
router.get('/', roleMiddleware('admin', 'librarian'), getAllTransactions);
router.get('/active', getActiveTransactions);

// Get user's transactions (ANY authenticated user can see their own)
router.get('/user/:userId', getUserTransactions);

module.exports = router;