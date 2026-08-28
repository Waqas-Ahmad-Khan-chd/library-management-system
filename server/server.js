const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Library API is running!' });
});

// ✅ Serve Frontend
const distPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));

// ✅ All other routes - serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}