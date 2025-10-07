import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onNavigateToLogin, onNavigateToRegister }) => {

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-title">
            <span style={{ color: '#A40000' }}>SMART</span>
            <span style={{ color: '#ffffff' }}>PARK</span>
          </span>
        </div>
        <ul className="nav-links">
          <li><a href="#home" className="active">Home</a></li>
          <li><a href="#about">About us</a></li>
        </ul>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="nav-register-btn" onClick={onNavigateToRegister}>Register</button>
          <button className="nav-login-btn" onClick={onNavigateToLogin}>Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <p className="hero-subtitle">Welcome to</p>
          <h1 className="hero-title">
            <span style={{ color: '#A40000' }}>SMART</span>
            <span style={{ color: '#ffffff' }}>PARK</span>
          </h1>
          <p className="hero-description">
            SmartPark makes campus parking easy with real-time slot availability, quick vehicle registration, and smooth traffic flow.
          </p>
        </div>

        {/* Parking Gallery */}
        <div className="parking-gallery">
          <div className="gallery-grid">
            <img 
              src="/images/parking-lot-1.jpg" 
              alt="Campus Parking Lot 1" 
              className="parking-image"
            />
            <img 
              src="/images/parking-lot-2.jpg" 
              alt="Campus Parking Lot 2" 
              className="parking-image"
            />
            <img 
              src="/images/parking-lot-3.jpg" 
              alt="Campus Parking Lot 3" 
              className="parking-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
