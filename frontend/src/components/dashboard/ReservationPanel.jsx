import React from 'react';
import '../../styles/dashboard/ReservationPanel.css';

const ReservationPanel = ({ myReservations, onCancelReservation, currentUser }) => {
  // If myReservations prop is provided, show staff/guard view
  if (myReservations !== undefined) {
    return (
      <div className="reservation-panel">
        <div className="panel-header">
          <h2 className="panel-title">My Reservations</h2>
        </div>

        {myReservations && myReservations.length > 0 ? (
          <div className="reservations-list">
            {myReservations.map((reservation, index) => (
              <div key={index} className="reservation-card">
                <div className="reservation-info">
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="11" width="14" height="10" rx="2"/>
                      <circle cx="12" cy="16" r="2"/>
                    </svg>
                  </div>
                  <div className="info-content">
                    <h3 className="reservation-slot">Slot {reservation.id}</h3>
                    <p className="reservation-location">{reservation.location}</p>
                    <p className="reservation-for">Reserved for: <strong>{reservation.reservedFor}</strong></p>
                  </div>
                </div>
                <button 
                  className="btn-cancel-small"
                  onClick={() => onCancelReservation(reservation.id)}
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="reservation-empty">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="2"/>
                <circle cx="12" cy="16" r="2"/>
                <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </div>
            <h3 className="empty-title">No Active Reservations</h3>
            <p className="empty-text">Click on available slots in the parking map below to reserve them</p>
          </div>
        )}
      </div>
    );
  }

  // Original student view (backward compatibility)
  const { currentReservation, onReserve, onCancel } = myReservations || {};
  
  return (
    <div className="reservation-panel">
      <div className="panel-header">
        <h2 className="panel-title">Reservation Panel</h2>
      </div>

      {currentReservation ? (
        <div className="reservation-active">
          <div className="reservation-info">
            <div className="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="info-content">
              <h3 className="reservation-slot">Reserved Slot #{currentReservation.slot}</h3>
              <p className="reservation-time">
                {currentReservation.date} • {currentReservation.timeStart} - {currentReservation.timeEnd}
              </p>
              <p className="reservation-location">{currentReservation.location}</p>
            </div>
          </div>

          <div className="reservation-actions">
            <button className="btn-cancel" onClick={onCancel}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Cancel Reservation
            </button>
            <button 
              className="btn-modify"
              onClick={() => {
                console.log('Modify reservation');
                alert('Redirecting to modify reservation... (Feature coming soon)');
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Modify
            </button>
          </div>
        </div>
      ) : (
        <div className="reservation-empty">
          <div className="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2"/>
              <circle cx="12" cy="16" r="2"/>
              <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <h3 className="empty-title">No Active Reservation</h3>
          <p className="empty-text">Reserve a parking slot for your next visit</p>
          <button className="btn-reserve" onClick={onReserve}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Reserve a Slot
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationPanel;
