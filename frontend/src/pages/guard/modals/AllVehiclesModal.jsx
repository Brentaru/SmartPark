import React, { useState, useEffect } from 'react';

const AllVehiclesModal = ({ onClose }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVehicles([]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      vehicle.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="modal-overlay vehicle-modal" onClick={onClose}>
      <div className="modal-container vehicle-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '85vh' }}>
        <div className="modal-header">
          <h2 className="modal-title">All Vehicles</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <svg 
                style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none', zIndex: 1 }}
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className="form-input"
                placeholder="Search by plate, owner, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
            <div>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ minWidth: '150px' }}
              >
                <option value="all">All Status</option>
                <option value="parked">Parked</option>
                <option value="registered">Registered</option>
              </select>
            </div>
          </div>

          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#fafafa', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.025em', fontWeight: 500 }}>
                Total
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                {vehicles.length}
              </p>
            </div>
            <div style={{ background: '#fafafa', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.025em', fontWeight: 500 }}>
                Parked
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#059669', margin: 0 }}>
                {vehicles.filter(v => v.status === 'Parked').length}
              </p>
            </div>
            <div style={{ background: '#fafafa', borderRadius: '0.5rem', padding: '0.75rem', border: '1px solid #f3f4f6' }}>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.025em', fontWeight: 500 }}>
                Registered
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2563eb', margin: 0 }}>
                {vehicles.filter(v => v.status === 'Registered').length}
              </p>
            </div>
          </div>

          {/* Vehicles Table */}
          {loading ? (
            <div className="empty-state">
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Loading vehicles...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <p className="empty-state-title">No vehicles found</p>
              <p className="empty-state-description">
                {searchTerm ? 'Try adjusting your search or filters' : 'No vehicles registered yet'}
              </p>
            </div>
          ) : (
            <div className="table-scroll-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Plate Number</th>
                    <th>Owner</th>
                    <th>Vehicle</th>
                    <th>Location</th>
                    <th>Entry Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ 
                            width: '28px', 
                            height: '28px', 
                            borderRadius: '0.375rem', 
                            background: vehicle.vehicleType === 'Car' || vehicle.vehicleType === 'SUV' ? '#eff6ff' : '#fef3c7',
                            color: vehicle.vehicleType === 'Car' || vehicle.vehicleType === 'SUV' ? '#2563eb' : '#d97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              {vehicle.vehicleType === 'Motorcycle' ? (
                                <>
                                  <path d="M5 18h14"/>
                                  <path d="M19 18v-6a2 2 0 0 0-2-2h-3l-3-3H6a2 2 0 0 0-2 2v9"/>
                                  <circle cx="8" cy="18" r="2"/>
                                  <circle cx="16" cy="18" r="2"/>
                                </>
                              ) : (
                                <>
                                  <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                                  <circle cx="6.5" cy="16.5" r="2.5"/>
                                  <circle cx="16.5" cy="16.5" r="2.5"/>
                                </>
                              )}
                            </svg>
                          </div>
                          <span style={{ fontWeight: 600 }}>{vehicle.plateNumber}</span>
                        </div>
                      </td>
                      <td>{vehicle.owner}</td>
                      <td>
                        <div>
                          <p style={{ fontSize: '0.875rem', color: '#111827', margin: '0 0 0.125rem 0' }}>
                            {vehicle.model}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                            {vehicle.vehicleType} • {vehicle.color}
                          </p>
                        </div>
                      </td>
                      <td>
                        {vehicle.area ? (
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {vehicle.area} - {vehicle.slot}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>
                            Not parked
                          </span>
                        )}
                      </td>
                      <td>
                        {vehicle.entryTime ? (
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {vehicle.entryTime}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>—</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${
                          vehicle.status === 'Parked' ? 'status-badge-success' : 'status-badge-info'
                        }`}>
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                            <circle cx="4" cy="4" r="4"/>
                          </svg>
                          {vehicle.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllVehiclesModal;
