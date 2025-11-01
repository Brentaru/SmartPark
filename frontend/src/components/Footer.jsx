import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="brand-text">SmartPark</span>
        </div>
        <p className="footer-text">
          © {currentYear} SmartPark. Making campus parking easier.
        </p>
      </div>
    </footer>
  );
};

export default Footer;