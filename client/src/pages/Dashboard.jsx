import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllBooks } from '../api/book.api';
import axiosInstance from '../api/axiosConfig';
import { 
  MdLibraryBooks, 
  MdDashboard, 
  MdPeople, 
  MdAssignment,
  MdAdd,
  MdBook,
  MdSwapHoriz,
  MdCheckCircle,
  MdWarning
} from 'react-icons/md';
import { FaBookOpen, FaUsers, FaUserCircle } from 'react-icons/fa';
import { HiOutlineLibrary } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalUsers: 0,
    activeLoans: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentLoans, setRecentLoans] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch books
        const booksResponse = await getAllBooks();
        const books = booksResponse.books || [];
        const available = books.filter(b => b.available > 0).length;
        
        // Fetch users
        let totalUsers = 0;
        try {
          const usersResponse = await axiosInstance.get('/users');
          totalUsers = usersResponse.data.count || 0;
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
        
        // Fetch active loans
        let activeLoans = 0;
        let loans = [];
        try {
          const loansResponse = await axiosInstance.get('/transactions/active');
          activeLoans = loansResponse.data.count || 0;
          loans = loansResponse.data.transactions || [];
        } catch (error) {
          console.error('Failed to fetch active loans:', error);
        }
        
        setStats({
          totalBooks: books.length,
          availableBooks: available,
          totalUsers: totalUsers,
          activeLoans: activeLoans
        });
        setRecentLoans(loans.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const goToAddBook = () => navigate('/books/add');
  const goToIssueBook = () => navigate('/transactions/issue');
  const goToReturnBook = () => navigate('/transactions/return');

  const statCards = [
    { 
      label: 'Total Books', 
      value: stats.totalBooks, 
      icon: <MdLibraryBooks className="text-2xl text-blue-600" />,
      bg: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    { 
      label: 'Available Books', 
      value: stats.availableBooks, 
      icon: <MdCheckCircle className="text-2xl text-green-600" />,
      bg: 'bg-green-50',
      textColor: 'text-green-700'
    },
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: <FaUsers className="text-2xl text-purple-600" />,
      bg: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    { 
      label: 'Active Loans', 
      value: stats.activeLoans, 
      icon: <MdAssignment className="text-2xl text-orange-600" />,
      bg: 'bg-orange-50',
      textColor: 'text-orange-700'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-modern py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 mb-8 text-white border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                <HiOutlineLibrary className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.name}</span>!
                </h1>
                <p className="text-gray-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse"></span>
                  You are logged in as <span className="text-white font-medium capitalize">{user?.role}</span>
                </p>
              </div>
            </div>
            {user?.membershipId && (
              <p className="text-gray-400 text-sm ml-20">
                Membership ID: <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{user.membershipId}</span>
              </p>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl text-center border border-white/5">
              <p className="text-2xl font-bold text-white">{stats.totalBooks}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Books</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl text-center border border-white/5">
              <p className="text-2xl font-bold text-white">{stats.activeLoans}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.textColor} mt-1`}>{stat.value}</p>
              </div>
              <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Loans */}
      {recentLoans.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MdAssignment className="text-2xl text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Recent Active Loans</h2>
            </div>
            <span className="text-sm text-gray-500">{recentLoans.length} active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="text-gray-600">Book</th>
                  <th className="text-gray-600">User</th>
                  <th className="text-gray-600">Due Date</th>
                  <th className="text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLoans.map((loan) => {
                  const isOverdue = new Date(loan.dueDate) < new Date();
                  return (
                    <tr key={loan._id}>
                      <td className="font-medium text-gray-800">{loan.book?.title || 'Unknown'}</td>
                      <td className="text-gray-700">{loan.user?.name || 'Unknown'}</td>
                      <td className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-700'}>
                        {new Date(loan.dueDate).toLocaleDateString()}
                        {isOverdue && ' ⚠️'}
                      </td>
                      <td>
                        <span className={`badge ${isOverdue ? 'badge-danger' : 'badge-success'}`}>
                          {isOverdue ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MdDashboard className="text-2xl text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={goToAddBook} 
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-medium"
          >
            <MdAdd className="text-xl group-hover:scale-110 transition-transform" />
            Add Book
          </button>
          <button 
            onClick={goToIssueBook} 
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 font-medium"
          >
            <FaBookOpen className="text-xl group-hover:scale-110 transition-transform" />
            Issue Book
          </button>
          <button 
            onClick={goToReturnBook} 
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 font-medium"
          >
            <MdSwapHoriz className="text-xl group-hover:scale-110 transition-transform" />
            Return Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;