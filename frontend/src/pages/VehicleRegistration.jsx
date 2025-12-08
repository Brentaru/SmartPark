import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, vehicleAPI } from '../api/api';
import '../styles/Auth.css';

const VehicleRegistration = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    plateNumber: '',
    vehicleType: 'Car',
    vehicleColor: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.plateNumber.trim()) {
      setError('Plate number is required');
      return;
    }
    
    if (!formData.vehicleColor.trim()) {
      setError('Vehicle color is required');
      return;
    }

    setLoading(true);

    try {
      console.log('🚗 Registering vehicle for user:', currentUser);
      
      // Step 1: Update user with vehicle information in users table
      const updateData = {
        studentId: currentUser.id, // Use id (which maps to userID) instead of studentId
        fname: currentUser.firstName,
        lname: currentUser.lastName,
        email: currentUser.email,
        password: 'UNCHANGED', // Backend will not change password
        role: currentUser.role,
        contact: currentUser.contactNumber,
        plateNumber: formData.plateNumber.toUpperCase().trim(),
        vehicleType: formData.vehicleType,
        vehicleColor: formData.vehicleColor.trim()
      };

      console.log('📝 Step 1: Updating user with vehicle info:', updateData);
      const userResult = await userAPI.updateUser(currentUser.id, updateData);
      
      if (!userResult.success) {
        setError(userResult.message || 'Failed to update user profile');
        return;
      }

      console.log('✅ User updated successfully:', userResult.data);
      
      // Step 2: Create vehicle entry in vehicle table
      const vehicleData = {
        plateNumber: formData.plateNumber.toUpperCase().trim(),
        type: formData.vehicleType,
        color: formData.vehicleColor.trim(),
        userID: currentUser.id  // Fixed: Use userID directly, not nested user object
      };

      console.log('📝 Step 2: Creating vehicle entry:', vehicleData);
      const vehicleResult = await vehicleAPI.createVehicle(vehicleData);
      
      if (!vehicleResult.success) {
        console.warn('⚠️ Vehicle entry creation failed, but user was updated:', vehicleResult.message);
        // Continue anyway since user table was updated successfully
      } else {
        console.log('✅ Vehicle entry created successfully:', vehicleResult.data);
      }
      
      // Step 3: Update user in context
      const updatedUser = updateUser(userResult.data);
      console.log('📝 User context updated with vehicle info:', updatedUser);
      
      // Step 4: Navigate to appropriate dashboard based on role
      console.log('✅ Vehicle registration complete! Navigating to dashboard...');
      console.log('🎯 User role for navigation:', currentUser.role);
      
      // Small delay to ensure context state is fully updated before navigation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (currentUser.role === 'student') {
        navigate('/dashboard/student', { replace: true, state: { refresh: true } });
      } else if (currentUser.role === 'staff') {
        navigate('/dashboard/staff', { replace: true, state: { refresh: true } });
      } else if (currentUser.role === 'guard') {
        navigate('/dashboard/guard', { replace: true, state: { refresh: true } });
      } else {
        navigate('/dashboard', { replace: true, state: { refresh: true } });
      }
    } catch (err) {
      console.error('❌ Error registering vehicle:', err);
      setError('An error occurred while registering your vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-smart">Smart</span>
            <span className="logo-park">Park</span>
          </div>
          <h2 className="auth-title">Vehicle Registration</h2>
          <p className="auth-subtitle">Complete your profile by registering your vehicle</p>
        </div>

        {error && (
          <div className="alert-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="plateNumber" className="form-label">
              Plate Number <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="plateNumber"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
              placeholder="Enter plate number (e.g., ABC-1234)"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleType" className="form-label">
              Vehicle Type <span className="required-asterisk">*</span>
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="vehicleColor" className="form-label">
              Vehicle Color <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="vehicleColor"
              name="vehicleColor"
              value={formData.vehicleColor}
              onChange={handleChange}
              placeholder="Enter vehicle color (e.g., Black, White, Red)"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <div className="auth-footer-note">
          <p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            This information is required for parking management and security purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleRegistration;
