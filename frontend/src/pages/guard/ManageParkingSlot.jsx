import React, { useState, useEffect } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import ParkingMap from '../../components/dashboard/ParkingMap';
import { API_BASE_URL } from '../../api/config';
import '../../styles/guard/ManageParkingSlot.css';
import SlotStatusModal from './modals/SlotStatusModal';

const ManageParkingSlot = () => {
  const { isExpanded } = useSidebar();
  
  // State for parking slots from backend
  const [parkingSlots, setParkingSlots] = useState([]);
  const [parkingAreas, setParkingAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for reservations from backend
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  
  // State for slot modal
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSlotModal, setShowSlotModal] = useState(false);

  // Fetch parking areas, slots, and reservations from backend
  useEffect(() => {
    fetchParkingAreas();
    fetchParkingSlots();
    fetchReservations();
  }, []);

  const fetchParkingAreas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking-areas`);
      if (!response.ok) {
        throw new Error('Failed to fetch parking areas');
      }
      const data = await response.json();
      setParkingAreas(data);
      
      // Set first area as default (NGE Parking Area should be first)
      if (data.length > 0 && !selectedArea) {
        setSelectedArea(data[0].areaID);
      }
    } catch (err) {
      console.error('Error fetching parking areas:', err);
    }
  };

  const fetchParkingSlots = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/parking-slots`);
      if (!response.ok) {
        throw new Error('Failed to fetch parking slots');
      }
      const data = await response.json();
      
      console.log('📍 ManageParkingSlot - Fetched slots:', data);
      
      // Transform backend data to match component format
      const transformedSlots = data.map(slot => ({
        id: slot.slotID,
        location: slot.location,
        status: slot.status === 'Available' || slot.status === 'available' ? 'free' : 
                slot.status === 'Reserved' || slot.status === 'reserved' ? 'reserved' : 'occupied',
        type: slot.slotType || 'Standard',
        reservedBy: slot.reservedBy,
        reservedFor: slot.reservedFor,
        areaID: slot.areaID
      }));
      
      // Sort slots by location for consistent display
      const sortedSlots = transformedSlots.sort((a, b) => {
        if (!a.location || !b.location) {
          if (!a.location && !b.location) return 0;
          if (!a.location) return 1;
          if (!b.location) return -1;
        }
        const [letterA, numA] = a.location.split('-');
        const [letterB, numB] = b.location.split('-');
        if (letterA !== letterB) {
          return letterA.localeCompare(letterB);
        }
        return parseInt(numA) - parseInt(numB);
      });
      
      console.log('✅ ManageParkingSlot - Transformed & sorted slots:', sortedSlots);
      setParkingSlots(sortedSlots);
      setError(null);
    } catch (err) {
      console.error('Error fetching parking slots:', err);
      setError(err.message);
      setParkingSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      setReservationsLoading(true);
      // Fetch reserved slots
      const response = await fetch(`${API_BASE_URL}/parking-slots`);
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      
      console.log('📍 ManageParkingSlot - All slots for reservations:', data);
      
      // Filter only reserved slots and transform to reservation format
      const reservedSlots = data
        .filter(slot => slot.status === 'Reserved' || slot.status === 'reserved')
        .map((slot, index) => ({
          id: slot.slotID,
          staffName: slot.reservedBy || 'Unknown User',
          staffId: `ID-${slot.slotID}`,
          plateNumber: slot.vehiclePlateNumber || 'N/A',
          requestedSlot: slot.location,
          requestedDate: slot.reservedFor ? new Date(slot.reservedFor).toLocaleDateString() : 'Today',
          requestedTime: slot.reservedFor ? new Date(slot.reservedFor).toLocaleTimeString() : 'N/A',
          submittedAt: 'Recently'
        }));
      
      console.log('✅ ManageParkingSlot - Reserved slots:', reservedSlots);
      setReservations(reservedSlots);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setReservations([]);
    } finally {
      setReservationsLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowSlotModal(true);
  };

  const handleUpdateSlot = async (slotId, updates) => {
    try {
      // Map frontend status to backend status
      let backendStatus = updates.status;
      if (updates.status === 'free') backendStatus = 'Available';
      else if (updates.status === 'reserved') backendStatus = 'Reserved';
      else if (updates.status === 'occupied') backendStatus = 'Occupied';
      
      console.log(`🔄 Updating slot ${slotId} to status: ${backendStatus}`);
      console.log('📝 Updates received:', updates);
      
      // Special handling for guard manually marking slot as occupied with plate number
      if (backendStatus === 'Occupied' && updates.plateNumber) {
        console.log('🚗 Guard manual parking - checking if plate is registered:', updates.plateNumber);
        
        // Use the manual-park endpoint which checks registration and creates record if found
        const response = await fetch(`${API_BASE_URL}/parking-slots/${slotId}/manual-park`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plateNumber: updates.plateNumber })
        });

        if (!response.ok) {
          throw new Error('Failed to process manual parking');
        }

        const result = await response.json();
        console.log('✅ Manual parking result:', result);
        
        if (result.registered) {
          alert(`Slot occupied successfully!\n\nVehicle ${updates.plateNumber} is registered to user ${result.userID}.\nParking record has been created and will appear in their history.`);
        } else {
          alert(`Slot occupied successfully!\n\nVehicle ${updates.plateNumber} is not registered in the system.\nSlot is marked as occupied but no parking record was created.`);
        }
        
        // Refresh the parking slots and reservations
        await fetchParkingSlots();
        await fetchReservations();
        setShowSlotModal(false);
        return;
      }
      
      // Get the current slot to preserve other fields
      const slotResponse = await fetch(`${API_BASE_URL}/parking-slots/${slotId}`);
      if (!slotResponse.ok) {
        throw new Error('Failed to fetch slot details');
      }
      const currentSlot = await slotResponse.json();
      
      // Build the update payload
      const updatePayload = {
        location: currentSlot.location,
        status: backendStatus,
        slotType: currentSlot.slotType,
        areaID: currentSlot.areaID,
        // Clear reservation fields if status is being changed away from Reserved
        reservedBy: backendStatus === 'Available' ? null : currentSlot.reservedBy,
        reservedFor: backendStatus === 'Available' ? null : currentSlot.reservedFor
      };
      
      console.log('📝 Update payload:', updatePayload);
      
      // Update slot via PUT endpoint
      const response = await fetch(`${API_BASE_URL}/parking-slots/${slotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        throw new Error('Failed to update slot');
      }

      console.log('✅ Slot updated successfully');
      
      // Refresh the parking slots and reservations
      await fetchParkingSlots();
      await fetchReservations();
      setShowSlotModal(false);
    } catch (err) {
      console.error('Error updating slot:', err);
      alert('Failed to update slot status. Please try again.');
    }
  };

  const handleAcceptReservation = async (reservationId) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      try {
        console.log(`✅ Accepting reservation for slot ${reservationId}`);
        
        // Step 1: Get the full slot details from backend
        const slotResponse = await fetch(`${API_BASE_URL}/parking-slots/${reservationId}`);
        if (!slotResponse.ok) {
          throw new Error('Failed to fetch slot details');
        }
        const slotData = await slotResponse.json();
        console.log('📍 Slot data for reservation:', slotData);
        
        if (!slotData.reservedBy) {
          throw new Error('No user associated with this reservation');
        }
        
        // Step 2: Get the user's vehicle
        const vehiclesResponse = await fetch(`${API_BASE_URL}/vehicles/user/${slotData.reservedBy}`);
        if (!vehiclesResponse.ok) {
          throw new Error('Failed to fetch user vehicles');
        }
        const vehicles = await vehiclesResponse.json();
        console.log('🚗 User vehicles:', vehicles);
        
        if (!vehicles || vehicles.length === 0) {
          throw new Error('User has no registered vehicles');
        }
        
        // Use the first vehicle (or you could add logic to select the right one)
        const vehicleID = vehicles[0].vehicleID;
        
        // Step 3: Create a parking record for the staff member
        const now = new Date();
        const recordData = {
          vehicleID: vehicleID,
          slotID: reservationId,
          verifiedByUserId: slotData.reservedBy, // The staff member who made the reservation
          entryTime: now.toISOString(),
          exitTime: null
        };
        
        console.log('📝 Creating parking record:', recordData);
        
        // Skip notification since we'll send "Reservation Accepted" notification instead
        const recordResponse = await fetch(`${API_BASE_URL}/parking-records?skipNotification=true`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recordData)
        });

        if (!recordResponse.ok) {
          const errorText = await recordResponse.text();
          console.error('❌ Parking record creation failed:', errorText);
          throw new Error('Failed to create parking record: ' + errorText);
        }
        
        const createdRecord = await recordResponse.json();
        console.log('✅ Parking record created:', createdRecord);
        
        // Step 4: Accept reservation - Mark as Occupied and clear reservation fields
        const acceptResponse = await fetch(`${API_BASE_URL}/parking-slots/${reservationId}/accept-reservation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!acceptResponse.ok) {
          throw new Error('Failed to accept reservation');
        }

        console.log('✅ Reservation accepted - slot status updated to Occupied, reservation fields cleared');
        
        // Step 5: Refresh data
        await fetchParkingSlots();
        await fetchReservations();
        alert(`Reservation accepted for ${reservation.staffName}!\nParking slot ${reservation.requestedSlot} is now occupied.\nParking record created successfully.`);
      } catch (err) {
        console.error('❌ Error accepting reservation:', err);
        alert(`Failed to accept reservation: ${err.message}\nPlease try again.`);
      }
    }
  };

  const handleDeclineReservation = async (reservationId) => {
    try {
      console.log(`❌ Declining reservation for slot ${reservationId}`);
      
      // Use the new decline-reservation endpoint to clear reservation fields
      const response = await fetch(`${API_BASE_URL}/parking-slots/${reservationId}/decline-reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to decline reservation');
      }

      console.log('✅ Reservation declined - slot status updated to Available, reservation fields cleared');
      
      // Refresh data
      await fetchParkingSlots();
      await fetchReservations();
      alert('Reservation declined successfully. Slot is now available.');
    } catch (err) {
      console.error('Error declining reservation:', err);
      alert('Failed to decline reservation. Please try again.');
    }
  };

  // Filter slots by selected area for statistics only
  // Always show ALL slots in the ParkingMap
  const filteredSlots = parkingSlots; // Show all slots in the map
  
  console.log('🅿️ ManageParkingSlot - All slots for map:', filteredSlots);
  console.log('🅿️ ManageParkingSlot - Total slots count:', filteredSlots.length);
  
  // Get filtered slots for statistics if area is selected
  const filteredSlotsForStats = selectedArea 
    ? parkingSlots.filter(slot => slot.areaID === selectedArea)
    : parkingSlots;

  // Calculate statistics (based on filtered slots for stats)
  const stats = {
    total: filteredSlotsForStats.length,
    available: filteredSlotsForStats.filter(s => s.status === 'free').length,
    occupied: filteredSlotsForStats.filter(s => s.status === 'occupied').length,
    reserved: filteredSlotsForStats.filter(s => s.status === 'reserved').length
  };
  
  console.log('🅿️ ManageParkingSlot - Stats:', stats);

  return (
    <div className="dashboard-page manage-parking-container">
      <AuthTopbar pageTitle="Manage Parking Slot" />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
          <div className="dashboard-container">
            
            {/* Page Header */}
            <div className="page-header">
              <h1 className="page-title">Parking Slot Management</h1>
              <p className="page-subtitle">Monitor and manage parking slots, handle reservations from staff</p>
            </div>

            {/* Statistics */}
            <div className="parking-stats">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Slots</p>
                  <p className="stat-value">{stats.total}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Available</p>
                  <p className="stat-value">{stats.available}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Occupied</p>
                  <p className="stat-value">{stats.occupied}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Reserved</p>
                  <p className="stat-value">{stats.reserved}</p>
                </div>
              </div>
            </div>

            {/* Parking Map - Using Reusable Component */}
            <div className="parking-map-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <h2 className="section-title">Parking Map</h2>
                  <p className="section-subtitle">Click on any slot to view details and change its status</p>
                </div>
                
                {/* Area Dropdown inside parking map section */}
                {parkingAreas.length > 0 && (
                  <select 
                    value={selectedArea || ''}
                    onChange={(e) => setSelectedArea(parseInt(e.target.value))}
                    style={{
                      padding: '0.625rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      background: 'white',
                      color: '#111827',
                      cursor: 'pointer',
                      outline: 'none',
                      minWidth: '200px',
                      flexShrink: 0
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  >
                    {parkingAreas.map(area => (
                      <option key={area.areaID} value={area.areaID}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1rem', color: '#6b7280' }}>Loading parking slots...</div>
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                  <div style={{ fontSize: '1rem', color: '#dc2626', marginBottom: '0.5rem' }}>Error loading parking slots</div>
                  <div style={{ fontSize: '0.875rem', color: '#991b1b' }}>{error}</div>
                  <button 
                    onClick={fetchParkingSlots}
                    style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <ParkingMap 
                  slots={filteredSlots} 
                  onSlotClick={handleSlotClick}
                  guardMode={true}
                />
              )}
            </div>

            {/* Reservation Requests */}
            <div className="reservations-section">
              <div className="section-header">
                <h2 className="section-title">Parking Reservations</h2>
                <span className="badge-count">{reservations.length}</span>
              </div>
              
              {reservationsLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1rem', color: '#6b7280' }}>Loading reservations...</div>
                </div>
              ) : reservations.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="2" y="7" width="20" height="14" rx="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <p className="empty-state-title">No pending reservations</p>
                  <p className="empty-state-description">All reservation requests have been processed</p>
                </div>
              ) : (
                <div className="reservations-list">
                  {reservations.map(reservation => (
                    <div key={reservation.id} className="reservation-card">
                      <div className="reservation-header">
                        <div className="reservation-user">
                          <div className="user-avatar">
                            {reservation.staffName.charAt(0)}
                          </div>
                          <div>
                            <p className="user-name">{reservation.staffName}</p>
                            <p className="user-id">{reservation.staffId}</p>
                          </div>
                        </div>
                        <span className="time-ago">{reservation.submittedAt}</span>
                      </div>
                      
                      <div className="reservation-details">
                        <div className="detail-row">
                          <span className="detail-label">Plate Number:</span>
                          <span className="detail-value">{reservation.plateNumber}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Requested Slot:</span>
                          <span className="detail-value slot-highlight">{reservation.requestedSlot}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Date:</span>
                          <span className="detail-value">{reservation.requestedDate}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Time:</span>
                          <span className="detail-value">{reservation.requestedTime}</span>
                        </div>
                      </div>

                      <div className="reservation-actions">
                        <button 
                          className="btn btn-decline"
                          onClick={() => handleDeclineReservation(reservation.id)}
                        >
                          Decline
                        </button>
                        <button 
                          className="btn btn-accept"
                          onClick={() => handleAcceptReservation(reservation.id)}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Slot Status Modal */}
      {showSlotModal && selectedSlot && (
        <SlotStatusModal
          slot={selectedSlot}
          onClose={() => setShowSlotModal(false)}
          onUpdate={handleUpdateSlot}
        />
      )}
    </div>
  );
};

export default ManageParkingSlot;

