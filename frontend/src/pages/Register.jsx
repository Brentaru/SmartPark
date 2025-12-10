import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import useForm from '../hooks/useForm';
import '../styles/Auth.css';

const Register = ({ onNavigateToLogin, onNavigateToLanding, onNavigateToDashboard }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Detect role based on ID format
  const detectRoleFromId = (studentId) => {
    const studentFormat = /^\d{2}-\d{4}-\d{3}$/;  // xx-xxxx-xxx
    const staffFormat = /^\d{2}-\d{4}-\d{4}$/;    // xx-xxxx-xxxx
    const guardFormat = /^\d{2}-\d{3}-\d{3}$/;    // xx-xxx-xxx
    const adminFormat = /^\d{2}-\d{2}-\d{2}$/;    // xx-xx-xx (admin)
    
    if (studentFormat.test(studentId)) return 'student';
    if (staffFormat.test(studentId)) return 'staff';
    if (guardFormat.test(studentId)) return 'guard';
    if (adminFormat.test(studentId)) return 'admin';
    return 'student'; // default
  };

  // Validation function
  const validate = (values) => {
    const errors = {};

    if (!values.studentId) {
      errors.studentId = 'ID is required';
    } else {
      // Accept four different ID formats:
      // Student: xx-xxxx-xxx (e.g., 20-2024-123)
      // Staff: xx-xxxx-xxxx (e.g., 20-2024-1234)
      // Guard: xx-xxx-xxx (e.g., 20-123-456)
      // Admin: xx-xx-xx (e.g., 99-99-99)
      const studentFormat = /^\d{2}-\d{4}-\d{3}$/;
      const staffFormat = /^\d{2}-\d{4}-\d{4}$/;
      const guardFormat = /^\d{2}-\d{3}-\d{3}$/;
      const adminFormat = /^\d{2}-\d{2}-\d{2}$/;
      
      if (!studentFormat.test(values.studentId) && 
          !staffFormat.test(values.studentId) && 
          !guardFormat.test(values.studentId) &&
          !adminFormat.test(values.studentId)) {
        errors.studentId = 'Invalid ID format. Student: xx-xxxx-xxx, Staff: xx-xxxx-xxxx, Guard: xx-xxx-xxx, Admin: xx-xx-xx';
      }
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
      // Auto-detect role based on ID format
      const detectedRole = detectRoleFromId(formValues.studentId);
      
      const result = await register({
        studentId: formValues.studentId,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        contactNumber: formValues.contactNumber,
        password: formValues.password,
        role: detectedRole, // Auto-assign role based on ID format
      });
      
      if (result.success) {
        // Auto-detect role based on ID format
        const detectedRole = detectRoleFromId(formValues.studentId);
        
        // Only admin and guard skip vehicle registration
        if (detectedRole === 'admin' || detectedRole === 'guard') {
          alert(`Welcome to SmartPark, ${result.user.firstName}! You are registered as ${detectedRole}.`);
          // Direct to dashboard without vehicle registration
          setTimeout(() => {
            if (detectedRole === 'admin') {
              window.location.href = '/admin-dashboard';
            } else {
              navigate('/dashboard');
            }
          }, 100);
        } else {
          // Student and staff need to register vehicle
          alert(`Welcome to SmartPark, ${result.user.firstName}! You are registered as ${detectedRole}. Please register your vehicle to continue.`);
          setTimeout(() => {
            navigate('/vehicle-registration');
          }, 100);
        }
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
                {/* ID Field - supports Student/Staff/Guard formats */}
                <InputField
                  label="ID Number"
                  type="text"
                  name="studentId"
                  value={values.studentId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your ID number"
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
                    placeholder="Enter first name"
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
                    placeholder="Enter last name"
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
                  placeholder="Enter school email address"
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
                  placeholder="Enter contact number"
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
                  placeholder="Enter password"
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
                  placeholder="Re-enter password"
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
                      <button type="button" className="terms-link" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}>Terms of Service</button>
                      {' '}and{' '}
                      <button type="button" className="terms-link" onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }}>Privacy Policy</button>
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

                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />

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

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Terms of Service</h2>
              <button className="modal-close" onClick={() => setShowTermsModal(false)}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <h3>1. Acceptance of Terms</h3>
              <p>By accessing and using SmartPark, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h3>2. Use License</h3>
              <p>Permission is granted to temporarily access SmartPark for personal, non-commercial use only. This is the grant of a license, not a transfer of title.</p>
              
              <h3>3. User Account</h3>
              <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
              
              <h3>4. Parking Reservations</h3>
              <p>All parking slot reservations are subject to availability. SmartPark reserves the right to cancel or modify reservations under certain circumstances.</p>
              
              <h3>5. User Conduct</h3>
              <p>You agree not to misuse the SmartPark service, including but not limited to: making false reservations, sharing account credentials, or violating campus parking regulations.</p>
              
              <h3>6. Limitation of Liability</h3>
              <p>SmartPark shall not be liable for any damages arising from the use or inability to use the service, including but not limited to parking-related incidents.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowTermsModal(false)}>I Understand</button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Privacy Policy</h2>
              <button className="modal-close" onClick={() => setShowPrivacyModal(false)}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <h3>Information We Collect</h3>
              <p>We collect information that you provide directly to us, including: ID number, name, school email, contact number, and vehicle information.</p>
              
              <h3>How We Use Your Information</h3>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve SmartPark services</li>
                <li>Process parking reservations and manage parking slots</li>
                <li>Send you technical notices and support messages</li>
                <li>Verify your identity and prevent fraud</li>
              </ul>
              
              <h3>Information Sharing</h3>
              <p>We do not sell or share your personal information with third parties except as necessary to provide our services or as required by law.</p>
              
              <h3>Data Security</h3>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              
              <h3>Your Rights</h3>
              <p>You have the right to access, update, or delete your personal information at any time through your account settings.</p>
              
              <h3>Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@smartpark.edu</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowPrivacyModal(false)}>I Understand</button>
            </div>
          </div>
        </div>
      )}
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