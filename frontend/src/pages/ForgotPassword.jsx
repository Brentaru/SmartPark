import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import useForm from '../hooks/useForm';
import '../styles/Auth.css';

const ForgotPassword = ({ onNavigateToLogin, onNavigateToLanding }) => {
  const [resetStatus, setResetStatus] = useState(''); // 'success' or 'error'
  const [resetMessage, setResetMessage] = useState('');

  // Validation function
  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
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
    { email: '' },
    validate
  );

  // Submit handler
  const onSubmit = async (formValues) => {
    setResetMessage('');
    setResetStatus('');
    
    try {
      const response = await fetch('http://localhost:8080/api/password/forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formValues.email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResetStatus('success');
        setResetMessage(`Password reset instructions have been sent to ${formValues.email}. Please check your inbox.`);
      } else {
        setResetStatus('error');
        setResetMessage(data.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      setResetStatus('error');
      setResetMessage('Failed to connect to server. Please try again later.');
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
                <h1 className="auth-title">Forgot Password?</h1>
                <p className="auth-subtitle">
                  No worries! Enter your email and we'll send you reset instructions
                </p>
              </div>

              {/* Success Message */}
              {resetStatus === 'success' && (
                <div className="auth-success-banner">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {resetMessage}
                </div>
              )}

              {/* Error Message */}
              {resetStatus === 'error' && (
                <div className="auth-error-banner">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {resetMessage}
                </div>
              )}

              {/* Form - Always show but disable after success */}
              {/* Form - Always show but disable after success */}
              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your school email"
                  error={touched.email && errors.email}
                  required
                  disabled={resetStatus === 'success'}
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="auth-submit-btn"
                  disabled={isSubmitting || resetStatus === 'success'}
                >
                  {resetStatus === 'success' ? 'Email Sent ✓' : isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>

              {/* Back to Login Link */}
              <div className="auth-footer">
                <p className="auth-footer-text">
                  Remember your password?{' '}
                  <button onClick={onNavigateToLogin} className="auth-link">
                    Back to login
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
                Reset Your Password
              </h2>
              <p className="auth-info-description">
                We'll send you a secure link to reset your password. The link will be valid for 24 hours.
              </p>
              
              {/* Features List */}
              <div className="auth-features">
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                  text="Secure password reset process"
                />
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  text="Check your email inbox"
                />
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  text="Reset link expires in 24 hours"
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

export default ForgotPassword;
