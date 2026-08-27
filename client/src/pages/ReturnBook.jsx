import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const ReturnBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transactionId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    fetchActiveTransactions();
  }, []);

  const fetchActiveTransactions = async () => {
    try {
      const response = await axiosInstance.get('/transactions/active');
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Auto-fill transaction ID when row is clicked
  const handleRowClick = (transactionId) => {
    setFormData({ transactionId });
    setShowTransactions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axiosInstance.post('/transactions/return', {
        transactionId: formData.transactionId
      });
      
      const fineMessage = response.data.fine > 0 
        ? ` Fine: $${response.data.fine}` 
        : '';
      
      setSuccess(`✅ Book returned successfully!${fineMessage}`);
      
      await fetchActiveTransactions();
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to return book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🔄 Return Book</h1>
        
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
        
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowTransactions(!showTransactions)}
            className="text-blue-600 hover:underline text-sm"
          >
            {showTransactions ? 'Hide' : 'Show'} active transactions
          </button>
          
          {showTransactions && (
            <div className="mt-2">
              {transactions.length > 0 ? (
                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left p-2">ID (Full 24-char)</th>
                        <th className="text-left p-2">Book</th>
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr 
                          key={t._id} 
                          className="border-t hover:bg-blue-50 cursor-pointer transition"
                          onClick={() => handleRowClick(t._id)}
                        >
                          <td className="p-2 font-mono text-xs text-blue-600 underline">
                            {t._id}
                          </td>
                          <td className="p-2">{t.book?.title}</td>
                          <td className="p-2">{t.user?.name}</td>
                          <td className={`p-2 ${new Date(t.dueDate) < new Date() ? 'text-red-600 font-bold' : ''}`}>
                            {new Date(t.dueDate).toLocaleDateString()}
                            {new Date(t.dueDate) < new Date() && ' (OVERDUE)'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500 mt-2 p-2">
                    💡 Click on any row to auto-fill the Transaction ID
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-2">No active transactions</p>
              )}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Transaction ID *
            </label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              placeholder="Enter the full 24-character transaction ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              required
            />
            <p className="text-gray-500 text-sm mt-1">
              Enter the full 24-character ID from the table above, or click a row to auto-fill
            </p>
            {formData.transactionId && formData.transactionId.length === 24 && (
              <p className="text-green-600 text-sm mt-1">
                ✅ Valid 24-character ID
              </p>
            )}
            {formData.transactionId && formData.transactionId.length !== 24 && formData.transactionId.length > 0 && (
              <p className="text-red-600 text-sm mt-1">
                ⚠️ Transaction ID must be 24 characters long
              </p>
            )}
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || formData.transactionId.length !== 24}
              className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Processing...' : '🔄 Return Book'}
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

export default ReturnBook;