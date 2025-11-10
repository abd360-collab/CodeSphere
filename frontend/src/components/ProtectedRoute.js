// This file is used in App.js to protect pages from unlogged-users.
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // grabs isAuthenticated and loading state from AuthContext.

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;


// What this file does:

// It protects routes that should only be accessible to logged-in users.
// If a user is not logged in, it will kick them back to /login.
// While authentication is still being checked (loading), it shows a spinner loader.