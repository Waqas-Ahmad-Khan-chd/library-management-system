const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Library API is running!' });
});

// Root Route
app.get('/', (req, res) => {
  res.json({ message: '📚 Library Management System API' });
});

// Handle favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// ✅ ALL ROUTES
try {
  console.log('📦 Loading routes...');
  app.use('/api/auth', require('./routes/auth.routes'));
  console.log('✅ Auth routes loaded');
  app.use('/api/users', require('./routes/userRoutes'));
  console.log('✅ User routes loaded');
  app.use('/api/books', require('./routes/book.routes'));
  console.log('✅ Book routes loaded');
  app.use('/api/transactions', require('./routes/transaction.routes'));
  console.log('✅ Transaction routes loaded');
  app.use('/api/analytics', require('./routes/analytics.routes'));
  console.log('✅ Analytics routes loaded');
  console.log('✅ ALL ROUTES LOADED SUCCESSFULLY!');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Export for Vercel
module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}