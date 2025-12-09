import React, { useState } from 'react';

const VerifyVehicleModal = ({ onClose }) => {
  const [plateNumber, setPlateNumber] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!plateNumber.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock verification result
      setVerificationResult({
        isValid: true,
        vehicle: {
          plateNumber: plateNumber.toUpperCase(),
          owner: 'John Doe',
          vehicleType: 'Car',
          model: 'Toyota Camry 2020',
          color: 'Silver',
          status: 'Active',
          permitExpiry: '2024-12-31'
        }
      });
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setPlateNumber('');
    setVerificationResult(null);
  };

  return (
    <div className="modal-overlay vehicle-modal" onClick={onClose}>
      <div className="modal-container vehicle-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Verify Vehicle</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {!verificationResult ? (
            <>
              <div className="info-box">
                <p className="info-box-content">
                  Enter the vehicle's plate number to verify registration and parking permissions.
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
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                  autoFocus
                />
              </div>
            </>
          ) : (
            <>
              <div className="info-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  {verificationResult.isValid ? (
                    <>
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
                        <p className="info-box-title" style={{ marginBottom: '0.25rem' }}>Vehicle Verified</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                          This vehicle is authorized for parking
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%', 
                        background: '#fecaca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#991b1b'
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                      </div>
                      <div>
                        <p className="info-box-title" style={{ marginBottom: '0.25rem' }}>Vehicle Not Found</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                          This vehicle is not registered
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {verificationResult.isValid && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>
                    Vehicle Details
                  </h3>
                  <div style={{ background: '#fafafa', borderRadius: '0.5rem', padding: '1rem', border: '1px solid #f3f4f6' }}>
                    <div className="info-row">
                      <span className="info-row-label">Plate Number</span>
                      <span className="info-row-value">{verificationResult.vehicle.plateNumber}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-row-label">Owner</span>
                      <span className="info-row-value">{verificationResult.vehicle.owner}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-row-label">Vehicle Type</span>
                      <span className="info-row-value">{verificationResult.vehicle.vehicleType}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-row-label">Model</span>
                      <span className="info-row-value">{verificationResult.vehicle.model}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-row-label">Color</span>
                      <span className="info-row-value">{verificationResult.vehicle.color}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-row-label">Status</span>
                      <span className="status-badge status-badge-success">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                          <circle cx="4" cy="4" r="4"/>
                        </svg>
                        {verificationResult.vehicle.status}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-row-label">Permit Expiry</span>
                      <span className="info-row-value">{verificationResult.vehicle.permitExpiry}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          {!verificationResult ? (
            <>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleVerify}
                disabled={!plateNumber.trim() || loading}
              >
                {loading ? 'Verifying...' : 'Verify Vehicle'}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={handleReset}>
                Verify Another
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

export default VerifyVehicleModal;
