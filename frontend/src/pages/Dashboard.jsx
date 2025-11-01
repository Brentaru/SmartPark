import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="dashboard-logo">
          <span className="logo-smart">Smart</span>
          <span className="logo-park">Park</span>
        </div>
        <div className="dashboard-user">
          <span className="user-name">
            {currentUser.firstName} {currentUser.lastName}
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* Empty canvas for dashboard content - to be implemented by team */}
      <div className="dashboard-container">
        {/* Dashboard content goes here */}
      </div>
    </div>
  );
};

export default Dashboard;
