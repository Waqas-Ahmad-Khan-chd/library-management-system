import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { 
  MdLibraryBooks, MdPeople, MdAssignment, MdWarning, 
  MdAttachMoney, MdTrendingUp, MdBook, MdSwapHoriz 
} from 'react-icons/md';
import { FaBookOpen, FaUsers } from 'react-icons/fa';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      setError('Failed to load analytics');
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-modern py-8">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const { overview, monthlyBorrows, mostBorrowed, recentTransactions } = analytics;

  const stats = [
    { label: 'Total Books', value: overview.totalBooks, icon: <MdLibraryBooks />, color: 'blue' },
    { label: 'Total Users', value: overview.totalUsers, icon: <FaUsers />, color: 'purple' },
    { label: 'Active Loans', value: overview.activeLoans, icon: <MdAssignment />, color: 'orange' },
    { label: 'Overdue Books', value: overview.overdueBooks, icon: <MdWarning />, color: 'red' },
    { label: 'Total Fines', value: `$${overview.totalFines}`, icon: <MdAttachMoney />, color: 'green' },
    { label: 'Total Transactions', value: overview.totalTransactions, icon: <MdSwapHoriz />, color: 'indigo' },
  ];

  return (
    <div className="container-modern py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 mb-8 text-white border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
            <MdTrendingUp className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-400 text-sm">Library performance insights</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">{stat.label}</p>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Borrowed Books */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MdBook className="text-blue-500" /> Most Borrowed Books
          </h3>
          {mostBorrowed.length > 0 ? (
            <div className="space-y-3">
              {mostBorrowed.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-800">{item.book.title}</p>
                      <p className="text-xs text-gray-500">{item.book.author}</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {item.count} borrows
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No borrow data yet</p>
          )}
        </div>

        {/* Monthly Borrows */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MdTrendingUp className="text-green-500" /> Monthly Borrows
          </h3>
          {monthlyBorrows.length > 0 ? (
            <div className="space-y-3">
              {monthlyBorrows.slice(0, 6).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">
                      {new Date(0, item._id.month - 1).toLocaleString('default', { month: 'long' })} {item._id.year}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {item.count} books
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No monthly data yet</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MdAssignment className="text-purple-500" /> Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">User</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Book</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{t.user?.name || 'Unknown'}</td>
                    <td className="p-3">{t.book?.title || 'Unknown'}</td>
                    <td className="p-3">
                      <span className={`badge ${
                        t.status === 'returned' ? 'badge-success' :
                        t.status === 'overdue' ? 'badge-danger' :
                        'badge-info'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;