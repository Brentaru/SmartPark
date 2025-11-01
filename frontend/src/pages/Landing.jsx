import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Landing.css';

const Landing = ({ onNavigateToLogin, onNavigateToRegister }) => {
  return (
    <div className="landing-page">
      <Navbar 
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToRegister={onNavigateToRegister}
      />

      {/* Hero Section with Background Image */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Smart Parking for Your Campus
            </h1>
            <p className="hero-subtitle">
              Effortlessly find, reserve, and manage your parking spot. 
              Experience hassle-free parking with real-time availability and instant booking.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={onNavigateToRegister}>
                <span>Get Started Free</span>
                <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="btn btn-secondary-outline" onClick={onNavigateToLogin}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-description">Everything you need for seamless parking management</p>
          </div>
          
          <div className="features-grid">
            <FeatureCard 
              title="Real-Time Availability"
              description="Check available parking spots instantly with live updates and interactive maps"
            />
            <FeatureCard 
              title="Quick Reservation"
              description="Reserve your spot in seconds with our streamlined booking process"
            />
            <FeatureCard 
              title="Digital Records"
              description="Access your complete parking history and receipts anytime, anywhere"
            />
            <FeatureCard 
              title="Secure & Safe"
              description="Enterprise-grade security with encrypted data and role-based access"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose <span className="highlight-red">Us</span></h2>
            <p className="section-description">The smart solution for modern campus parking</p>
          </div>
          
          <div className="benefits-radial-container">
            <div className="benefits-center">
              <h3>Why Choose <span className="highlight-red">Us</span></h3>
            </div>
            
            <BenefitCard 
              position="top-left"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Smart and Efficient"
              description="Reserve your slot before arriving to save time."
            />
            
            <BenefitCard 
              position="top-right"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
              title="Real-Time Updates"
              description="Always know which slots are available."
            />
            
            <BenefitCard 
              position="bottom-left"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Secure and Verified Access"
              description="Only registered students and staff can book slots."
            />
            
            <BenefitCard 
              position="bottom-right"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              }
              title="Hassle-Free Parking"
              description="Avoid driving around — park where you already booked."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">Get started in three simple steps</p>
          </div>
          
          <div className="steps-container">
            <StepCard 
              number="1"
              title="Create Account"
              description="Sign up with your campus credentials and verify your student or faculty status"
            />
            <StepCard 
              number="2"
              title="Find & Reserve"
              description="Browse real-time parking availability and reserve your preferred spot instantly"
            />
            <StepCard 
              number="3"
              title="Park & Go"
              description="Navigate to your reserved spot using our interactive map and park with confidence"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Parking Experience?</h2>
            <p className="cta-subtitle">Join SmartPark today and say goodbye to parking stress</p>
            <div className="cta-buttons">
              <button className="btn btn-white" onClick={onNavigateToRegister}>
                <span>Get Started Now</span>
                <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="btn btn-outline-white" onClick={onNavigateToLogin}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description }) => (
  <div className="feature-card">
    <div className="feature-icon-wrapper">
      <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
      </svg>
    </div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

// Benefit Card Component
const BenefitCard = ({ icon, title, description, position }) => (
  <div className={`benefit-card benefit-${position}`}>
    <div className="benefit-arrow"></div>
    <div className="benefit-content">
      <div className="benefit-icon-wrapper">
        {icon}
      </div>
      <h3 className="benefit-title">{title}</h3>
      <p className="benefit-description">→ {description}</p>
    </div>
  </div>
);

// Step Card Component
const StepCard = ({ number, title, description }) => (
  <div className="step-card">
    <div className="step-number-wrapper">
      <span className="step-number">{number}</span>
    </div>
    <h3 className="step-title">{title}</h3>
    <p className="step-description">{description}</p>
    <div className="step-arrow">→</div>
  </div>
);

export default Landing;
