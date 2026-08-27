const Book = require('../models/Book.model');
const User = require('../models/User.model');
const Transaction = require('../models/Transaction.model');

// Get dashboard analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Get today's date
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    // Total counts
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    // Active loans
    const activeLoans = await Transaction.countDocuments({ 
      status: { $in: ['issued', 'overdue'] } 
    });

    // Overdue books
    const overdueBooks = await Transaction.countDocuments({ status: 'overdue' });

    // Total fines
    const finesResult = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$fine' } } }
    ]);
    const totalFines = finesResult[0]?.total || 0;

    // Monthly borrows
    const monthlyBorrows = await Transaction.aggregate([
      { $match: { status: 'returned' } },
      { $group: {
          _id: { month: { $month: '$issueDate' }, year: { $year: '$issueDate' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    // Most borrowed books
    const mostBorrowed = await Transaction.aggregate([
      { $match: { status: 'returned' } },
      { $group: { _id: '$book', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
      { $unwind: '$book' }
    ]);

    // Recent transactions
    const recentTransactions = await Transaction.find()
      .populate('book', 'title author')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        overview: {
          totalBooks,
          totalUsers,
          totalTransactions,
          activeLoans,
          overdueBooks,
          totalFines
        },
        monthlyBorrows,
        mostBorrowed,
        recentTransactions
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};