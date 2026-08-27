import React, { useState, useEffect, useCallback } from 'react';
import { getAllBooks, deleteBook } from '../api/book.api';
import { useAuth } from '../context/AuthContext';
import { MdSearch, MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { FaBookOpen } from 'react-icons/fa';

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';

  // Debounce search: wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch books when debouncedSearch or category changes
  useEffect(() => {
    fetchBooks();
  }, [debouncedSearch, category]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      
      console.log('Fetching books with params:', params);
      const response = await getAllBooks(params);
      console.log('Books response:', response);
      
      if (response.success !== false) {
        setBooks(response.books || []);
        // Extract unique categories
        const uniqueCategories = [...new Set((response.books || []).map(b => b.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        setError(response.message || 'Failed to fetch books');
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await deleteBook(id);
      setBooks(books.filter(book => book._id !== id));
    } catch (error) {
      setError('Failed to delete book');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle Enter key press - immediate search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setDebouncedSearch(search);
    }
  };

  if (loading && !books.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading books...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-modern py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaBookOpen className="text-blue-600" /> Books Collection
          </h1>
          <p className="text-gray-500 text-sm mt-1">{books.length} books found</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => window.location.href = '/books/add'}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-medium"
          >
            <MdAdd className="text-xl" /> Add Book
          </button>
        )}
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN... (type and wait)"
              value={search}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {search && search !== debouncedSearch ? '⌛' : '✓'}
            </div>
          </div>
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400 flex justify-between">
          <span>🔍 Search results update automatically</span>
          <span>{loading ? 'Loading...' : `Found ${books.length} books`}</span>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
            ✕
          </button>
        </div>
      )}
      
      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">{book.title}</h3>
              <span className="badge badge-info text-xs px-3 py-1 rounded-full">{book.category || 'Uncategorized'}</span>
            </div>
            <p className="text-gray-600 mt-2 flex items-center gap-1">
              ✍️ {book.author || 'Unknown Author'}
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              📖 ISBN: {book.isbn || 'N/A'}
            </p>
            {book.publisher && (
              <p className="text-gray-500 text-sm">🏢 {book.publisher}</p>
            )}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <span className={`badge ${book.available > 0 ? 'badge-success' : 'badge-danger'}`}>
                {book.available > 0 ? `✅ ${book.available} available` : '❌ Out of stock'}
              </span>
              <span className="text-xs text-gray-500">Total: {book.quantity}</span>
            </div>
            {isAdmin && (
              <div className="mt-3 flex justify-end gap-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                  <MdEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(book._id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                >
                  <MdDelete /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {books.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-gray-200">
          <p className="text-gray-500 text-lg">No books found</p>
          {isAdmin && (
            <button 
              onClick={() => window.location.href = '/books/add'}
              className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              Add your first book
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookList;