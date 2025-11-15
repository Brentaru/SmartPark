import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../api/api';
import '../../styles/dashboard/Profile.css';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('personal');
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    contactNumber: currentUser?.contactNumber || '',
    studentId: currentUser?.studentId || ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        contactNumber: currentUser.contactNumber || '',
        studentId: currentUser.studentId || ''
      });
    }
  }, [currentUser]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setMessage({ type: 'error', text: 'First name and last name are required' });
      return false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }

    if (formData.contactNumber && !/^\d{10,11}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      setMessage({ type: 'error', text: 'Please enter a valid contact number' });
      return false;
    }

    return true;
  };

  // Handle profile update
  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // API call to update user profile
      const result = await userAPI.updateProfile(currentUser.id, {
        fname: formData.firstName,
        lname: formData.lastName,
        email: formData.email,
        contact: formData.contactNumber
      });

      if (result.success) {
        // Update context with new user data
        if (updateUserProfile) {
          updateUserProfile({
            ...currentUser,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            contactNumber: formData.contactNumber
          });
        }

        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating your profile' });
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate password fields
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'All password fields are required' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await userAPI.changePassword(
        currentUser.id,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Password change error:', error);
      setMessage({ type: 'error', text: 'An error occurred while changing your password' });
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setFormData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
      contactNumber: currentUser?.contactNumber || '',
      studentId: currentUser?.studentId || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const first = formData.firstName?.charAt(0) || '';
    const last = formData.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  return (
    <div className="profile-page">
      {/* Page Header */}
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">Manage your account information and preferences</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`profile-alert profile-alert-${message.type}`}>
          <div className="alert-icon">
            {message.type === 'success' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
          </div>
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Content */}
      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          {/* Compact Avatar Section */}
          <div className="profile-avatar-section-compact">
            <div className="profile-avatar-small">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="avatar-info-compact">
              <h2 className="avatar-name-compact">{formData.firstName} {formData.lastName}</h2>
              <p className="avatar-meta">{currentUser?.role || 'Student'} • ID: {formData.studentId}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Personal Info
            </button>
            <button
              className={`profile-tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Security
            </button>
          </div>

          {/* Tab Content */}
          <div className="profile-tab-content">
            {activeTab === 'personal' && (
              <div className="personal-info-section">
                <div className="section-header">
                  <h3 className="section-title">Personal Information</h3>
                  {!isEditing && (
                    <button
                      className="btn-edit"
                      onClick={() => setIsEditing(true)}
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="info-grid">
                  {/* First Name */}
                  <div className="info-field">
                    <label className="info-label">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="info-input"
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p className="info-value">{formData.firstName || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="info-field">
                    <label className="info-label">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="info-input"
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p className="info-value">{formData.lastName || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Student ID (Read-only) */}
                  <div className="info-field">
                    <label className="info-label">Student ID</label>
                    <p className="info-value info-readonly">{formData.studentId}</p>
                  </div>

                  {/* Email */}
                  <div className="info-field">
                    <label className="info-label">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="info-input"
                        placeholder="Enter email"
                      />
                    ) : (
                      <p className="info-value">{formData.email || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div className="info-field">
                    <label className="info-label">Contact Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="info-input"
                        placeholder="Enter contact number"
                      />
                    ) : (
                      <p className="info-value">{formData.contactNumber || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Role (Read-only) */}
                  <div className="info-field">
                    <label className="info-label">Role</label>
                    <p className="info-value info-readonly">{currentUser?.role || 'Student'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="action-buttons">
                    <button
                      className="btn-secondary"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="security-section">
                <div className="section-header">
                  <h3 className="section-title">Change Password</h3>
                </div>

                <form onSubmit={handleChangePassword} className="password-form">
                  {/* Current Password */}
                  <div className="form-field">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div className="form-field">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Enter new password"
                      required
                    />
                    <p className="form-hint">Password must be at least 6 characters long</p>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-field">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-input"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Changing Password...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>
                </form>

                {/* Security Tips */}
                <div className="security-tips">
                  <h4 className="tips-title">Password Security Tips</h4>
                  <ul className="tips-list">
                    <li>Use a combination of letters, numbers, and special characters</li>
                    <li>Avoid using personal information or common words</li>
                    <li>Change your password regularly</li>
                    <li>Never share your password with anyone</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
