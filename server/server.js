const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Library API is running!' });
});

// ✅ SERVE FRONTEND STATIC FILES
app.use(express.static(path.join(__dirname, '../client/dist')));

// ✅ ALL OTHER ROUTES GO TO index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// Export for Vercel
module.exports = app;

// Local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}