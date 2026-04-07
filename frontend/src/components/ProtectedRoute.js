// // This file is used in App.js to protect pages from unlogged-users.
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext'; // grabs isAuthenticated and loading state from AuthContext.

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
//       </div>
//     );
//   }

//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;


// // What this file does:

// // It protects routes that should only be accessible to logged-in users.
// // If a user is not logged in, it will kick them back to /login.
// // While authentication is still being checked (loading), it shows a spinner loader.

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation(); // Capture current URL

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 mt-4 font-medium italic">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, send to login but save the current 'from' path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;