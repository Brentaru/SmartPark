import React from 'react';
import '../styles/Navbar.css';

const Navbar = ({ onNavigateToLogin, onNavigateToRegister }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-text">
            <span className="brand-smart">Smart</span>
            <span className="brand-park">Park</span>
          </span>
        </div>
        
        <div className="navbar-actions">
          <button className="btn-nav btn-nav-login" onClick={onNavigateToLogin}>
            Sign In
          </button>
          <button className="btn-nav btn-nav-register" onClick={onNavigateToRegister}>
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;