const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// Admin only
router.get('/', authMiddleware, roleMiddleware('admin'), analyticsController.getAnalytics);

module.exports = router;