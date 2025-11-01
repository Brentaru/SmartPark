import React from 'react';
import '../../styles/dashboard/StatsCard.css';

const StatsCard = ({ icon, label, value, status, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      console.log(`Clicked on ${label} card`);
    }
  };

  return (
    <div 
      className={`stats-card ${status ? `stats-${status}` : ''}`} 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="stats-icon">
        {icon}
      </div>
      <div className="stats-info">
        <p className="stats-label">{label}</p>
        <h3 className="stats-value">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
