import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosConfig';
import { 
  MdPeople, 
  MdAssignment, 
  MdWarning, 
  MdAttachMoney,
  MdVisibility,
  MdClose,
  MdBook,
  MdCheckCircle,
  MdError
} from 'react-icons/md';
import { FaUserCog, FaUsers, FaBookOpen } from 'react-icons/fa';
import { HiOutlineLibrary } from 'react-icons/hi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeLoans: 0,
    overdueBooks: 0,
    totalFines: 0
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all users
      const usersResponse = await axiosInstance.get('/users');
      setUsers(usersResponse.data.users || []);
      
      // Fetch all transactions
      const transactionsResponse = await axiosInstance.get('/transactions');
      setTransactions(transactionsResponse.data.transactions || []);
      
      // Calculate stats
      const allTransactions = transactionsResponse.data.transactions || [];
      const activeLoans = allTransactions.filter(t => t.status === 'issued' || t.status === 'overdue');
      const overdueBooks = allTransactions.filter(t => t.status === 'overdue');
      const totalFines = allTransactions.reduce((sum, t) => sum + (t.fine || 0), 0);
      
      setStats({
        totalUsers: usersResponse.data.count || 0,
        totalBooks: 0,
        activeLoans: activeLoans.length,
        overdueBooks: overdueBooks.length,
        totalFines: totalFines
      });
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const response = await axiosInstance.get(`/transactions/user/${userId}`);
      const user = users.find(u => u._id === userId);
      setSelectedUser(user);
      setUserTransactions(response.data.transactions || []);
      setShowUserModal(true);
    } catch (error) {
      console.error('Failed to fetch user transactions:', error);
    }
  };

  const closeModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setUserTransactions([]);
  };

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: <FaUsers className="text-2xl text-blue-500" />,
      bg: 'bg-blue-50'
    },
    { 
      label: 'Active Loans', 
      value: stats.activeLoans, 
      icon: <MdAssignment className="text-2xl text-orange-500" />,
      bg: 'bg-orange-50'
    },
    { 
      label: 'Overdue Books', 
      value: stats.overdueBooks, 
      icon: <MdWarning className="text-2xl text-red-500" />,
      bg: 'bg-red-50'
    },
    { 
      label: 'Total Fines', 
      value: `$${stats.totalFines}`, 
      icon: <MdAttachMoney className="text-2xl text-green-500" />,
      bg: 'bg-green-50'
    },
    { 
      label: 'Total Books', 
      value: stats.totalBooks, 
      icon: <MdBook className="text-2xl text-purple-500" />,
      bg: 'bg-purple-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-modern py-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl shadow-2xl p-8 mb-8 text-white border border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                <FaUserCog className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400 text-sm">Manage users, books, and transactions</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm ml-20">
              Welcome back, <span className="text-white font-medium">{user?.name}</span>!
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl text-center border border-white/5">
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl text-center border border-white/5">
              <p className="text-2xl font-bold">{stats.activeLoans}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Loans</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MdPeople className="text-2xl text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800">All Users</h2>
          </div>
          <span className="text-sm text-gray-400">{users.length} registered</span>
        </div>
        <div className="overflow-x-auto">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Membership ID</th>
                <th>Role</th>
                <th>Books Borrowed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const userActiveLoans = transactions.filter(
                  t => t.user?._id === u._id && (t.status === 'issued' || t.status === 'overdue')
                );
                return (
                  <tr key={u._id}>
                    <td className="font-medium flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      {u.name}
                    </td>
                    <td className="text-gray-600">{u.email}</td>
                    <td className="font-mono text-sm bg-gray-50 px-2 py-0.5 rounded">{u.membershipId}</td>
                    <td>
                      <span className={`badge ${
                        u.role === 'admin' ? 'badge-purple' :
                        u.role === 'librarian' ? 'badge-info' :
                        'badge-success'
                      } capitalize`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {userActiveLoans.length > 0 ? (
                        <span className="text-orange-600 font-medium">{userActiveLoans.length} books</span>
                      ) : (
                        <span className="text-gray-400 text-sm">No loans</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => viewUserDetails(u._id)}
                        className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 text-sm font-medium"
                      >
                        <MdVisibility className="text-sm" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center py-8 text-gray-500">No users registered yet</p>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex justify-between items-center border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">User Details</h2>
                    <p className="text-gray-400 text-sm">{selectedUser.name} - {selectedUser.membershipId}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl p-2 transition"
              >
                <MdClose className="text-2xl" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="font-medium text-gray-800">{selectedUser.email}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Membership ID</p>
                  <p className="font-medium font-mono text-gray-800">{selectedUser.membershipId}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                  <p className={`font-medium capitalize ${selectedUser.role === 'admin' ? 'text-purple-600' : 'text-gray-800'}`}>
                    {selectedUser.role}
                  </p>
                </div>
              </div>

              {/* Borrowing History */}
              <div className="flex items-center gap-2 mb-4">
                <FaBookOpen className="text-xl text-blue-500" />
                <h3 className="text-lg font-bold text-gray-800">Borrowing History</h3>
                <span className="text-sm text-gray-400 ml-auto">{userTransactions.length} records</span>
              </div>
              {userTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Book</th>
                        <th>Author</th>
                        <th>Issued</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Fine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTransactions.map((t) => {
                        const isOverdue = new Date(t.dueDate) < new Date() && t.status !== 'returned';
                        return (
                          <tr key={t._id}>
                            <td className="font-medium">{t.book?.title || 'Unknown'}</td>
                            <td>{t.book?.author || 'Unknown'}</td>
                            <td className="text-sm">{new Date(t.issueDate).toLocaleDateString()}</td>
                            <td className={`text-sm ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                              {new Date(t.dueDate).toLocaleDateString()}
                              {isOverdue && <MdWarning className="inline ml-1 text-red-500" />}
                            </td>
                            <td>
                              <span className={`badge ${
                                t.status === 'returned' ? 'badge-success' :
                                t.status === 'overdue' ? 'badge-danger' :
                                'badge-info'
                              }`}>
                                {t.status === 'returned' ? 'Returned' :
                                 t.status === 'overdue' ? 'Overdue' :
                                 'Issued'}
                              </span>
                            </td>
                            <td>
                              {t.fine > 0 ? (
                                <span className="text-red-600 font-bold">${t.fine}</span>
                              ) : (
                                <span className="text-gray-400">$0</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                  <p>No borrowing history for this user</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;