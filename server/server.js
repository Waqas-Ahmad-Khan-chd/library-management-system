const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// ✅ Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: '✅ Library API is running!' });
});

// ✅ Root Route
app.get('/', (req, res) => {
  res.json({ message: '📚 Library Management System API' });
});

// ✅ Handle favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// ✅ Export for Vercel
module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}