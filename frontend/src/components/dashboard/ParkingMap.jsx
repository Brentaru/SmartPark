import React from 'react';
import '../../styles/dashboard/ParkingMap.css';

const ParkingMap = ({ slots, onSlotClick, canReserve = false, guardMode = false }) => {
  const getSlotClass = (status) => {
    switch(status) {
      case 'free': return 'slot-free';
      case 'occupied': return 'slot-occupied';
      case 'reserved': return 'slot-reserved';
      default: return '';
    }
  };

  const handleSlotClick = (slot) => {
    if (guardMode && onSlotClick) {
      // Guard view - allow managing any slot
      onSlotClick(slot);
    } else if (canReserve && onSlotClick) {
      // Staff view - allow reservation
      if (slot.status === 'free') {
        onSlotClick(slot);
      } else if (slot.status === 'reserved') {
        alert(`This slot is already reserved.`);
      } else {
        alert(`Slot ${slot.location} is currently occupied.`);
      }
    } else {
      // Student view - default behavior
      if (slot.status === 'free') {
        console.log(`Selected slot: ${slot.location}`);
        alert(`You selected slot ${slot.location}. Redirecting to reservation...`);
      } else if (slot.status === 'reserved') {
        console.log(`View reservation for slot: ${slot.location}`);
        alert(`This is your reserved slot: ${slot.location}`);
      } else {
        alert(`Slot ${slot.location} is currently occupied.`);
      }
    }
  };

  // Sort slots by location before splitting into rows to maintain consistent positioning
  const sortedSlots = slots ? [...slots].sort((a, b) => {
    // Extract letter and number from location (e.g., "A-01" -> ["A", "01"])
    const [letterA, numA] = a.location.split('-');
    const [letterB, numB] = b.location.split('-');
    
    // First compare letters, then numbers
    if (letterA !== letterB) {
      return letterA.localeCompare(letterB);
    }
    return parseInt(numA) - parseInt(numB);
  }) : [];

  // Split slots into top and bottom rows for NGE parking layout
  const topRowSlots = sortedSlots.slice(0, 12) || [];
  const bottomRowSlots = sortedSlots.slice(12, 20) || [];

  // Check if there are no slots
  if (!slots || slots.length === 0) {
    return (
      <div className="parking-map-container">
        <div className="map-header">
          <div className="map-title-section">
            <h2 className="map-title">Campus Parking Map</h2>
            <span className="map-subtitle">NGE Parking Area</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '8px' }}>
          <svg style={{ width: '64px', height: '64px', margin: '0 auto 1rem', color: '#9ca3af' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="11" width="14" height="10" rx="2"/>
            <circle cx="12" cy="16" r="2"/>
            <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            <line x1="4" y1="4" x2="20" y2="20"/>
          </svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
            No Parking Slots Available
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Please add parking slots to the database to see them here.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
            Run: <code style={{ background: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>database/add_parking_slots_simple.sql</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="parking-map-container">
      <div className="map-header">
        <div className="map-title-section">
          <h2 className="map-title">Campus Parking Map</h2>
          <span className="map-subtitle">NGE Parking Area</span>
        </div>
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

      <div className="nge-parking-layout">
        {/* Top Row */}
        <div className="parking-row parking-row-top">
          {topRowSlots.map((slot) => (
            <div 
              key={slot.id} 
              className={`parking-slot ${getSlotClass(slot.status)}`}
              title={`Slot ${slot.location} - ${slot.status}`}
              onClick={() => handleSlotClick(slot)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2"/>
                <circle cx="12" cy="16" r="2"/>
                <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <span className="slot-number">{slot.location}</span>
            </div>
          ))}
        </div>

        {/* Road Separator */}
        <div className="parking-road">
          <div className="road-line"></div>
          <span className="road-label">ROAD</span>
          <div className="road-line"></div>
        </div>

        {/* Bottom Row */}
        <div className="parking-row parking-row-bottom">
          {bottomRowSlots.map((slot) => (
            <div 
              key={slot.id} 
              className={`parking-slot ${getSlotClass(slot.status)}`}
              title={`Slot ${slot.location} - ${slot.status}`}
              onClick={() => handleSlotClick(slot)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2"/>
                <circle cx="12" cy="16" r="2"/>
                <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <span className="slot-number">{slot.location}</span>
            </div>
          ))}
        </div>
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
