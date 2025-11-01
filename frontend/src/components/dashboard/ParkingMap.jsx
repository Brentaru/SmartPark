import React from 'react';
import '../../styles/dashboard/ParkingMap.css';

const ParkingMap = ({ slots }) => {
  const getSlotClass = (status) => {
    switch(status) {
      case 'free': return 'slot-free';
      case 'occupied': return 'slot-occupied';
      case 'reserved': return 'slot-reserved';
      default: return '';
    }
  };

  const handleSlotClick = (slot) => {
    if (slot.status === 'free') {
      console.log(`Selected slot: ${slot.id}`);
      alert(`You selected slot ${slot.id}. Redirecting to reservation...`);
      // In real app: navigate to reservation with selected slot
    } else if (slot.status === 'reserved') {
      console.log(`View reservation for slot: ${slot.id}`);
      alert(`This is your reserved slot: ${slot.id}`);
    } else {
      alert(`Slot ${slot.id} is currently occupied.`);
    }
  };

  return (
    <div className="parking-map-container">
      <div className="map-header">
        <h2 className="map-title">Campus Parking Map</h2>
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-dot free"></span>
            <span className="legend-label">Free</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot occupied"></span>
            <span className="legend-label">Occupied</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot reserved"></span>
            <span className="legend-label">Reserved</span>
          </div>
        </div>
      </div>

      <div className="parking-grid">
        {slots && slots.map((slot) => (
          <div 
            key={slot.id} 
            className={`parking-slot ${getSlotClass(slot.status)}`}
            title={`Slot ${slot.id} - ${slot.status}`}
            onClick={() => handleSlotClick(slot)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2"/>
              <circle cx="12" cy="16" r="2"/>
              <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
            <span className="slot-number">{slot.id}</span>
          </div>
        ))}
      </div>

      <div className="map-footer">
        <p className="availability-text">
          <strong>{slots?.filter(s => s.status === 'free').length || 0}</strong> of <strong>{slots?.length || 0}</strong> slots available
        </p>
      </div>
    </div>
  );
};

export default ParkingMap;
