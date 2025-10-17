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
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About Us</a></li>
        </ul>
        <div className="nav-actions">
          <button className="nav-register-btn" onClick={onNavigateToRegister}>Register</button>
          <button className="nav-login-btn" onClick={onNavigateToLogin}>Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${process.env.PUBLIC_URL}/images/campus-parking.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="hero-content">
          <h1 className="hero-title">
            <span style={{ color: '#A40000' }}>SMART</span>
            <span style={{ color: '#ffffff' }}>PARK</span>
          </h1>
          <p className="hero-description">
            SmartPark makes campus parking easy with real-time slot availability, quick vehicle registration, and smooth traffic flow.
          </p>
          <div className="hero-buttons">
            <button className="hero-cta-primary" onClick={onNavigateToRegister}>
              Get Started
            </button>
            <button className="hero-cta-secondary" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
        </div>

        <div className="parking-gallery">
          <div className="gallery-grid">
            <img 
              src={`${process.env.PUBLIC_URL}/images/parking-lot-1.jpg`}
              alt="Campus Parking Lot 1" 
              className="parking-image"
            />
            <img 
              src={`${process.env.PUBLIC_URL}/images/parking-lot-2.jpg`}
              alt="Campus Parking Lot 2" 
              className="parking-image"
            />
            <img 
              src={`${process.env.PUBLIC_URL}/images/parking-lot-3.jpg`}
              alt="Campus Parking Lot 3" 
              className="parking-image"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">
            <span>Why Choose </span>
            <span>SmartPark?</span>
          </h2>
          <p className="section-subtitle">
            Experience the future of campus parking management with our cutting-edge features
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Real-Time Availability</h3>
            <p className="feature-description">
              Monitor available, occupied, and reserved parking slots instantly through our intuitive dashboard.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚙</div>
            <h3 className="feature-title">Vehicle Registration</h3>
            <p className="feature-description">
              Quick and easy vehicle registration linked to your school-issued parking sticker.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3 className="feature-title">Guard Verification</h3>
            <p className="feature-description">
              Seamless entry and exit with plate number recognition or QR code scanning.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Role-Based Access</h3>
            <p className="feature-description">
              Customized access levels for administrators, security guards, and registered users.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3 className="feature-title">Parking History</h3>
            <p className="feature-description">
              Complete records of parking activities and violation tracking for policy improvement.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Data Analytics</h3>
            <p className="feature-description">
              Make informed decisions with comprehensive parking usage statistics and insights.
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          
          {/* Main About Content */}
          <div className="about-header">
            <span className="section-tag">About SmartPark</span>
            <h2 className="about-main-title">Building the Future of Campus Parking</h2>
          </div>

          <div className="about-grid">
            <div className="about-text-content">
              <p className="about-description">
                SmartPark is a comprehensive web-based parking management system designed to revolutionize 
                how educational institutions handle parking operations. We combine cutting-edge technology 
                with practical functionality to solve real campus challenges.
              </p>
              <p className="about-description">
                Our platform eliminates the frustrations of traditional parking systems by providing 
                real-time monitoring, digital verification, and data-driven insights—helping students, 
                faculty, and administrators manage parking efficiently and effectively.
              </p>
            </div>

            <div className="mission-vision-grid">
              <div className="mv-card">
                <div className="mv-icon-wrapper">
                  <span className="mv-icon">🎯</span>
                </div>
                <h3 className="mv-title">Our Mission</h3>
                <p className="mv-text">
                  To streamline campus parking through innovative technology, creating seamless 
                  experiences that save time and optimize space utilization.
                </p>
              </div>

              <div className="mv-card">
                <div className="mv-icon-wrapper">
                  <span className="mv-icon">🚀</span>
                </div>
                <h3 className="mv-title">Our Vision</h3>
                <p className="mv-text">
                  To become the leading parking management solution for educational institutions, 
                  setting new standards for campus mobility.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="team-section">
            <h3 className="team-title">Meet Our Team</h3>
            <p className="team-subtitle">
              Built by passionate developers dedicated to solving real-world challenges through innovation.
            </p>
            <div className="team-grid">
              <div className="team-card">
                <div className="team-avatar">BU</div>
                <h4 className="team-name">Brent Jelson Unabia</h4>
                <p className="team-role">Lead Developer</p>
              </div>
              <div className="team-card">
                <div className="team-avatar">JL</div>
                <h4 className="team-name">Jhon Gil Lauro</h4>
                <p className="team-role">Full Stack Developer</p>
              </div>
              <div className="team-card">
                <div className="team-avatar">BG</div>
                <h4 className="team-name">Benz Leo Gamallo</h4>
                <p className="team-role">Systems Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span style={{ color: '#A40000' }}>SMART</span>
            <span style={{ color: '#ffffff' }}>PARK</span>
          </div>
          <p className="footer-text">
            © 2025 SmartPark. Transforming campus parking, one slot at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
