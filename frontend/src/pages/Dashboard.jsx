import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import StudentDashboard from './dashboard/StudentDashboard';
import StaffDashboard from './dashboard/StaffDashboard';
import GuardDashboard from './dashboard/GuardDashboard';

const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { isExpanded } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = React.useState(currentUser);

  // Refresh user data when component mounts or location changes
  React.useEffect(() => {
    const refreshUser = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error('Error parsing stored user:', err);
        }
      } else if (currentUser) {
        setUser(currentUser);
      }
    };
    
    refreshUser();
  }, [location, currentUser]);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Debug: Log current user to see structure
  console.log('Current User in Dashboard:', user);
  console.log('User Role:', user?.role);

  // Extract user's display name
  const displayName = user.firstName || 
                     (user.name && user.name.split(' ')[0]) || 
                     'User';

  // Determine which dashboard to show based on role (case-insensitive)
  const userRole = user.role ? user.role.toLowerCase() : 'student';
  const isStaff = userRole === 'staff';
  const isGuard = userRole === 'guard';
  const isStudent = userRole === 'student';

  // Determine page title based on route
  const getPageTitle = () => {
    if (location.pathname.includes('/profile')) return 'Profile';
    if (location.pathname.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle={getPageTitle()} />

      <div className="dashboard-layout">
        <Sidebar />

        <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
          <div className="dashboard-container">
            <Routes>
              {/* Dashboard Home - default route */}
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
                  {isStaff && <StaffDashboard currentUser={user} />}
                  {isGuard && <GuardDashboard currentUser={user} />}
                  {isStudent && <StudentDashboard currentUser={user} />}
                </>
              } />
              
              {/* Specific role-based routes */}
              <Route path="/student" element={
                <>
                  <section className="welcome-section">
                    <h1 className="welcome-title">
                      Welcome, {displayName}!
                    </h1>
                    <p className="welcome-sub">
                      Here's your parking overview for today
                    </p>
                  </section>
                  <StudentDashboard currentUser={user} />
                </>
              } />
              
              <Route path="/staff" element={
                <>
                  <section className="welcome-section">
                    <h1 className="welcome-title">
                      Welcome, {displayName}!
                    </h1>
                    <p className="welcome-sub">
                      Manage parking reservations and view available slots
                    </p>
                  </section>
                  <StaffDashboard currentUser={user} />
                </>
              } />
              
              <Route path="/guard" element={
                <>
                  <section className="welcome-section">
                    <h1 className="welcome-title">
                      Welcome, {displayName}!
                    </h1>
                    <p className="welcome-sub">
                      Monitor parking slots and manage reservations
                    </p>
                  </section>
                  <GuardDashboard currentUser={user} />
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
