import React, { useState } from 'react';

const VerifyAccessModal = ({ onClose }) => {
  const [userId, setUserId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!userId.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock verification result
      setVerificationResult({
        hasAccess: true,
        user: {
          id: userId,
          name: 'John Doe',
          role: 'Student',
          department: 'Computer Science',
          email: 'john.doe@example.com',
          status: 'Active',
          registeredVehicles: [
            { plateNumber: 'ABC 1234', type: 'Car', model: 'Toyota Camry 2020' },
            { plateNumber: 'XYZ 5678', type: 'Motorcycle', model: 'Honda Click 2021' }
          ],
          permitExpiry: '2024-12-31',
          currentParking: {
            hasActiveParking: true,
            plateNumber: 'ABC 1234',
            area: 'Area A',
            slot: 'A-101',
            entryTime: 'Jan 15, 2024, 08:30 AM'
          }
        }
      });
      setLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setUserId('');
    setVerificationResult(null);
  };

  return (
    <div className="modal-overlay vehicle-modal" onClick={onClose}>
      <div className="modal-container vehicle-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Verify User Access</h2>
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
                  Enter the user's ID number or email to verify their parking access permissions and registered vehicles.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">User ID / Email *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 2021-00123 or email@example.com"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                  autoFocus
                />
              </div>
            </>
          ) : (
            <>
              <div className="info-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  {verificationResult.hasAccess ? (
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
                        <p className="info-box-title" style={{ marginBottom: '0.25rem' }}>Access Granted</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                          This user has valid parking permissions
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
                        <p className="info-box-title" style={{ marginBottom: '0.25rem' }}>Access Denied</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                          This user does not have parking permissions
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {verificationResult.hasAccess && (
                <>
                  {/* User Details */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>
                      User Information
                    </h3>
                    <div style={{ background: '#fafafa', borderRadius: '0.5rem', padding: '1rem', border: '1px solid #f3f4f6' }}>
                      <div className="info-row">
                        <span className="info-row-label">User ID</span>
                        <span className="info-row-value">{verificationResult.user.id}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-row-label">Name</span>
                        <span className="info-row-value">{verificationResult.user.name}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-row-label">Role</span>
                        <span className="info-row-value">{verificationResult.user.role}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-row-label">Department</span>
                        <span className="info-row-value">{verificationResult.user.department}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-row-label">Email</span>
                        <span className="info-row-value">{verificationResult.user.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-row-label">Status</span>
                        <span className="status-badge status-badge-success">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                            <circle cx="4" cy="4" r="4"/>
                          </svg>
                          {verificationResult.user.status}
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-row-label">Permit Expiry</span>
                        <span className="info-row-value">{verificationResult.user.permitExpiry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Registered Vehicles */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>
                      Registered Vehicles ({verificationResult.user.registeredVehicles.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {verificationResult.user.registeredVehicles.map((vehicle, index) => (
                        <div 
                          key={index}
                          style={{ 
                            background: '#fafafa', 
                            borderRadius: '0.5rem', 
                            padding: '0.875rem', 
                            border: '1px solid #f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                        >
                          <div style={{ 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '0.375rem', 
                            background: vehicle.type === 'Car' ? '#eff6ff' : '#fef3c7',
                            color: vehicle.type === 'Car' ? '#2563eb' : '#d97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              {vehicle.type === 'Car' ? (
                                <>
                                  <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                                  <circle cx="6.5" cy="16.5" r="2.5"/>
                                  <circle cx="16.5" cy="16.5" r="2.5"/>
                                </>
                              ) : (
                                <>
                                  <path d="M5 18h14"/>
                                  <path d="M19 18v-6a2 2 0 0 0-2-2h-3l-3-3H6a2 2 0 0 0-2 2v9"/>
                                  <circle cx="8" cy="18" r="2"/>
                                  <circle cx="16" cy="18" r="2"/>
                                </>
                              )}
                            </svg>
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827', margin: '0 0 0.125rem 0' }}>
                              {vehicle.plateNumber}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                              {vehicle.type} • {vehicle.model}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Parking Status */}
                  {verificationResult.user.currentParking.hasActiveParking && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>
                        Current Parking Status
                      </h3>
                      <div style={{ 
                        background: '#fef3c7', 
                        borderRadius: '0.5rem', 
                        padding: '1rem', 
                        border: '1px solid #fde68a' 
                      }}>
                        <div className="info-row">
                          <span className="info-row-label">Plate Number</span>
                          <span className="info-row-value">{verificationResult.user.currentParking.plateNumber}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-row-label">Location</span>
                          <span className="info-row-value">
                            {verificationResult.user.currentParking.area} - Slot {verificationResult.user.currentParking.slot}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-row-label">Entry Time</span>
                          <span className="info-row-value">{verificationResult.user.currentParking.entryTime}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
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
                disabled={!userId.trim() || loading}
              >
                {loading ? 'Verifying...' : 'Verify Access'}
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

export default VerifyAccessModal;
