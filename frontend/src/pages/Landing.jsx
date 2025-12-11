import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Landing.css';

const Landing = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // 'success' or 'error'
  const [submitMessage, setSubmitMessage] = useState('');

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    setSubmitMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage('Message sent successfully! We\'ll get back to you soon.');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to connect to server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing-page">
      <Navbar 
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToRegister={onNavigateToRegister}
      />

      {/* Hero Section with Background Image */}
      <section id="home" className="hero-section">
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
              <button className="btn hero-btn-primary" onClick={onNavigateToRegister}>
                <span>Get Started</span>
              </button>
              <button className="btn hero-btn-secondary" onClick={onNavigateToLogin}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
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
      <section id="about" className="benefits-section">
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

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-description">Have questions? We'd love to hear from you</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Email</h3>
                  <p>support@smartpark.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="contact-details">
                  <h3>Location</h3>
                  <p>Campus Parking Office, Building A</p>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              {submitStatus === 'success' && (
                <div className="contact-success-message">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {submitMessage}
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="contact-error-message">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {submitMessage}
                </div>
              )}
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    className="form-input" 
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Your Email" 
                    className="form-input" 
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    name="message"
                    placeholder="Your Message" 
                    rows="5" 
                    className="form-input form-textarea"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
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
