import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PublicRoute - Redirects authenticated users away from public pages like login/register
 * This prevents logged-in users from accessing login or register pages
 */
const PublicRoute = ({ children }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // While auth state is being loaded, show a loading spinner
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid #dc2626',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If user is authenticated, redirect to their dashboard
  if (isAuthenticated() && currentUser) {
    // Check if there's a previous location they were trying to access
    const from = location.state?.from?.pathname;
    
    // Get the appropriate dashboard based on role
    const dashboardPath = getDashboardPath(currentUser.role);
    
    // Redirect to the previous location or dashboard
    return <Navigate to={from || dashboardPath} replace />;
  }

  // Render children (login/register page) for non-authenticated users
  return <>{children}</>;
};

// Helper function to get the correct dashboard path based on role
const getDashboardPath = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      return '/admin-dashboard';
    case 'guard':
      return '/dashboard';
    case 'staff':
      return '/dashboard';
    case 'student':
      return '/dashboard';
    default:
      return '/dashboard';
  }
};

export default PublicRoute;
