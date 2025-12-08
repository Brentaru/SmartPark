import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import useForm from '../hooks/useForm';
import '../styles/Auth.css';

const Login = ({ onNavigateToRegister, onNavigateToLanding, onNavigateToDashboard, onNavigateToForgotPassword }) => {
  const { login } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Validation function
  const validate = (values) => {
    const errors = {};

    if (!values.studentId) {
      errors.studentId = 'ID is required';
    } else {
      // Accept ID formats:
      // Student: xx-xxxx-xxx (e.g., 20-2024-123)
      // Staff: xx-xxxx-xxxx (e.g., 20-2024-1234)
      // Guard: xx-xxx-xxx (e.g., 20-123-456)
      // Admin: xx-xxxx-xx (e.g., 99-2025-01)
      const studentFormat = /^\d{2}-\d{4}-\d{3}$/;
      const staffFormat = /^\d{2}-\d{4}-\d{4}$/;
      const guardFormat = /^\d{2}-\d{3}-\d{3}$/;
      const adminFormat = /^\d{2}-\d{4}-\d{2}$/; // Admin format
      
      if (!studentFormat.test(values.studentId) && 
          !staffFormat.test(values.studentId) && 
          !guardFormat.test(values.studentId) &&
          !adminFormat.test(values.studentId)) {
        errors.studentId = 'Invalid ID format. Use: Student (xx-xxxx-xxx), Staff (xx-xxxx-xxxx), Guard (xx-xxx-xxx), or Admin (xx-xxxx-xx)';
      }
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

  // Form hook
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors
  } = useForm(
    { studentId: '', password: '' },
    validate
  );

  // Submit handler
  const onSubmit = async (formValues) => {
    setLoginError('');
    
    try {
      const result = await login(formValues.studentId, formValues.password);
      
      if (result.success) {
        // Check if user has registered their vehicle
        if (!result.user.plateNumber) {
          // Redirect to vehicle registration
          alert(`Welcome, ${result.user.firstName}! Please register your vehicle to continue.`);
          window.location.href = '/vehicle-registration';
        } else {
          // Show success message
          alert(`Welcome back, ${result.user.firstName}!`);
          // Navigate to appropriate dashboard based on role
          const userRole = result.user.role?.toLowerCase();
          if (userRole === 'admin') {
            window.location.href = '/admin-dashboard';
          } else {
            onNavigateToDashboard();
          }
        }
      } else {
        setLoginError('Invalid credentials. Please check your ID number and password.');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      {/* Background decoration */}
      <div className="auth-background">
        <div className="auth-shape auth-shape-1"></div>
        <div className="auth-shape auth-shape-2"></div>
        <div className="auth-shape auth-shape-3"></div>
      </div>

      {/* Navigation */}
      <nav className="auth-nav">
        <button onClick={onNavigateToLanding} className="auth-logo">
          <span className="logo-smart">Smart</span>
          <span className="logo-park">Park</span>
        </button>
        <button onClick={onNavigateToLanding} className="back-to-home-btn">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
      </nav>

      {/* Main Content */}
      <div className="auth-container">
        <div className="auth-card">
          {/* Left Side - Form */}
          <div className="auth-form-section">
            <div className="auth-form-content">
              {/* Header */}
              <div className="auth-header">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">
                  Sign in to access your SmartPark account
                </p>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="auth-error-banner">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {loginError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <InputField
                  label="ID Number"
                  type="text"
                  name="studentId"
                  value={values.studentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter ID number"
                  error={touched.studentId && errors.studentId}
                  required
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  }
                />

                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter password"
                  error={touched.password && errors.password}
                  required
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />

                {/* Remember Me & Forgot Password */}
                <div className="auth-options">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      className="checkbox-input" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkbox-text">Remember me</span>
                  </label>
                  <button type="button" className="forgot-password-link" onClick={onNavigateToForgotPassword}>
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                  {!isSubmitting && (
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <div className="auth-footer">
                <p className="auth-footer-text">
                  Don't have an account?{' '}
                  <button onClick={onNavigateToRegister} className="auth-link">
                    Sign up for free
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Image/Info */}
          <div className="auth-info-section">
            <div className="auth-info-overlay"></div>
            <div className="auth-info-content">
              <h2 className="auth-info-title">
                Smart Parking for Your Campus
              </h2>
              <p className="auth-info-description">
                Experience hassle-free parking with real-time availability, instant booking, and digital records.
              </p>
              
              {/* Features List */}
              <div className="auth-features">
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  text="Real-time parking availability"
                />
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  text="Instant spot reservation"
                />
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  text="Secure and verified access"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Auth Feature Component
const AuthFeature = ({ icon, text }) => (
  <div className="auth-feature">
    <span className="auth-feature-icon">{icon}</span>
    <span className="auth-feature-text">{text}</span>
  </div>
);

export default Login;