const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...');
console.log('📡 Connecting to MongoDB Atlas...');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📚 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:');
    console.error(`📝 Error: ${error.message}`);
    
    if (error.message.includes('Authentication failed')) {
      console.error('🔑 Fix: Check your username and password in .env');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Fix: Check your internet connection');
    } else if (error.message.includes('whitelist')) {
      console.error('🛡️ Fix: Add your IP to MongoDB Atlas whitelist');
    }
    process.exit(1);
  });