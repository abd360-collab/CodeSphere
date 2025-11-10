import React from 'react';

// react-router-dom → Handles navigation between pages (SPA).
// Router → Wraps whole app, enables routing (the main manager of navigation).
// handle page changes (URLs), so no need to reload the whole page.

// Routes → Container for Route definitions.
// Think of Routes as a container/box where you keep all your page rules.
// It checks the current URL and decides which page to show.


// Route → Defines one path → component mapping.
// A Route is a rule.
// "If the user goes to this URL path → show this component".


// Navigate → Used for redirects.
// Navigate is used when you want to redirect the user from one page to another.
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // react-toastify → Notification library for showing success/error popups.
import 'react-toastify/dist/ReactToastify.css'; // Toastify CSS imported once globally.

// AuthProvider → Context provider, makes authentication state accessible everywhere.
// useAuth -> Hook to use auth state inside components.
import { AuthProvider, useAuth } from './context/AuthContext';

// pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectEditor from './pages/ProjectEditor';

// ProtectedRoute → A wrapper that blocks pages if user not logged in. 
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {

  // isAuthenticated → true/false depending on login state.
  // loading → true while checking token/session.
  const { isAuthenticated, loading } = useAuth();

  // While loading → show a spinner (Tailwind classes: full height screen, center flex, spinning circle).
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute>
              <ProjectEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

// Main Wrapper.
// AuthProvider wraps everything → makes auth state available.
// ToastContainer → enables toast notifications globally.
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </AuthProvider>
  );
}

export default App;






// AuthContext.js is responsible for:

// Storing user state (logged in / not).
// Handling tokens (probably from localStorage or API).
// Providing isAuthenticated, loading, and other auth-related values to the whole app.
// Exporting a custom hook (useAuth) for easy access