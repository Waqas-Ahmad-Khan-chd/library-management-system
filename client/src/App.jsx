import React from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';  // ← Remove BrowserRouter import
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Analytics from './pages/Analytics'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>  {/* ← Only Routes, NO Router */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/books" 
            element={
              <ProtectedRoute>
                <BookList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/books/add" 
            element={
              <ProtectedRoute>
                <AddBook />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions/issue" 
            element={
              <ProtectedRoute>
                <IssueBook />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transactions/return" 
            element={
              <ProtectedRoute>
                <ReturnBook />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          // Add routes
           <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
           <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
           <Route path="/" element={<Navigate to="/dashboard" />} />
           </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;