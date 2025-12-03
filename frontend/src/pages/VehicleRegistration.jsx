import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, vehicleAPI } from '../api/api';
import '../styles/VehicleRegistration.css';

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
        user: {
          userID: currentUser.id
        }
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
      updateUser(userResult.data);
      
      // Step 4: Navigate to appropriate dashboard based on role
      console.log('✅ Vehicle registration complete! Navigating to dashboard...');
      if (currentUser.role === 'student') {
        navigate('/dashboard/student');
      } else if (currentUser.role === 'staff') {
        navigate('/dashboard/staff');
      } else if (currentUser.role === 'guard') {
        navigate('/dashboard/guard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('❌ Error registering vehicle:', err);
      setError('An error occurred while registering your vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-registration-container">
      <div className="vehicle-registration-card">
        <div className="vehicle-registration-header">
          <h2>🚗 Vehicle Registration</h2>
          <p>Complete your profile by registering your vehicle information</p>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="vehicle-registration-form">
          <div className="form-group">
            <label htmlFor="plateNumber">
              Plate Number <span className="required">*</span>
            </label>
            <input
              type="text"
              id="plateNumber"
              name="plateNumber"
              value={formData.plateNumber}
              onChange={handleChange}
              placeholder="e.g., ABC-1234"
              className="form-input"
              required
            />
            <small className="form-hint">Enter your vehicle's plate number</small>
          </div>

          <div className="form-group">
            <label htmlFor="vehicleType">
              Vehicle Type <span className="required">*</span>
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
            <label htmlFor="vehicleColor">
              Vehicle Color <span className="required">*</span>
            </label>
            <input
              type="text"
              id="vehicleColor"
              name="vehicleColor"
              value={formData.vehicleColor}
              onChange={handleChange}
              placeholder="e.g., Black, White, Red"
              className="form-input"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        </form>

        <div className="registration-info">
          <p>ℹ️ This information is required for parking management and security purposes.</p>
          <p>You can update this information later in your profile settings.</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleRegistration;
