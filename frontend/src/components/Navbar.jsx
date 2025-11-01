import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';

const Navbar = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'pricing', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-text">
            <span className="brand-smart">Smart</span>
            <span className="brand-park">Park</span>
          </span>
        </div>
        
        <div className="navbar-links">
          <a 
            href="#home" 
            className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
          >
            Home
          </a>
          <a 
            href="#features" 
            className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
          >
            Features
          </a>
          <a 
            href="#pricing" 
            className={`nav-link ${activeSection === 'pricing' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}
          >
            Pricing
          </a>
          <a 
            href="#about" 
            className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
          >
            About
          </a>
          <a 
            href="#contact" 
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
          >
            Contact
          </a>
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