const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ✅ DEBUG ROUTE - Check environment variables
app.get('/api/debug', (req, res) => {
  res.json({
    mongoUriExists: !!process.env.MONGO_URI,
    mongoUriLength: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
    mongoUriStart: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 40) : 'not set',
    jwtExists: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV || 'not set',
    timestamp: new Date().toISOString()
  });
});

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📡 URI exists:', !!process.env.MONGO_URI);
    
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not set in environment variables!');
      return;
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📚 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('💡 Please check:');
    console.error('   1. MONGO_URI is set in Vercel environment variables');
    console.error('   2. IP whitelist in MongoDB Atlas (0.0.0.0/0)');
    console.error('   3. Username and password are correct');
  }
};

// Call connection
connectDB();

// ✅ API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));

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

// ✅ Serve Frontend
const distPath = path.join(__dirname, '..', 'client', 'dist');
console.log('📁 Dist path:', distPath);
console.log('📁 Dist exists:', fs.existsSync(distPath));

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('✅ Serving static files from:', distPath);
  
  app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    console.log('📄 Serving index.html');
    res.sendFile(indexPath);
  });
} else {
  console.log('❌ Dist folder not found!');
  app.get('*', (req, res) => {
    res.json({ message: 'Frontend not built yet. Please run build.' });
  });
}

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ✅ Export for Vercel
module.exports = app;

// ✅ Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}