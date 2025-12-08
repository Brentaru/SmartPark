import React, { useState } from 'react';

const RecordExitModal = ({ onClose }) => {
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSearch = () => {
    if (!plateNumber.trim()) return;
    
    setLoading(true);
    
    // Simulate API call to find entry record
    setTimeout(() => {
      setVehicleData({
        plateNumber: plateNumber.toUpperCase(),
        owner: 'John Doe',
        entryTime: 'Jan 15, 2024, 08:30 AM',
        parkingArea: 'Area A - Main Building',
        slotNumber: 'A-101',
        duration: '2 hours 15 minutes',
        fee: '50.00'
      });
      setLoading(false);
    }, 1000);
  };

  const handleRecordExit = () => {
    // Simulate API call to record exit
    setTimeout(() => {
      setSuccess(true);
    }, 500);
  };

  const handleReset = () => {
    setPlateNumber('');
    setVehicleData(null);
    setSuccess(false);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay vehicle-modal" onClick={onClose}>
      <div className="modal-container vehicle-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Record Exit Time</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {!vehicleData && !success ? (
            <>
              <div className="info-box">
                <p className="info-box-content">
                  Enter the vehicle's plate number to retrieve entry record and record exit time.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Plate Number *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., ABC 1234"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  autoFocus
                />
              </div>
            </>
          ) : !success ? (
            <>
              <div className="info-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span className="info-box-title" style={{ margin: 0 }}>Current Time</span>
                </div>
                <p className="info-box-content" style={{ fontWeight: 600, color: '#111827' }}>
                  {getCurrentTime()}
                </p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>
                  Entry Record
                </h3>
                <div style={{ background: '#fafafa', borderRadius: '0.5rem', padding: '1rem', border: '1px solid #f3f4f6' }}>
                  <div className="info-row">
                    <span className="info-row-label">Plate Number</span>
                    <span className="info-row-value">{vehicleData.plateNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Owner</span>
                    <span className="info-row-value">{vehicleData.owner}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Entry Time</span>
                    <span className="info-row-value">{vehicleData.entryTime}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Parking Area</span>
                    <span className="info-row-value">{vehicleData.parkingArea}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Slot Number</span>
                    <span className="info-row-value">{vehicleData.slotNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Duration</span>
                    <span className="info-row-value">{vehicleData.duration}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Parking Fee</span>
                    <span className="info-row-value" style={{ color: '#dc2626', fontWeight: 600 }}>
                      ₱{vehicleData.fee}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              <div className="info-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#065f46'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div>
                    <p className="info-box-title" style={{ marginBottom: '0.25rem' }}>Exit Recorded Successfully</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                      Vehicle exit has been logged
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>
                  Exit Summary
                </h3>
                <div style={{ background: '#fafafa', borderRadius: '0.5rem', padding: '1rem', border: '1px solid #f3f4f6' }}>
                  <div className="info-row">
                    <span className="info-row-label">Plate Number</span>
                    <span className="info-row-value">{vehicleData.plateNumber}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Entry Time</span>
                    <span className="info-row-value">{vehicleData.entryTime}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Exit Time</span>
                    <span className="info-row-value">{getCurrentTime()}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Total Duration</span>
                    <span className="info-row-value">{vehicleData.duration}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Parking Fee</span>
                    <span className="info-row-value" style={{ color: '#dc2626', fontWeight: 600 }}>
                      ₱{vehicleData.fee}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!vehicleData && !success ? (
            <>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSearch}
                disabled={!plateNumber.trim() || loading}
              >
                {loading ? 'Searching...' : 'Search Vehicle'}
              </button>
            </>
          ) : !success ? (
            <>
              <button className="btn btn-secondary" onClick={handleReset}>
                Back
              </button>
              <button className="btn btn-primary" onClick={handleRecordExit}>
                Record Exit
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={handleReset}>
                Record Another
              </button>
              <button className="btn btn-primary" onClick={onClose}>
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordExitModal;
