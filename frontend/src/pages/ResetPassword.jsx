import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import useForm from '../hooks/useForm';
import '../styles/Auth.css';

const ResetPassword = ({ onNavigateToLogin, onNavigateToLanding }) => {
  const [searchParams] = useSearchParams();
  const [resetStatus, setResetStatus] = useState(''); // 'success', 'error', or 'invalid'
  const [resetMessage, setResetMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  
  const token = searchParams.get('token');

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setResetStatus('invalid');
        setResetMessage('Invalid or missing reset token.');
        setCheckingToken(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/password/validate-token?token=${token}`);
        const data = await response.json();
        
        if (data.valid) {
          setTokenValid(true);
        } else {
          setResetStatus('invalid');
          setResetMessage('This reset link is invalid or has expired.');
        }
      } catch (error) {
        setResetStatus('error');
        setResetMessage('Failed to validate reset token. Please try again.');
      } finally {
        setCheckingToken(false);
      }
    };

    validateToken();
  }, [token]);

  // Validation function
  const validate = (values) => {
    const errors = {};

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
    { password: '', confirmPassword: '' },
    validate
  );

  // Submit handler
  const onSubmit = async (formValues) => {
    setResetMessage('');
    setResetStatus('');
    
    try {
      const response = await fetch('http://localhost:8080/api/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token,
          newPassword: formValues.password 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResetStatus('success');
        setResetMessage('Your password has been reset successfully!');
      } else {
        setResetStatus('error');
        setResetMessage(data.error || 'Failed to reset password. Please try again.');
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
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">
                  {checkingToken ? 'Validating reset link...' : 'Enter your new password'}
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
              {(resetStatus === 'error' || resetStatus === 'invalid') && (
                <div className="auth-error-banner">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {resetMessage}
                </div>
              )}

              {/* Form - Show only if token is valid and not yet successful */}
              {!checkingToken && tokenValid && resetStatus !== 'success' && (
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                  <InputField
                    label="New Password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter new password"
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
                    placeholder="Re-enter new password"
                    error={touched.confirmPassword && errors.confirmPassword}
                    required
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="auth-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                    {!isSubmitting && (
                      <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </Button>
                </form>
              )}

              {/* Success - Back to Login */}
              {resetStatus === 'success' && (
                <div className="auth-form">
                  <Button
                    variant="primary"
                    className="auth-submit-btn"
                    onClick={onNavigateToLogin}
                  >
                    Back to Login
                    <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              )}

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
                Secure Password Reset
              </h2>
              <p className="auth-info-description">
                Create a strong password to protect your SmartPark account.
              </p>
              
              {/* Features List */}
              <div className="auth-features">
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                  text="At least 8 characters"
                />
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  text="Include uppercase & lowercase"
                />
                <AuthFeature
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  }
                  text="Include at least one number"
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

export default ResetPassword;
