import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import useForm from '../hooks/useForm';
import '../styles/Auth.css';

const Register = ({ onNavigateToLogin, onNavigateToLanding, onNavigateToDashboard }) => {
  const { register } = useAuth();
  const [registerError, setRegisterError] = useState('');

  // Validation function
  const validate = (values) => {
    const errors = {};

    if (!values.studentId) {
      errors.studentId = 'Student/Faculty ID is required';
    } else if (!/^\d{2}-\d{4}-\d{3}$/.test(values.studentId)) {
      errors.studentId = 'ID must be in format: XX-XXXX-XXX (e.g., 21-1234-567)';
    }

    if (!values.firstName) {
      errors.firstName = 'First name is required';
    } else if (values.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!values.lastName) {
      errors.lastName = 'Last name is required';
    } else if (values.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!values.email) {
      errors.email = 'School email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    } else if (!values.email.includes('.edu')) {
      errors.email = 'Please use your school email (.edu)';
    }

    if (!values.contactNumber) {
      errors.contactNumber = 'Contact number is required';
    } else if (!/^[0-9]{10,11}$/.test(values.contactNumber.replace(/[-\s]/g, ''))) {
      errors.contactNumber = 'Please enter a valid contact number (10-11 digits)';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
    handleSubmit
  } = useForm(
    { 
      studentId: '',
      firstName: '', 
      lastName: '', 
      email: '',
      contactNumber: '',
      password: '',
      confirmPassword: ''
    },
    validate
  );

  // Submit handler
  const onSubmit = async (formValues) => {
    setRegisterError('');
    
    try {
      const result = await register({
        id: formValues.studentId,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        contactNumber: formValues.contactNumber,
        password: formValues.password,
      });
      
      if (result.success) {
        // Show success message
        alert(`Welcome to SmartPark, ${result.user.firstName}! Your account has been created.`);
        // Navigate to dashboard
        onNavigateToDashboard();
      } else {
        setRegisterError(result.error);
      }
    } catch (error) {
      setRegisterError('An unexpected error occurred. Please try again.');
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
        <div className="auth-card auth-card-register">
          {/* Left Side - Image/Info */}
          <div className="auth-info-section">
            <div className="auth-info-overlay"></div>
            <div className="auth-info-content">
              <h2 className="auth-info-title">
                Join SmartPark Today
              </h2>
              <p className="auth-info-description">
                Create your account and start enjoying seamless parking management on campus.
              </p>
              
              {/* Features List */}
              <div className="auth-features">
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                  text="Quick and easy registration"
                />
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                  text="Secure data protection"
                />
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  }
                  text="Easy booking management"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-section">
            <div className="auth-form-content">
              {/* Header */}
              <div className="auth-header">
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">
                  Sign up with your school email to get started
                </p>
              </div>

              {/* Error Message */}
              {registerError && (
                <div className="auth-error-banner">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {registerError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                {/* Student ID Field */}
                <InputField
                  label="Student/Faculty ID"
                  type="text"
                  name="studentId"
                  value={values.studentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="21-1234-567"
                  error={touched.studentId && errors.studentId}
                  required
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  }
                />

                {/* Name Fields Row */}
                <div className="form-row">
                  <InputField
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="John"
                    error={touched.firstName && errors.firstName}
                    required
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />

                  <InputField
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Doe"
                    error={touched.lastName && errors.lastName}
                    required
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    }
                  />
                </div>

                <InputField
                  label="School Email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="john.doe@cit.edu"
                  error={touched.email && errors.email}
                  required
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />

                <InputField
                  label="Contact Number"
                  type="tel"
                  name="contactNumber"
                  value={values.contactNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="09123456789"
                  error={touched.contactNumber && errors.contactNumber}
                  required
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
                  placeholder="Create a strong password"
                  error={touched.password && errors.password}
                  required
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />

                <InputField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Re-enter your password"
                  error={touched.confirmPassword && errors.confirmPassword}
                  required
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />

                {/* Terms and Conditions */}
                <div className="auth-terms">
                  <label className="checkbox-label">
                    <input type="checkbox" className="checkbox-input" required />
                    <span className="checkbox-text">
                      I agree to the{' '}
                      <button type="button" className="terms-link">Terms of Service</button>
                      {' '}and{' '}
                      <button type="button" className="terms-link">Privacy Policy</button>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="auth-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                  {!isSubmitting && (
                    <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </Button>
              </form>

              {/* Sign In Link */}
              <div className="auth-footer">
                <p className="auth-footer-text">
                  Already have an account?{' '}
                  <button onClick={onNavigateToLogin} className="auth-link">
                    Sign in
                  </button>
                </p>
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

export default Register;