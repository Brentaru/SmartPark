import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import '../styles/MyProfile.css';

const MyProfile = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  console.log('=== MyProfile Component ===');
  console.log('currentUser:', currentUser);
  console.log('isAuthenticated:', isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getInitials = () => {
    const firstName = currentUser?.firstName || 'Jhon';
    const lastName = currentUser?.lastName || 'Gil';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = () => {
    const firstName = currentUser?.firstName || 'Jhon';
    const lastName = currentUser?.lastName || 'Gil Lauro';
    return `${firstName} ${lastName}`;
  };

  console.log('MyProfile rendering', { currentUser, sidebarOpen });

  if (!currentUser) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle="My Profile" onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="dashboard-layout">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <div className="dashboard-container">
            
            {/* Page Header */}
            <div className="profile-page-header">
              <h1 className="profile-page-title">My Profile</h1>
              <p className="profile-page-subtitle">View your account information and activity</p>
            </div>

            {/* Main Layout Grid */}
            <div className="profile-layout-grid">
              
              {/* LEFT SIDEBAR - Profile Info Card */}
              <aside className="profile-sidebar-card">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar-circle">
                    {getInitials()}
                  </div>
                  <h2 className="profile-user-name">{getFullName()}</h2>
                  <span className="profile-member-badge">Premium Member</span>
                </div>

                <div className="profile-info-items">
                  <div className="profile-info-row">
                    <svg className="row-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <div className="row-content">
                      <p className="row-label">Email</p>
                      <p className="row-value">{currentUser?.email || 'jhon.gil@example.com'}</p>
                    </div>
                  </div>

                  <div className="profile-info-row">
                    <svg className="row-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <div className="row-content">
                      <p className="row-label">Phone</p>
                      <p className="row-value">{currentUser?.contactNumber || '+1 (555) 123-4567'}</p>
                    </div>
                  </div>

                  <div className="profile-info-row">
                    <svg className="row-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <div className="row-content">
                      <p className="row-label">Member Since</p>
                      <p className="row-value">January 2024</p>
                    </div>
                  </div>
                </div>

                <button className="profile-edit-button" onClick={() => navigate('/profile-settings')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Profile
                </button>
              </aside>

              {/* RIGHT MAIN CONTENT */}
              <div className="profile-main-content">
                
                {/* Stats Row */}
                <div className="profile-stats-row">
                  <div className="profile-stat-box">
                    <div className="stat-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="11" width="14" height="10" rx="2"/>
                        <circle cx="12" cy="16" r="2"/>
                        <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                    </div>
                    <p className="stat-label">Total Visits</p>
                    <p className="stat-number">24</p>
                  </div>

                  <div className="profile-stat-box">
                    <div className="stat-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <p className="stat-label">Active Reservations</p>
                    <p className="stat-number">1</p>
                  </div>

                  <div className="profile-stat-box">
                    <div className="stat-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </div>
                    <p className="stat-label">Total Spent</p>
                    <p className="stat-number">$340.00</p>
                  </div>

                  <div className="profile-stat-box">
                    <div className="stat-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    <p className="stat-label">Member Since</p>
                    <p className="stat-number">Jan 2024</p>
                  </div>
                </div>

                {/* Current Reservation Card */}
                <div className="profile-content-card">
                  <h3 className="content-card-title">Current Reservation</h3>
                  <div className="current-reservation-box">
                    <div className="reservation-top">
                      <div>
                        <div className="reservation-slot-line">
                          <span className="slot-text">Slot #A-12</span>
                          <span className="active-badge">ACTIVE</span>
                        </div>
                        <p className="reservation-area">North Parking Area</p>
                      </div>
                    </div>
                    <div className="reservation-time-details">
                      <div className="time-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>November 13, 2025</span>
                      </div>
                      <div className="time-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>09:00 - 17:00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Card */}
                <div className="profile-content-card">
                  <div className="content-card-header">
                    <h3 className="content-card-title">Recent Activity</h3>
                    <button className="view-all-button" onClick={() => navigate('/history')}>
                      View All
                    </button>
                  </div>
                  
                  <div className="activity-items-list">
                    <div className="activity-list-item">
                      <div className="activity-left">
                        <div className="activity-car-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="11" width="14" height="10" rx="2"/>
                            <circle cx="12" cy="16" r="2"/>
                            <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                          </svg>
                        </div>
                        <div className="activity-details">
                          <div className="activity-main-text">
                            <span>Slot A-12</span>
                            <span className="bullet-dot">•</span>
                            <span>9h 15m</span>
                          </div>
                          <div className="activity-sub-text">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/>
                              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
                            </svg>
                            <span>North Parking Area</span>
                          </div>
                        </div>
                      </div>
                      <span className="activity-date-text">2025-11-02</span>
                    </div>

                    <div className="activity-list-item">
                      <div className="activity-left">
                        <div className="activity-car-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="11" width="14" height="10" rx="2"/>
                            <circle cx="12" cy="16" r="2"/>
                            <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                          </svg>
                        </div>
                        <div className="activity-details">
                          <div className="activity-main-text">
                            <span>Slot B-05</span>
                            <span className="bullet-dot">•</span>
                            <span>7h 15m</span>
                          </div>
                          <div className="activity-sub-text">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/>
                              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
                            </svg>
                            <span>South Parking Area</span>
                          </div>
                        </div>
                      </div>
                      <span className="activity-date-text">2025-11-01</span>
                    </div>

                    <div className="activity-list-item">
                      <div className="activity-left">
                        <div className="activity-car-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="11" width="14" height="10" rx="2"/>
                            <circle cx="12" cy="16" r="2"/>
                            <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                          </svg>
                        </div>
                        <div className="activity-details">
                          <div className="activity-main-text">
                            <span>Slot A-12</span>
                            <span className="bullet-dot">•</span>
                            <span>10h 0m</span>
                          </div>
                          <div className="activity-sub-text">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/>
                              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
                            </svg>
                            <span>North Parking Area</span>
                          </div>
                        </div>
                      </div>
                      <span className="activity-date-text">2025-10-31</span>
                    </div>
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
