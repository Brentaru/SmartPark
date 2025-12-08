import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import Toast from '../components/Toast';
import { createClient } from '@supabase/supabase-js';
import { userAPI } from '../api/api';
import '../styles/ProfileSettings.css';

// TEMPORARY: Test Supabase connection
import { testSupabaseConnection } from '../utils/testSupabase';

// Initialize Supabase client
const supabaseUrl = 'https://hxinvbaafgclfdjviztk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aW52YmFhZmdjbGZkanZpenRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNzg5MjcsImV4cCI6MjA4MDY1NDkyN30.p0epC9bXTpGXF8fN_CL7H5uxbUirNNkIcJ-JHk-Cohs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ProfileSettings = () => {
  const { currentUser, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(currentUser?.profilePictureUrl || '');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    gender: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        contactNumber: currentUser.contactNumber || '',
        address: currentUser.address || '',
        gender: currentUser.gender || ''
      });
    }
  }, [isAuthenticated, navigate, currentUser]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    try {
      // Update user profile via API
      const updateResult = await userAPI.updateUser(currentUser.userID || currentUser.id, {
        fname: formData.firstName,
        lname: formData.lastName,
        email: formData.email,
        contact: formData.contactNumber
      });
      
      if (updateResult.success) {
        // Update context with new data
        updateUser({
          ...currentUser,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          contactNumber: formData.contactNumber
        });
        
        setEditMode(false);
        setToast({ message: 'Changes saved successfully!', type: 'success' });
      } else {
        throw new Error(updateResult.error || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Save changes error:', error);
      setToast({ message: 'Failed to save changes', type: 'error' });
    }
  };

  const getInitials = () => {
    const firstName = currentUser?.firstName || 'J';
    const lastName = currentUser?.lastName || 'D';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleProfilePictureUpload = async (event) => {
    try {
      setUploading(true);
      
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setToast({ message: 'Please upload an image file (JPG, PNG)', type: 'error' });
        setUploading(false);
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setToast({ message: 'File size must be less than 2MB', type: 'error' });
        setUploading(false);
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.userID || Date.now()}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      console.log('Attempting to upload to:', filePath);

      // First, try to create the bucket if it doesn't exist
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(bucket => bucket.name === 'smartpark-profiles');
        
        if (!bucketExists) {
          console.log('Creating bucket...');
          const { error: bucketError } = await supabase.storage.createBucket('smartpark-profiles', {
            public: true,
            fileSizeLimit: 2097152 // 2MB
          });
          if (bucketError) {
            console.error('Bucket creation error:', bucketError);
            throw new Error('Please create the "smartpark-profiles" bucket in Supabase Dashboard first. See SUPABASE_SETUP.md for instructions.');
          }
        }
      } catch (bucketCheckError) {
        console.error('Bucket check error:', bucketCheckError);
      }

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('smartpark-profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(error.message || 'Upload failed. Make sure the "smartpark-profiles" bucket exists in Supabase.');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('smartpark-profiles')
        .getPublicUrl(filePath);

      console.log('Profile picture uploaded successfully:', urlData.publicUrl);
      
      // Update backend with new profile picture URL
      try {
        const updateResult = await userAPI.updateUser(currentUser.userID || currentUser.id, {
          profilePictureUrl: urlData.publicUrl
        });
        
        if (updateResult.success) {
          // Update local state and context
          setProfilePictureUrl(urlData.publicUrl);
          updateUser({ ...currentUser, profilePictureUrl: urlData.publicUrl });
          setToast({ message: 'Profile picture updated successfully!', type: 'success' });
        } else {
          throw new Error('Failed to save profile picture to database');
        }
      } catch (apiError) {
        console.error('Backend update error:', apiError);
        setToast({ message: 'Picture uploaded but failed to save to database', type: 'warning' });
      }
      
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setToast({ 
        message: 'Failed to upload profile picture. Check console for details.', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle="Settings" onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="dashboard-layout">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <div className="dashboard-container">
            {/* Page Header */}
            <div className="settings-page-header">
              <h1 className="settings-page-title">Settings</h1>
              <p className="settings-page-subtitle">Manage your account settings and preferences</p>
            </div>

            {/* Personal Information Card */}
            <div className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h2 className="settings-section-title">Personal Information</h2>
                  <p className="settings-section-subtitle">Update your personal details</p>
                </div>
                {!editMode && (
                  <button className="edit-mode-btn" onClick={() => setEditMode(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                )}
              </div>
              
              <div className="settings-card-body">
                {/* Avatar Section */}
                <div className="avatar-section">
                  {profilePictureUrl || currentUser?.profilePictureUrl ? (
                    <img 
                      src={profilePictureUrl || currentUser?.profilePictureUrl} 
                      alt="Profile" 
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-circle">{getInitials()}</div>
                  )}
                  <div className="avatar-controls">
                    <label className="change-photo-btn">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        style={{ display: 'none' }}
                        disabled={uploading}
                      />
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      {uploading ? 'Uploading...' : 'Change Photo'}
                    </label>
                    <p className="avatar-hint">JPG, PNG. Max size 2MB</p>
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSaveChanges}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="field-label">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        className="field-input" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        className="field-input" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        className="field-input" 
                        value={formData.email}
                        disabled={true}
                        title="Email cannot be changed"
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label">Phone Number</label>
                      <input 
                        type="tel" 
                        name="contactNumber"
                        className="field-input" 
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label">Gender</label>
                      <select 
                        name="gender"
                        className="field-input" 
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!editMode}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not">Prefer not to say</option>
                      </select>
                    </div>

                    <div className="form-field full-width">
                      <label className="field-label">Address (Optional)</label>
                      <input 
                        type="text" 
                        name="address"
                        className="field-input" 
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  {editMode && (
                    <div className="form-actions">
                      <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="save-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
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
                          <span className="vehicle-plate">{currentUser?.plateNumber || 'ABC-1234'}</span>
                          <span className="primary-badge">Primary</span>
                        </div>
                        <p className="vehicle-model">{currentUser?.vehicleType || 'Not registered'}</p>
                      </div>
                      <div className="vehicle-actions">
                        <button className="icon-btn edit-btn" onClick={() => navigate('/vehicle-registration')}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="add-new-btn" onClick={() => navigate('/vehicle-registration')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add New Vehicle
                  </button>
                </div>
              </div>

              {/* Security Settings */}
              <div className="settings-card">
                <div className="settings-card-header">
                  <h2 className="settings-section-title">Security</h2>
                  <p className="settings-section-subtitle">Manage your security settings</p>
                </div>
                
                <div className="settings-card-body">
                  <div className="security-list">
                    <div className="security-item">
                      <div className="security-item-content">
                        <div className="security-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                        </div>
                        <div>
                          <p className="security-title">Change Password</p>
                          <p className="security-desc">Update your password regularly</p>
                        </div>
                      </div>
                      <button className="icon-btn edit-btn" onClick={() => setShowPasswordModal(true)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
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

                  <div className="notification-item">
                    <div className="notification-info">
                      <div className="notification-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                      </div>
                      <div className="notification-text">
                        <p className="notification-title">System Alerts</p>
                        <p className="notification-desc">Important system notifications</p>
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (passwordData.newPassword !== passwordData.confirmPassword) {
                setToast({ message: 'New passwords do not match!', type: 'error' });
                return;
              }
              if (passwordData.newPassword.length < 6) {
                setToast({ message: 'Password must be at least 6 characters long!', type: 'error' });
                return;
              }
              
              try {
                // Update password in backend
                const result = await userAPI.updateUser(currentUser.userID || currentUser.id, {
                  password: passwordData.newPassword
                });
                
                if (result.success) {
                  setToast({ message: 'Password updated successfully!', type: 'success' });
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                } else {
                  setToast({ message: result.error || 'Failed to update password', type: 'error' });
                }
              } catch (error) {
                console.error('Password update error:', error);
                setToast({ message: 'Failed to update password', type: 'error' });
              }
            }}>
              <div className="modal-body">
                <div className="form-field">
                  <label className="field-label">Current Password</label>
                  <input
                    type="password"
                    className="field-input"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">New Password</label>
                  <input
                    type="password"
                    className="field-input"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="field-input"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProfileSettings;
