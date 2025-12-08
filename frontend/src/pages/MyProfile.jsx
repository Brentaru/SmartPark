import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import '../styles/MyProfile.css';

const MyProfile = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { isExpanded } = useSidebar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const getInitials = () => {
    const firstName = currentUser?.firstName || 'J';
    const lastName = currentUser?.lastName || 'D';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = () => {
    const firstName = currentUser?.firstName || 'John';
    const lastName = currentUser?.lastName || 'Doe';
    return `${firstName} ${lastName}`;
  };

  const getRoleDisplay = () => {
    const role = currentUser?.role || 'student';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getPermissions = () => {
    const role = currentUser?.role || 'student';
    switch(role) {
      case 'student':
      case 'staff':
        return [
          'Can Register Vehicle',
          'Can Reserve Parking Slot',
          'Can View Parking History',
          'Can Update Personal Information'
        ];
      case 'guard':
        return [
          'Can Record Entry/Exit',
          'Can Update Slot Status',
          'Can View All Reservations',
          'Can Monitor Parking Areas'
        ];
      case 'admin':
        return [
          'Full System Control',
          'Can Manage Users',
          'Can Manage Parking Areas',
          'Can View All Logs',
          'Can Generate Reports'
        ];
      default:
        return ['Limited Access'];
    }
  };

  const getActivityStats = () => {
    const role = currentUser?.role || 'student';
    if (role === 'student' || role === 'staff') {
      return {
        sessions: 24,
        activeReservations: 1,
        lastParked: 'Slot A-12',
        violations: 0
      };
    } else if (role === 'guard') {
      return {
        processedToday: 45,
        shift: 'Morning Shift (6AM - 2PM)',
        lastEntry: '2 minutes ago',
        area: 'North Parking Area'
      };
    } else {
      return {
        totalUsers: 1234,
        parkingAreas: 5,
        activeSlots: 150,
        systemAlerts: 2
      };
    }
  };

  if (!currentUser) {
    return <div>Loading profile...</div>;
  }

  const stats = getActivityStats();
  const role = currentUser?.role || 'student';

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle="My Profile" />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
          <div className="dashboard-container">
            
            {/* Page Header */}
            <div className="profile-page-header">
              <h1 className="profile-page-title">My Profile</h1>
              <p className="profile-page-subtitle">View your complete account information</p>
            </div>

            {/* Main Layout Grid */}
            <div className="profile-layout-grid">
              
              {/* LEFT SIDEBAR - Profile Card */}
              <aside className="profile-sidebar-card">
                <div className="profile-avatar-wrapper">
                  {currentUser?.profilePictureUrl ? (
                    <img 
                      src={currentUser.profilePictureUrl} 
                      alt="Profile" 
                      className="profile-avatar-image"
                    />
                  ) : (
                    <div className="profile-avatar-circle">
                      {getInitials()}
                    </div>
                  )}
                  <h2 className="profile-user-name">{getFullName()}</h2>
                  <span className="profile-role-badge">{getRoleDisplay()}</span>
                </div>

                <div className="profile-quick-info">
                  <div className="quick-info-item">
                    <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span className="info-value">{currentUser?.email || 'N/A'}</span>
                  </div>
                  
                  <div className="quick-info-item">
                    <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span className="info-value">{currentUser?.contactNumber || 'N/A'}</span>
                  </div>

                  <div className="quick-info-item">
                    <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span className="info-value">{currentUser?.id || currentUser?.studentId || 'N/A'}</span>
                  </div>
                </div>

                <button className="profile-edit-button" onClick={() => navigate('/profile-settings')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Settings
                </button>
              </aside>

              {/* RIGHT MAIN CONTENT */}
              <div className="profile-main-content">
                
                {/* 1. Personal Information Section */}
                <div className="profile-section-card">
                  <div className="section-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: '-20px' }}>
                    <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <h3 className="section-title">Personal Information</h3>
                  </div>
                  <div className="section-content">
                    <div className="info-grid">
                      <div className="info-field">
                        <label className="field-label">Full Name</label>
                        <p className="field-value">{getFullName()}</p>
                      </div>
                      <div className="info-field">
                        <label className="field-label">Email Address</label>
                        <p className="field-value">{currentUser?.email || 'N/A'}</p>
                      </div>
                      <div className="info-field">
                        <label className="field-label">Contact Number</label>
                        <p className="field-value">{currentUser?.contactNumber || 'Not provided'}</p>
                      </div>
                      <div className="info-field">
                        <label className="field-label">Gender</label>
                        <p className="field-value">{currentUser?.gender || 'Not specified'}</p>
                      </div>
                      <div className="info-field full-width">
                        <label className="field-label">Address</label>
                        <p className="field-value">{currentUser?.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Account Information Section */}
                <div className="profile-section-card">
                  <div className="section-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: '-20px' }}>
                    <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <h3 className="section-title">Account Information</h3>
                  </div>
                  <div className="section-content">
                    <div className="info-grid">
                      <div className="info-field">
                        <label className="field-label">User ID</label>
                        <p className="field-value">{currentUser?.id || currentUser?.studentId || 'N/A'}</p>
                      </div>
                      <div className="info-field">
                        <label className="field-label">Username</label>
                        <p className="field-value">{currentUser?.email?.split('@')[0] || 'N/A'}</p>
                      </div>
                      <div className="info-field">
                        <label className="field-label">Account Status</label>
                        <p className="field-value">
                          <span className="status-badge active">Active</span>
                        </p>
                      </div>
                      <div className="info-field">
                        <label className="field-label">Date Created</label>
                        <p className="field-value">January 15, 2024</p>
                      </div>
                      <div className="info-field">
                        <label className="field-label">Last Login</label>
                        <p className="field-value">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Role & Permissions Section */}
                <div className="profile-section-card">
                  <div className="section-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: '-20px' }}>
                    <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <h3 className="section-title">Role & Permissions</h3>
                  </div>
                  <div className="section-content">
                    <div className="role-display">
                      <div className="role-badge-large">{getRoleDisplay()}</div>
                      <p className="role-description">
                        {role === 'student' && 'Student account with parking reservation privileges'}
                        {role === 'staff' && 'Staff account with parking reservation privileges'}
                        {role === 'guard' && 'Security guard with monitoring and management access'}
                        {role === 'admin' && 'Administrator with full system control'}
                      </p>
                    </div>
                    <div className="permissions-list">
                      <h4 className="permissions-title">Your Permissions</h4>
                      <ul className="permission-items">
                        {getPermissions().map((permission, index) => (
                          <li key={index} className="permission-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            <span>{permission}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 4. Security Settings Section */}
                <div className="profile-section-card">
                  <div className="section-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: '-20px' }}>
                    <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <h3 className="section-title">Security Settings</h3>
                  </div>
                  <div className="section-content">
                    <div className="security-items">
                      <div className="security-item">
                        <div className="security-item-left">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                          <div>
                            <p className="security-item-title">Password</p>
                            <p className="security-item-desc">Last changed 30 days ago</p>
                          </div>
                        </div>
                        <button className="security-action-btn" onClick={() => navigate('/profile-settings')}>
                          Change
                        </button>
                      </div>
                      <div className="security-item">
                        <div className="security-item-left">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="8.5" cy="7" r="4"/>
                            <polyline points="17 11 19 13 23 9"/>
                          </svg>
                          <div>
                            <p className="security-item-title">Login Activity</p>
                            <p className="security-item-desc">View recent sessions</p>
                          </div>
                        </div>
                        <button className="security-action-btn">View</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Activity Summary Section - Role Based */}
                <div className="profile-section-card">
                  <div className="section-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: '-20px' }}>
                    <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    <h3 className="section-title">Activity Summary</h3>
                  </div>
                  <div className="section-content">
                    {(role === 'student' || role === 'staff') && (
                      <div className="activity-stats-grid">
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper blue">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="5" y="11" width="14" height="10" rx="2"/>
                              <circle cx="12" cy="16" r="2"/>
                              <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Parking Sessions</p>
                            <p className="stat-number">{stats.sessions}</p>
                          </div>
                        </div>
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper green">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Active Reservations</p>
                            <p className="stat-number">{stats.activeReservations}</p>
                          </div>
                        </div>
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper purple">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Last Parked</p>
                            <p className="stat-number">{stats.lastParked}</p>
                          </div>
                        </div>
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper orange">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                              <line x1="12" y1="9" x2="12" y2="13"/>
                              <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Violations</p>
                            <p className="stat-number">{stats.violations}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {role === 'guard' && (
                      <div className="activity-stats-grid">
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper blue">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="5" y="11" width="14" height="10" rx="2"/>
                              <circle cx="12" cy="16" r="2"/>
                              <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Processed Today</p>
                            <p className="stat-number">{stats.processedToday}</p>
                          </div>
                        </div>
                        <div className="activity-stat-card full-width">
                          <div className="stat-icon-wrapper green">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Current Shift</p>
                            <p className="stat-number">{stats.shift}</p>
                          </div>
                        </div>
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper purple">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Assigned Area</p>
                            <p className="stat-number">{stats.area}</p>
                          </div>
                        </div>
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper orange">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Last Entry</p>
                            <p className="stat-number">{stats.lastEntry}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {role === 'admin' && (
                      <div className="activity-stats-grid">
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper blue">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                              <circle cx="9" cy="7" r="4"/>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Total Users</p>
                            <p className="stat-number">{stats.totalUsers}</p>
                          </div>
                        </div>
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper green">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Parking Areas</p>
                            <p className="stat-number">{stats.parkingAreas}</p>
                          </div>
                        </div>
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper purple">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">Active Slots</p>
                            <p className="stat-number">{stats.activeSlots}</p>
                          </div>
                        </div>
                        <div className="activity-stat-card">
                          <div className="stat-icon-wrapper orange">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                          </div>
                          <div>
                            <p className="stat-label">System Alerts</p>
                            <p className="stat-number">{stats.systemAlerts}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default MyProfile;
