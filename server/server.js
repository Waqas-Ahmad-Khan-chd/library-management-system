const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));

app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Library API is running!' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: '📚 Library Management System API', version: '1.0.0' });
});

// ✅ EXPORT for Vercel (MUST be here)
module.exports = app;

// ✅ Local development only
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}