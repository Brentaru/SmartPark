import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import StudentDashboard from './dashboard/StudentDashboard';

const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  // Debug: Log current user to see structure
  console.log('Current User in Dashboard:', currentUser);
  console.log('User Role:', currentUser?.role);

  // Extract user's display name
  const displayName = currentUser.firstName || 
                     (currentUser.name && currentUser.name.split(' ')[0]) || 
                     'User';

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle="Dashboard" onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="dashboard-layout">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <div className="dashboard-container">
            <section className="welcome-section">
              <h1 className="welcome-title">
                Welcome, {displayName}!
              </h1>
              <p className="welcome-sub">Here's your parking overview for today</p>
            </section>

            {/* Render role-specific dashboard - for now always show StudentDashboard */}
            <StudentDashboard currentUser={currentUser} />
            {/* Future: Add conditional rendering based on role */}
            {/* {currentUser.role === 'staff' && <StaffDashboard currentUser={currentUser} />} */}
            {/* {currentUser.role === 'guard' && <GuardDashboard currentUser={currentUser} />} */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
