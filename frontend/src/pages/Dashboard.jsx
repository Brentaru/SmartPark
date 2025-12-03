import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import StudentDashboard from './dashboard/StudentDashboard';
import StaffDashboard from './dashboard/StaffDashboard';
import GuardDashboard from './dashboard/GuardDashboard';

const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Determine which dashboard to show based on role
  const isStaff = currentUser.role === 'staff';
  const isGuard = currentUser.role === 'guard';
  const isStudent = currentUser.role === 'student';

  // Determine page title based on route
  const getPageTitle = () => {
    if (location.pathname.includes('/profile')) return 'Profile';
    if (location.pathname.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle={getPageTitle()} onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="dashboard-layout">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <div className="dashboard-container">
            <Routes>
              {/* Dashboard Home */}
              <Route path="/" element={
                <>
                  <section className="welcome-section">
                    <h1 className="welcome-title">
                      Welcome, {displayName}!
                    </h1>
                    <p className="welcome-sub">
                      {isStaff && "Manage parking reservations and view available slots"}
                      {isGuard && "Monitor parking slots and manage reservations"}
                      {isStudent && "Here's your parking overview for today"}
                    </p>
                  </section>
                  {isStaff && <StaffDashboard currentUser={currentUser} />}
                  {isGuard && <GuardDashboard currentUser={currentUser} />}
                  {isStudent && <StudentDashboard currentUser={currentUser} />}
                </>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
