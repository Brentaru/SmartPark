import React, { useState } from 'react';

const SlotStatusModal = ({ slot, onClose, onUpdate }) => {
  const [status, setStatus] = useState(slot.status);
  const [plateNumber, setPlateNumber] = useState(slot.plateNumber || '');
  const [reservedBy, setReservedBy] = useState(slot.reservedBy || '');

  const handleSubmit = () => {
    console.log('🎯 SlotStatusModal handleSubmit called');
    console.log('📍 Slot ID:', slot.id);
    console.log('📊 New status:', status);
    const updates = {
      status,
      plateNumber: status === 'occupied' ? plateNumber.toUpperCase() : null,
      reservedBy: status === 'reserved' ? reservedBy : null
    };
    console.log('📝 Updates object:', updates);
    onUpdate(slot.id, updates);
  };

  return (
    <div className="modal-overlay slot-status-modal" onClick={onClose}>
      <div className="modal-container slot-status-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Update Slot Status - {slot.location || slot.id}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Current Status Display */}
          <div className="info-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Current Status:</span>
              <span className={`status-badge status-badge-${slot.status}`}>
                {slot.status === 'free' ? 'Available' : slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Status Selection */}
          <div className="form-group">
            <label className="form-label">Change Status</label>
            <div className="status-options">
              <label className={`status-option ${status === 'free' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value="free"
                  checked={status === 'free'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-icon" style={{ color: '#059669' }}>○</span>
                  <div>
                    <p className="option-title">Available</p>
                    <p className="option-desc">Mark slot as free</p>
                  </div>
                </div>
              </label>

              <label className={`status-option ${status === 'occupied' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value="occupied"
                  checked={status === 'occupied'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-icon" style={{ color: '#dc2626' }}>●</span>
                  <div>
                    <p className="option-title">Occupied</p>
                    <p className="option-desc">Vehicle is parked</p>
                  </div>
                </div>
              </label>

              <label className={`status-option ${status === 'reserved' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value="reserved"
                  checked={status === 'reserved'}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-icon" style={{ color: '#d97706' }}>◐</span>
                  <div>
                    <p className="option-title">Reserved</p>
                    <p className="option-desc">Slot is reserved</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Plate Number Input (only for occupied) */}
          {status === 'occupied' && (
            <div className="form-group">
              <label className="form-label">Plate Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., ABC 1234"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                autoFocus
              />
            </div>
          )}

          {/* Reserved By Input (only for reserved) */}
          {status === 'reserved' && (
            <div className="form-group">
              <label className="form-label">Reserved By *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Staff Name"
                value={reservedBy}
                onChange={(e) => setReservedBy(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={
              (status === 'occupied' && !plateNumber.trim()) ||
              (status === 'reserved' && !reservedBy.trim())
            }
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotStatusModal;

