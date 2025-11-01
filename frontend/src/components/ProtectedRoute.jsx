import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();

  // While auth state is being loaded, show nothing / a loader
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    // Redirect to login when not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children when authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
