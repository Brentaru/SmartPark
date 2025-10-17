import React from 'react';
import './Auth.css';

const Login = ({ onSwitchToRegister, onClose, isClosing, onLoginSuccess }) => {
  // Simple handler to redirect to dashboard
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className={`auth-container ${isClosing ? 'closing' : ''}`}>
      <div className="auth-content">
        <div style={{ marginBottom: '48px' }}>
          <h2>Login To</h2>
          <h1 className="brand">
            <span style={{ color: '#A40000' }}>SMART</span>
            <span style={{ color: '#ffffff' }}>PARK</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '-30px' }}>
            Access your parking dashboard
          </p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <input 
              type="text" 
              placeholder="Student ID or Email" 
              style={{ fontSize: '15px' }}
            />
          </div>
          
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              style={{ fontSize: '15px' }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              <input type="checkbox" style={{ marginRight: '8px', cursor: 'pointer', accentColor: '#A40000' }} />
              Remember me
            </label>
            <a href="#" style={{ fontSize: '13px', color: '#A40000', textDecoration: 'none', fontWeight: '500' }}>
              Forgot password?
            </a>
          </div>
          
          <button type="submit" style={{ marginTop: '32px', width: '100%' }}>Sign In</button>
          
          <div style={{ position: 'relative', textAlign: 'center', margin: '32px 0 24px' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ position: 'relative', background: 'linear-gradient(135deg, rgba(30, 30, 35, 0.98) 0%, rgba(20, 20, 25, 0.98) 100%)', padding: '0 16px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              OR
            </span>
          </div>
          
          <p style={{ textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '0' }}>
            Don't have an account?{' '}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }} 
              style={{ color: '#A40000', textDecoration: 'none', fontWeight: '600', borderBottom: '1px solid transparent', transition: 'border-color 0.3s' }}
              onMouseEnter={(e) => e.target.style.borderBottomColor = '#A40000'}
              onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
            >
              Create account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;