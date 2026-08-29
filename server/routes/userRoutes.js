const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// ✅ Profile routes (authenticated users)
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.put('/change-password', authMiddleware, userController.changePassword);

// ✅ Get all users - ALL authenticated users can see the count
// Only returns basic info (no passwords)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Get all users but only return basic info
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipId: user.membershipId
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ Search user by membership ID (Admin & Librarian only)
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