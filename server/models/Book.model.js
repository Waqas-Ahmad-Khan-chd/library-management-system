const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  available: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  publisher: {
    type: String,
    trim: true
  },
  publicationYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear()
  },
  location: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Update available count when quantity changes
BookSchema.pre('save', function(next) {
  if (this.isModified('quantity')) {
    const difference = this.quantity - this.available;
    if (difference > 0) {
      this.available = this.quantity;
    }
  }
  next();
});

module.exports = mongoose.model('Book', BookSchema);