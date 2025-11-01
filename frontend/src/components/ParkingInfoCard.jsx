import React from 'react';
import '../styles/ParkingInfoCard.css';

const ParkingInfoCard = ({ icon, title, value, subtitle, status, onClick }) => {
  return (
    <div className={`parking-info-card ${status ? `status-${status}` : ''}`} onClick={onClick}>
      <div className="card-icon">
        {icon}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default ParkingInfoCard;
