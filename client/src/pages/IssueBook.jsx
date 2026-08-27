import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBooks } from '../api/book.api';
import axiosInstance from '../api/axiosConfig';

const IssueBook = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    bookId: '',
    userId: '',
    membershipId: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks();
        setBooks(response.books || []);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const searchUserByMembership = async () => {
    if (!formData.membershipId) {
      setError('Please enter a Membership ID');
      return;
    }

    setSearching(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('Searching for membershipId:', formData.membershipId); // Debug
      
      const response = await axiosInstance.get(`/users/search?membershipId=${formData.membershipId}`);
      console.log('Search response:', response.data); // Debug
      
      if (response.data.success && response.data.user) {
        setFormData(prev => ({
          ...prev,
          userId: response.data.user._id
        }));
        setSuccess(`✅ User found: ${response.data.user.name} (${response.data.user.email})`);
        setError('');
      } else {
        setError('No user found with this Membership ID');
        setFormData(prev => ({ ...prev, userId: '' }));
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error.response?.data?.message || 'User not found');
      setFormData(prev => ({ ...prev, userId: '' }));
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.userId) {
      setError('Please search and select a valid user first');
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/transactions/issue', {
        bookId: formData.bookId,
        userId: formData.userId,
        dueDate: formData.dueDate || undefined
      });
      
      setSuccess(`✅ Book issued successfully! Transaction ID: ${response.data.transaction._id}`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Issue error:', error);
      setError(error.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  const availableBooks = books.filter(book => book.available > 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📖 Issue Book</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Book *</label>
            <select
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a book...</option>
              {availableBooks.map((book) => (
                <option key={book._id} value={book._id}>
                  {book.title} - {book.author} ({book.available} available)
                </option>
              ))}
            </select>
            {availableBooks.length === 0 && (
              <p className="text-red-500 text-sm mt-1">No books available for issue</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              User Membership ID *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="membershipId"
                value={formData.membershipId}
                onChange={handleChange}
                placeholder="Enter membership ID (e.g., LIB12345678)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={searchUserByMembership}
                disabled={searching}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 whitespace-nowrap"
              >
                {searching ? 'Searching...' : '🔍 Search'}
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Enter the membership ID from the user's registration and click Search
            </p>
            {formData.userId && (
              <p className="text-green-600 text-sm mt-1">
                ✅ User validated! Ready to issue book.
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-500 text-sm mt-1">
              Leave empty for default (14 days from today)
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || availableBooks.length === 0 || !formData.userId}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Issuing...' : '📖 Issue Book'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueBook;