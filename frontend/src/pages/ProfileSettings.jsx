import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import '../styles/ProfileSettings.css';

const ProfileSettings = () => {
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
    const lastName = currentUser?.lastName || 'G';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getFullName = () => {
    return `${currentUser?.firstName || 'Jhon'} ${currentUser?.lastName || 'Gil Lauro'}`;
  };

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle="Profile Settings" />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
          <div className="dashboard-container">
            {/* Page Header */}
            <div className="settings-page-header">
              <h1 className="settings-page-title">Profile Settings</h1>
              <p className="settings-page-subtitle">Manage your account information and preferences</p>
            </div>

            {/* Personal Information Card */}
            <div className="settings-card">
              <div className="settings-card-header">
                <h2 className="settings-section-title">Personal Information</h2>
                <p className="settings-section-subtitle">Update your personal details</p>
              </div>
              
              <div className="settings-card-body">
                {/* Avatar Section */}
                <div className="avatar-section">
                  <div className="avatar-circle">{getInitials()}</div>
                  <div className="avatar-controls">
                    <button className="change-photo-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Change Photo
                    </button>
                    <p className="avatar-hint">JPG, PNG. Max size 2MB</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="form-grid">
                  <div className="form-field">
                    <label className="field-label">Full Name</label>
                    <input 
                      type="text" 
                      className="field-input" 
                      defaultValue={getFullName()}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Email</label>
                    <input 
                      type="email" 
                      className="field-input" 
                      defaultValue={currentUser?.email || 'jhon.gil@example.com'}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Phone Number</label>
                    <input 
                      type="tel" 
                      className="field-input" 
                      defaultValue={currentUser?.contactNumber || '+1 (555) 123-4567'}
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Member Since</label>
                    <input 
                      type="text" 
                      className="field-input" 
                      defaultValue="January 2024"
                      disabled
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="form-actions">
                  <button className="save-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="two-column-layout">
              {/* My Vehicles */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <h2 className="settings-section-title">My Vehicles</h2>
                  <p className="settings-section-subtitle">Manage your registered vehicles</p>
                </div>
                
                <div className="settings-card-body">
                  <div className="vehicle-list">
                    <div className="vehicle-item">
                      <div className="vehicle-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="11" width="14" height="10" rx="2"/>
                          <circle cx="12" cy="16" r="2"/>
                          <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                        </svg>
                      </div>
                      <div className="vehicle-info">
                        <div className="vehicle-header">
                          <span className="vehicle-plate">ABC-1234</span>
                          <span className="primary-badge">Primary</span>
                        </div>
                        <p className="vehicle-model">Tesla Model 3</p>
                      </div>
                      <div className="vehicle-actions">
                        <button className="icon-btn edit-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="icon-btn delete-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="vehicle-item">
                      <div className="vehicle-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="5" y="11" width="14" height="10" rx="2"/>
                          <circle cx="12" cy="16" r="2"/>
                          <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                        </svg>
                      </div>
                      <div className="vehicle-info">
                        <div className="vehicle-header">
                          <span className="vehicle-plate">XYZ-5678</span>
                        </div>
                        <p className="vehicle-model">Honda Civic</p>
                      </div>
                      <div className="vehicle-actions">
                        <button className="icon-btn edit-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="icon-btn delete-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="add-new-btn">Add New Vehicle</button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <h2 className="settings-section-title">Payment Methods</h2>
                  <p className="settings-section-subtitle">Manage your payment options</p>
                </div>
                
                <div className="settings-card-body">
                  <div className="payment-list">
                    <div className="payment-item">
                      <div className="payment-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                          <line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                      </div>
                      <div className="payment-info">
                        <div className="payment-header">
                          <span className="payment-number">•••• •••• •••• 4242</span>
                          <span className="default-badge">Default</span>
                        </div>
                        <p className="payment-expiry">Expires 12/2026</p>
                      </div>
                      <div className="payment-actions">
                        <button className="icon-btn edit-btn">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="add-new-btn">Add Payment Method</button>
                </div>
              </div>
            </div>

            {/* Notifications & Preferences */}
            <div className="settings-card">
              <div className="settings-card-header">
                <h2 className="settings-section-title">Notifications & Preferences</h2>
                <p className="settings-section-subtitle">Manage how you receive updates</p>
              </div>
              
              <div className="settings-card-body">
                <div className="notification-list">
                  <div className="notification-item">
                    <div className="notification-info">
                      <div className="notification-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <div className="notification-text">
                        <p className="notification-title">Email Notifications</p>
                        <p className="notification-desc">Receive updates via email</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <div className="notification-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <div className="notification-text">
                        <p className="notification-title">SMS Notifications</p>
                        <p className="notification-desc">Receive updates via text</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <div className="notification-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                      </div>
                      <div className="notification-text">
                        <p className="notification-title">Reservation Reminders</p>
                        <p className="notification-desc">Get reminded before bookings</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
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

export default ProfileSettings;
