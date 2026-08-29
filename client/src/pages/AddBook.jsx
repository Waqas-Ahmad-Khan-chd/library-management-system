import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook } from '../api/book.api';
import { FaFileUpload } from 'react-icons/fa';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    quantity: 1,
    publisher: '',
    publicationYear: '',
    location: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('isbn', formData.isbn);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('quantity', formData.quantity);
      formDataToSend.append('publisher', formData.publisher || '');
      formDataToSend.append('publicationYear', formData.publicationYear || '');
      formDataToSend.append('location', formData.location || '');
      
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      await createBook(formDataToSend);
      
      setSuccess('✅ Book added successfully!');
      setTimeout(() => {
        navigate('/books');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📚 Add New Book</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">ISBN *</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Publication Year</label>
            <input
              type="number"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Location (Shelf)</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Upload eBook</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 cursor-pointer hover:bg-gray-100 transition">
                <FaFileUpload className="text-blue-500" />
                <span className="text-sm text-gray-600">Choose File</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.epub,.mobi,.doc,.docx"
                  className="hidden"
                />
              </label>
              {fileName && (
                <span className="text-sm text-gray-600 truncate max-w-xs">
                  📄 {fileName}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supported: PDF, EPUB, MOBI, DOC, DOCX (Max 50MB)
            </p>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-medium disabled:opacity-50"
            >
              {loading ? 'Adding...' : '➕ Add Book'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/books')}
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;