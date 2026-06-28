import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-maroon font-display text-lg animate-pulse">Verifying authentication...</div>
      </div>
    );
  }

  if (!token || !user) {
    // Redirect to login but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, send to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
