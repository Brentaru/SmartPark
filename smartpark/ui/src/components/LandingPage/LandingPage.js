import React, { useState } from 'react';
import './LandingPage.css';

const LandingPage = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const [location, setLocation] = useState('Los Angeles Parking');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('08:00 AM');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('08:00 AM');
  const [promoCode, setPromoCode] = useState('');

  const handleBookNow = (e) => {
    e.preventDefault();
    console.log('Booking:', { location, checkInDate, checkInTime, checkOutDate, checkOutTime, promoCode });
  };

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

        {/* Booking Section */}
        <div className="booking-section">
          <h2 className="booking-title">Book Now</h2>
          <form className="booking-form" onSubmit={handleBookNow}>
            <div className="form-row">
              {/* Location */}
              <div className="form-group">
                <label>SELECT LOCATION</label>
                <select 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-input"
                >
                  <option>Los Angeles Parking</option>
                  <option>New York Parking</option>
                  <option>San Francisco Parking</option>
                  <option>Chicago Parking</option>
                </select>
              </div>

              {/* Check In */}
              <div className="form-group">
                <label>CHECK IN</label>
                <div className="datetime-group">
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="form-input date-input"
                    placeholder="Select Date"
                  />
                  <select
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="form-input time-input"
                  >
                    <option>08:00 AM</option>
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 PM</option>
                    <option>01:00 PM</option>
                    <option>02:00 PM</option>
                    <option>03:00 PM</option>
                    <option>04:00 PM</option>
                    <option>05:00 PM</option>
                    <option>06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Check Out */}
              <div className="form-group">
                <label>CHECK OUT</label>
                <div className="datetime-group">
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="form-input date-input"
                    placeholder="Select Date"
                  />
                  <select
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="form-input time-input"
                  >
                    <option>08:00 AM</option>
                    <option>09:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 PM</option>
                    <option>01:00 PM</option>
                    <option>02:00 PM</option>
                    <option>03:00 PM</option>
                    <option>04:00 PM</option>
                    <option>05:00 PM</option>
                    <option>06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Promo Code */}
              <div className="form-group">
                <label>PROMO CODE <span className="optional">(optional)</span></label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="form-input"
                  placeholder=""
                />
              </div>

              {/* Book Now Button */}
              <div className="form-group book-button-group">
                <button type="submit" className="book-now-btn">Book Now</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
