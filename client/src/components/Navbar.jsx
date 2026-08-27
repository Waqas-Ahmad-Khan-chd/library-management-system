import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaBook, 
  FaUser, 
  FaSignOutAlt,
  FaUserCog,
  FaBookOpen,
  FaBookReader
} from 'react-icons/fa';
import { MdDashboard, MdLibraryBooks } from 'react-icons/md';
import { HiOutlineLibrary } from 'react-icons/hi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white shadow-2xl sticky top-0 z-50 border-b border-white/10">
      <div className="container-modern">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <HiOutlineLibrary className="text-2xl text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">LibraryMS</span>
              <span className="hidden sm:inline text-xs text-gray-400 block -mt-1">Management System</span>
            </div>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-1">
              {/* User Badge */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-white">{user.name}</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white capitalize">{user.role}</span>
              </div>

              {/* Nav Links */}
              <Link to="/dashboard" className="nav-link text-white/80 hover:text-white">
                <MdDashboard className="text-lg" />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
              
              <Link to="/books" className="nav-link text-white/80 hover:text-white">
                <FaBookOpen className="text-lg" />
                <span className="hidden lg:inline">Books</span>
              </Link>
              
              <Link to="/profile" className="nav-link text-white/80 hover:text-white">
                <FaUser className="text-lg" />
                <span className="hidden lg:inline">Profile</span>
              </Link>
              
              {user && user.role === 'admin' && (
                <Link to="/admin" className="nav-link text-white/80 hover:text-white">
                  <FaUserCog className="text-lg" />
                  <span className="hidden lg:inline">Admin</span>
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-xl transition font-medium text-sm border border-red-500/20 text-white"
              >
                <FaSignOutAlt className="text-sm" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 rounded-xl hover:bg-white/10 transition text-sm font-medium text-white/80 hover:text-white">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition text-sm font-medium text-white">
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