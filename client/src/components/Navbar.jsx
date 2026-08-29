import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white shadow-2xl sticky top-0 z-50 border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              📚
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">LibraryMS</span>
              <span className="hidden md:inline text-xs text-gray-400 block -mt-1">Management System</span>
            </div>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-8">
              {/* User Badge */}
              <div className="hidden lg:flex items-center gap-4 bg-white/10 px-6 py-3 rounded-full border border-white/5">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-base font-medium text-white">{user.name}</span>
                <span className="text-xs bg-white/20 px-4 py-1 rounded-full text-white capitalize">{user.role}</span>
              </div>

              {/* Nav Links */}
              <div className="flex items-center gap-3">
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-white/15 transition text-white/90 hover:text-white text-base font-medium"
                >
                  <span className="text-lg">📊</span>
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  to="/books" 
                  className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-white/15 transition text-white/90 hover:text-white text-base font-medium"
                >
                  <span className="text-lg">📚</span>
                  <span>Books</span>
                </Link>
                
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-white/15 transition text-white/90 hover:text-white text-base font-medium"
                >
                  <span className="text-lg">👤</span>
                  <span>Profile</span>
                </Link>
                
                {user && user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-white/15 transition text-white/90 hover:text-white text-base font-medium"
                  >
                    <span className="text-lg">⚙️</span>
                    <span>Admin</span>
                  </Link>
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 bg-red-500/25 hover:bg-red-500/40 px-6 py-3 rounded-xl transition font-medium text-base border border-red-500/30 text-white"
              >
                <span className="text-lg">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="px-6 py-3 rounded-xl hover:bg-white/10 transition text-base font-medium text-white/80 hover:text-white"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition text-base font-medium text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;