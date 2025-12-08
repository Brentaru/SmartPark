import React, { useState } from 'react';

const RecordEntryModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    notes: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
    }, 500);
  };

  const handleReset = () => {
    setFormData({
      plateNumber: '',
      notes: ''
    });
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
          <h2 className="modal-title">Record Entry Time</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {!success ? (
            <form onSubmit={handleSubmit}>
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

              <div className="form-group">
                <label className="form-label">Plate Number *</label>
                <input
                  type="text"
                  name="plateNumber"
                  className="form-input"
                  placeholder="e.g., ABC 1234"
                  value={formData.plateNumber}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  name="notes"
                  className="form-input form-textarea"
                  placeholder="Add any additional notes..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </form>
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
                    <p className="info-box-title" style={{ marginBottom: '0.25rem' }}>Entry Recorded Successfully</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                      Vehicle entry has been logged
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '1rem' }}>
                  Entry Details
                </h3>
                <div style={{ background: '#fafafa', borderRadius: '0.5rem', padding: '1rem', border: '1px solid #f3f4f6' }}>
                  <div className="info-row">
                    <span className="info-row-label">Plate Number</span>
                    <span className="info-row-value">{formData.plateNumber.toUpperCase()}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Entry Time</span>
                    <span className="info-row-value">{getCurrentTime()}</span>
                  </div>
                  {formData.notes && (
                    <div className="info-row">
                      <span className="info-row-label">Notes</span>
                      <span className="info-row-value">{formData.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!success ? (
            <>
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit}
                disabled={!formData.plateNumber}
              >
                Record Entry
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

export default RecordEntryModal;
