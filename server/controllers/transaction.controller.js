const Transaction = require('../models/Transaction.model');
const Book = require('../models/Book.model');
const User = require('../models/User.model');

// Issue a book
exports.issueBook = async (req, res) => {
  try {
    const { bookId, userId, dueDate } = req.body;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Check if book is available
    if (book.available < 1) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for issue'
      });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user already has this book issued
    const existingTransaction = await Transaction.findOne({
      book: bookId,
      user: userId,
      status: 'issued'
    });
    
    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        message: 'User already has this book issued'
      });
    }
    
    // Calculate due date (default 14 days from now)
    const dueDateObj = dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    
    // Create transaction
    const transaction = await Transaction.create({
      book: bookId,
      user: userId,
      dueDate: dueDateObj,
      issueDate: new Date(),
      status: 'issued'
    });
    
    // Update book availability
    book.available -= 1;
    await book.save();
    
    // Populate transaction details
    await transaction.populate('book', 'title author isbn');
    await transaction.populate('user', 'name email membershipId');
    
    res.status(201).json({
      success: true,
      message: 'Book issued successfully',
      transaction
    });
  } catch (error) {
    console.error('Issue book error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to issue book'
    });
  }
};

// Return a book
exports.returnBook = async (req, res) => {
  try {
    const { transactionId } = req.body;
    
    // Find transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Check if already returned
    if (transaction.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book already returned'
      });
    }
    
    // Calculate fine if overdue
    const returnDate = new Date();
    let fine = 0;
    
    if (returnDate > transaction.dueDate) {
      const daysLate = Math.ceil((returnDate - transaction.dueDate) / (1000 * 60 * 60 * 24));
      fine = daysLate * 10; // $10 per day late
    }
    
    // Update transaction
    transaction.returnDate = returnDate;
    transaction.status = 'returned';
    transaction.fine = fine;
    await transaction.save();
    
    // Update book availability
    const book = await Book.findById(transaction.book);
    if (book) {
      book.available += 1;
      await book.save();
    }
    
    // Populate details
    await transaction.populate('book', 'title author isbn');
    await transaction.populate('user', 'name email membershipId');
    
    res.json({
      success: true,
      message: fine > 0 ? `Book returned with fine: $${fine}` : 'Book returned successfully',
      transaction,
      fine
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to return book'
    });
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('book', 'title author isbn')
      .populate('user', 'name email membershipId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get transactions'
    });
  }
};

// Get user's transactions
exports.getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const transactions = await Transaction.find({ user: userId })
      .populate('book', 'title author isbn')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user transactions'
    });
  }
};

// Get active transactions (issued books)
exports.getActiveTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      status: { $in: ['issued', 'overdue'] } 
    })
      .populate('book', 'title author isbn')
      .populate('user', 'name email membershipId')
      .sort({ dueDate: 1 });
    
    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('Get active transactions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get active transactions'
    });
  }
};