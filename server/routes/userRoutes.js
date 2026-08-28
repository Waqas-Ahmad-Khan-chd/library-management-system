const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// Profile routes (authenticated users)
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);

// Get all users (Admin & Librarian only)
router.get('/', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Search user by membership ID
router.get('/search', authMiddleware, roleMiddleware('admin', 'librarian'), async (req, res) => {
  try {
    const { membershipId } = req.query;
    
    if (!membershipId) {
      return res.status(400).json({
        success: false,
        message: 'Membership ID is required'
      });
    }
    
    const user = await User.findOne({ membershipId }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this Membership ID'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;