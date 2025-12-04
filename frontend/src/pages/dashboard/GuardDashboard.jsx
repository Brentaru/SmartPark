import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import ParkingMap from '../../components/dashboard/ParkingMap';
import '../../styles/Dashboard.css';
import { parkingSlotAPI, parkingRecordAPI, vehicleAPI, userAPI } from '../../api/api';

const GuardDashboard = () => {
  const { currentUser } = useAuth();
  const [parkingSlots, setParkingSlots] = useState([]);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showParkingForm, setShowParkingForm] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  
  // Get local date in YYYY-MM-DD format
  const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [reservationFormData, setReservationFormData] = useState({
    plateNumber: '',
    date: getLocalDate(),
    timeIn: new Date().toTimeString().slice(0, 5),
    slotNumber: '',
    vehicleType: 'Car',
    vehicleColor: '',
    status: 'OCCUPIED'
  });
  const [loading, setLoading] = useState(true);
  
  // Form data for parking record
  const [parkingFormData, setParkingFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    timeIn: new Date().toTimeString().slice(0, 5),
    plateNumber: '',
    vehicleType: 'Car',
    vehicleColor: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    loadParkingData();
  }, []);

  const loadParkingData = async () => {
    try {
      setLoading(true);
      
      // Load all parking slots
      const slotsResult = await parkingSlotAPI.getAllSlots();
      console.log('🔍 Guard - API Response:', slotsResult);
      
      if (slotsResult.success && slotsResult.data && slotsResult.data.length > 0) {
        const transformedSlots = slotsResult.data.map(slot => ({
          id: slot.slotID,
          location: slot.location,
          status: slot.status === 'Available' ? 'free' : 
                  slot.status === 'Reserved' ? 'reserved' : 'occupied',
          type: slot.slotType,
          reservedBy: slot.reservedBy,
          reservedFor: slot.reservedFor
        }));
        setParkingSlots(transformedSlots);
        
        // Filter reserved slots for the list
        const reserved = transformedSlots.filter(slot => slot.status === 'reserved');
        setReservedSlots(reserved);
      } else {
        setParkingSlots([]);
        setReservedSlots([]);
      }
    } catch (error) {
      console.error('Error loading parking data:', error);
      setParkingSlots([]);
      setReservedSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    
    // Reset form data
    setParkingFormData({
      date: new Date().toISOString().split('T')[0],
      timeIn: new Date().toTimeString().slice(0, 5),
      plateNumber: '',
      vehicleType: 'Car',
      vehicleColor: '',
      status: 'ACTIVE'
    });
    
    setShowActionModal(true);
  };

  const handleMarkOccupied = () => {
    // Show parking form instead of directly marking
    setShowActionModal(false);
    setShowParkingForm(true);
  };

  const handleReserveSlot = () => {
    setShowActionModal(false);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;
    
    setReservationFormData({
      plateNumber: '',
      date: localDate,
      timeIn: new Date().toTimeString().slice(0, 5),
      slotNumber: selectedSlot.location,
      vehicleType: 'Car',
      vehicleColor: '',
      status: 'OCCUPIED'
    });
    setShowReservationModal(true);
  };

  const handleConfirmReservation = async () => {
    if (!reservationFormData.plateNumber.trim()) {
      alert('Please enter a plate number');
      return;
    }

    if (!reservationFormData.vehicleColor.trim()) {
      alert('Please enter the vehicle color');
      return;
    }

    try {
      const plateNumber = reservationFormData.plateNumber.toUpperCase().trim();
      
      // Step 1: Find user by plate number
      console.log('🔍 Looking up user by plate number:', plateNumber);
      const userResult = await userAPI.getUserByPlateNumber(plateNumber);
      
      if (!userResult.success || !userResult.data) {
        alert(`No user found with plate number "${plateNumber}". The student/staff must register their vehicle first.`);
        return;
      }

      const studentUser = userResult.data;
      console.log('✅ Found user:', studentUser);

      // Step 2: Check if vehicle exists, if not create it
      let vehicleResult = await vehicleAPI.getVehicleByPlate(plateNumber);
      
      if (!vehicleResult.success || !vehicleResult.data) {
        console.log('📝 Creating vehicle entry for:', plateNumber);
        const vehicleData = {
          plateNumber: plateNumber,
          type: reservationFormData.vehicleType,
          color: reservationFormData.vehicleColor.trim(),
          userID: studentUser.userID  // Fixed: Use userID directly, not nested user object
        };
        vehicleResult = await vehicleAPI.createVehicle(vehicleData);
        
        if (!vehicleResult.success) {
          alert('Failed to create vehicle record');
          return;
        }
      }

      console.log('✅ Vehicle ready:', vehicleResult.data);

      // Step 3: Create parking record with specified date and time (keep as local time)
      const entryDateTime = new Date(`${reservationFormData.date}T${reservationFormData.timeIn}:00`);
      
      // Format as local datetime string without timezone conversion
      const localDateTimeString = `${reservationFormData.date}T${reservationFormData.timeIn}:00`;
      
      const recordData = {
        entryTime: localDateTimeString,
        exitTime: null,
        vehicleID: vehicleResult.data.vehicleID,  // Fixed: Use vehicleID directly
        slotID: selectedSlot.id  // Fixed: Use slotID directly
      };

      console.log('📝 Creating parking record:', recordData);
      const recordResult = await parkingRecordAPI.createRecord(recordData);
      
      if (!recordResult.success) {
        alert('Failed to create parking record');
        return;
      }

      console.log('✅ Parking record created:', recordResult.data);

      // Step 4: Mark the slot as Occupied
      const slotResult = await parkingSlotAPI.updateSlot(selectedSlot.id, {
        location: selectedSlot.location,
        status: 'Occupied',
        slotType: selectedSlot.type || 'Standard',
        reservedBy: null,
        reservedFor: null
      });

      if (slotResult.success) {
        alert(`Slot ${selectedSlot.location} has been occupied by ${studentUser.fname} ${studentUser.lname}!\nPlate: ${plateNumber}\nStudent ID: ${studentUser.userID}\nDate: ${reservationFormData.date}\nTime: ${reservationFormData.timeIn}\nStatus: ${reservationFormData.status}`);
        setShowReservationModal(false);
        setSelectedSlot(null);
        await loadParkingData();
      } else {
        alert(`Failed to mark slot as occupied: ${slotResult.error}`);
      }
    } catch (error) {
      console.error('❌ Error reserving slot:', error);
      alert('An error occurred while reserving the slot. Please try again.');
    }
  };

  const handleSubmitParkingRecord = async (e) => {
    e.preventDefault();
    
    if (!selectedSlot || !parkingFormData.plateNumber) {
      alert('Please fill in the plate number');
      return;
    }

    try {
      console.log('🚗 Creating parking record:', parkingFormData);
      
      // Find the user by their registered plate number
      const userResult = await userAPI.getUserByPlateNumber(parkingFormData.plateNumber.toUpperCase().trim());
      
      if (!userResult.success || !userResult.data) {
        alert(`No user found with plate number "${parkingFormData.plateNumber}". The student/staff must register their vehicle in their profile first.`);
        return;
      }
      
      const studentUser = userResult.data;
      console.log('👤 Found user by plate number:', studentUser);
      
      // Combine date and time to create entry time
      const entryDateTime = new Date(`${parkingFormData.date}T${parkingFormData.timeIn}`);
      
      // Create or get the vehicle linked to this user
      const vehicleData = {
        plateNumber: parkingFormData.plateNumber.toUpperCase().trim(),
        type: parkingFormData.vehicleType,
        color: parkingFormData.vehicleColor || studentUser.vehicleColor || 'Unknown',
        userID: studentUser.userID  // Fixed: Use userID directly, not nested user object
      };

      console.log('🚙 Creating vehicle:', vehicleData);
      const vehicleResult = await vehicleAPI.createVehicle(vehicleData);
      
      if (!vehicleResult.success) {
        alert('Failed to create vehicle record');
        return;
      }

      // Create parking record
      const recordData = {
        entryTime: entryDateTime.toISOString(),
        exitTime: null,
        slotID: selectedSlot.id,  // Fixed: Use slotID directly
        vehicleID: vehicleResult.data.vehicleID,  // Fixed: Use vehicleID directly
        guardID: null,
        verifiedBy: currentUser.id
      };

      console.log('📝 Creating parking record:', recordData);
      const recordResult = await parkingRecordAPI.createRecord(recordData);
      
      if (!recordResult.success) {
        alert('Failed to create parking record');
        return;
      }

      // Update slot status to Occupied
      const slotResult = await parkingSlotAPI.updateSlot(selectedSlot.id, {
        location: selectedSlot.location,
        status: 'Occupied',
        slotType: selectedSlot.type || 'Standard',
        reservedBy: null,
        reservedFor: null
      });

      if (slotResult.success) {
        alert(`Parking record created for ${studentUser.fname} ${studentUser.lname}!\nStudent ID: ${studentUser.studentId}\nSlot: ${selectedSlot.location}\nPlate: ${parkingFormData.plateNumber}\nTime: ${parkingFormData.timeIn}`);
        setShowParkingForm(false);
        setSelectedSlot(null);
        await loadParkingData();
      } else {
        alert('Failed to update slot status: ' + (slotResult.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error creating parking record:', error);
      alert('Error creating parking record. Please try again.');
    }
  };

  const handleMarkAvailable = async () => {
    if (!selectedSlot) return;

    try {
      console.log('🔧 Marking slot as available:', selectedSlot);
      
      // Update slot status to Available
      const result = await parkingSlotAPI.updateSlot(selectedSlot.id, {
        location: selectedSlot.location,
        status: 'Available',
        slotType: selectedSlot.type || 'Standard',
        reservedBy: null,
        reservedFor: null
      });

      console.log('✅ Update result:', result);

      if (result.success) {
        alert(`Slot ${selectedSlot.location} marked as available successfully!`);
        setShowActionModal(false);
        setSelectedSlot(null);
        await loadParkingData(); // Reload to update UI
      } else {
        alert('Failed to mark slot as available: ' + (result.message || 'Unknown error'));
        console.error('❌ Update failed:', result);
      }
    } catch (error) {
      console.error('❌ Error marking slot as available:', error);
      alert('Error marking slot as available. Please try again.');
    }
  };

  const handleAcceptReservation = async () => {
    if (!selectedSlot) return;

    try {
      console.log('✅ Accepting reservation for slot:', selectedSlot);
      
      // Step 1: Get the user who made the reservation
      const reservedByUserId = selectedSlot.reservedBy;
      if (!reservedByUserId) {
        alert('Error: No user found for this reservation.');
        return;
      }

      // Step 2: Get user details and their vehicle
      const userResult = await userAPI.getUserById(reservedByUserId);
      if (!userResult.success || !userResult.data) {
        alert('Error: Could not find user who made the reservation.');
        return;
      }

      const staffUser = userResult.data;
      console.log('👤 Staff user who made reservation:', staffUser);

      // Step 3: Get or create vehicle for this user
      let vehicleResult;
      if (staffUser.plateNumber) {
        vehicleResult = await vehicleAPI.getVehicleByPlate(staffUser.plateNumber);
        if (!vehicleResult.success || !vehicleResult.data) {
          // Create vehicle if not exists
          const vehicleData = {
            plateNumber: staffUser.plateNumber,
            type: staffUser.vehicleType || 'Car',
            color: staffUser.vehicleColor || 'Unknown',
            userID: staffUser.userID  // Fixed: Use userID directly
          };
          vehicleResult = await vehicleAPI.createVehicle(vehicleData);
        }
      } else {
        alert('Error: Staff member has no vehicle registered. Please ask them to update their profile.');
        return;
      }

      if (!vehicleResult.success || !vehicleResult.data) {
        alert('Error: Could not get vehicle information.');
        return;
      }

      console.log('🚙 Vehicle for parking record:', vehicleResult.data);

      // Step 4: Create parking record with current local time
      const now = new Date();
      const localDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      const localTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      const localDateTimeString = `${localDate}T${localTime}`;
      
      const recordData = {
        entryTime: localDateTimeString,
        vehicleID: vehicleResult.data.vehicleID,  // Fixed: Use vehicleID directly
        slotID: selectedSlot.id  // Fixed: Use slotID directly
      };

      console.log('📝 Creating parking record:', recordData);
      const recordResult = await parkingRecordAPI.createRecord(recordData);
      
      if (!recordResult.success) {
        alert('Error: Could not create parking record.');
        return;
      }

      console.log('✅ Parking record created:', recordResult.data);

      // Step 5: Update slot status to Occupied and clear reservation fields
      const slotResult = await parkingSlotAPI.updateSlot(selectedSlot.id, {
        location: selectedSlot.location,
        status: 'Occupied',
        slotType: selectedSlot.type || 'Standard',
        reservedBy: null,
        reservedFor: null
      });

      if (slotResult.success) {
        alert(`Reservation accepted! Slot ${selectedSlot.location} is now occupied by ${staffUser.fname} ${staffUser.lname}.`);
        setShowActionModal(false);
        setSelectedSlot(null);
        await loadParkingData();
      } else {
        alert('Failed to update slot status: ' + (slotResult.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error accepting reservation:', error);
      alert('Error accepting reservation. Please try again.');
    }
  };

  const handleDeclineReservation = async () => {
    if (!selectedSlot) return;

    try {
      console.log('❌ Declining reservation for slot:', selectedSlot);
      
      // Update slot status to Available (declining the reservation)
      const result = await parkingSlotAPI.updateSlot(selectedSlot.id, {
        location: selectedSlot.location,
        status: 'Available',
        slotType: selectedSlot.type || 'Standard',
        reservedBy: null,
        reservedFor: null
      });

      if (result.success) {
        alert(`Reservation declined. Slot ${selectedSlot.location} is now available.`);
        setShowActionModal(false);
        setSelectedSlot(null);
        await loadParkingData();
      } else {
        alert('Failed to decline reservation: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error declining reservation:', error);
      alert('Error declining reservation. Please try again.');
    }
  };

  const dashboardData = {
    stats: {
      totalSlots: parkingSlots.length,
      availableSlots: parkingSlots.filter(s => s.status === 'free').length,
      occupiedSlots: parkingSlots.filter(s => s.status === 'occupied').length,
      reservedSlots: parkingSlots.filter(s => s.status === 'reserved').length
    },
    parkingSlots: parkingSlots
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard-content">
          <AuthTopbar user={currentUser} />
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Loading parking data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <AuthTopbar user={currentUser} />
        
        <div className="dashboard-main">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Guard Dashboard</h1>
              <p className="dashboard-subtitle">
                Monitor and manage parking slots
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e0f2fe' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18"/>
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Total Slots</p>
                <p className="stat-value">{dashboardData.stats.totalSlots}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#d1fae5' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Available</p>
                <p className="stat-value">{dashboardData.stats.availableSlots}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fee2e2' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Occupied</p>
                <p className="stat-value">{dashboardData.stats.occupiedSlots}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef3c7' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="stat-content">
                <p className="stat-label">Reserved</p>
                <p className="stat-value">{dashboardData.stats.reservedSlots}</p>
              </div>
            </div>
          </div>

          {/* Reserved Slots List */}
          {reservedSlots.length > 0 && (
            <div style={{ marginTop: '2rem', background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                Current Reservations ({reservedSlots.length})
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {reservedSlots.map(slot => (
                  <div 
                    key={slot.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: '#fef3c7',
                      borderRadius: '6px',
                      border: '1px solid #fbbf24'
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: '600', color: '#92400e' }}>Slot {slot.location}</p>
                      <p style={{ fontSize: '0.875rem', color: '#78350f' }}>Reserved for: {slot.reservedFor || 'N/A'}</p>
                    </div>
                    <button
                      onClick={() => handleSlotClick(slot)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parking Map */}
          <div style={{ marginTop: '2rem' }}>
            <ParkingMap 
              slots={dashboardData.parkingSlots}
              onSlotClick={handleSlotClick}
              guardMode={true}
            />
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && selectedSlot && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowActionModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowActionModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                color: '#6b7280',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              ×
            </button>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827', paddingRight: '2rem' }}>
              Manage Slot {selectedSlot.location}
            </h3>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                Current Status: <strong style={{ color: '#111827' }}>{selectedSlot.status}</strong>
              </p>
              {selectedSlot.reservedFor && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Reserved for: <strong style={{ color: '#111827' }}>{selectedSlot.reservedFor}</strong>
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
              {selectedSlot.status === 'free' && (
                <button
                  onClick={handleReserveSlot}
                  style={{
                    padding: '0.75rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  Occupy for Student
                </button>
              )}

              {selectedSlot.status === 'reserved' && (
                <>
                  <button
                    onClick={handleAcceptReservation}
                    style={{
                      padding: '0.75rem',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    Accept Reservation
                  </button>
                  <button
                    onClick={handleDeclineReservation}
                    style={{
                      padding: '0.75rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    Decline Reservation
                  </button>
                </>
              )}

              {selectedSlot.status === 'occupied' && (
                <button
                  onClick={handleMarkAvailable}
                  style={{
                    padding: '0.75rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  Mark as Available
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Parking Form Modal */}
      {showParkingForm && selectedSlot && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflowY: 'auto'
          }}
          onClick={() => setShowParkingForm(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
              Create Parking Record
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              Slot: <strong>{selectedSlot.location}</strong>
            </p>
            
            <form onSubmit={handleSubmitParkingRecord}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Plate Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Plate Number *
                  </label>
                  <input
                    type="text"
                    value={parkingFormData.plateNumber}
                    onChange={(e) => setParkingFormData({ ...parkingFormData, plateNumber: e.target.value })}
                    placeholder="ABC-1234"
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                  <small style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block', marginTop: '0.25rem' }}>
                    The system will automatically identify the student/staff by their registered plate number
                  </small>
                </div>

                {/* Date */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={parkingFormData.date}
                    onChange={(e) => setParkingFormData({ ...parkingFormData, date: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                {/* Time In */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Time In *
                  </label>
                  <input
                    type="time"
                    value={parkingFormData.timeIn}
                    onChange={(e) => setParkingFormData({ ...parkingFormData, timeIn: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                {/* Vehicle Type */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Vehicle Type *
                  </label>
                  <select
                    value={parkingFormData.vehicleType}
                    onChange={(e) => setParkingFormData({ ...parkingFormData, vehicleType: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                  </select>
                </div>

                {/* Vehicle Color */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Vehicle Color
                  </label>
                  <input
                    type="text"
                    value={parkingFormData.vehicleColor}
                    onChange={(e) => setParkingFormData({ ...parkingFormData, vehicleColor: e.target.value })}
                    placeholder="Red, Blue, Black, etc."
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                {/* Status */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Status
                  </label>
                  <input
                    type="text"
                    value={parkingFormData.status}
                    readOnly
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      background: '#f9fafb',
                      color: '#6b7280'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  Submit & Mark Occupied
                </button>
                <button
                  type="button"
                  onClick={() => setShowParkingForm(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationModal && selectedSlot && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowReservationModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowReservationModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                color: '#6b7280',
                cursor: 'pointer',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.background = 'transparent'}
            >
              ×
            </button>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#111827', paddingRight: '2rem' }}>
              Occupy Slot {selectedSlot.location}
            </h3>
            
            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Plate Number */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Plate Number
                </label>
                <input
                  type="text"
                  value={reservationFormData.plateNumber}
                  onChange={(e) => setReservationFormData({ ...reservationFormData, plateNumber: e.target.value.toUpperCase() })}
                  placeholder="Enter plate number (e.g., ABC-123)"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              {/* Vehicle Type and Color */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Vehicle Type
                  </label>
                  <select
                    value={reservationFormData.vehicleType}
                    onChange={(e) => setReservationFormData({ ...reservationFormData, vehicleType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'white'
                    }}
                  >
                    <option value="Car">Car</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Vehicle Color
                  </label>
                  <input
                    type="text"
                    value={reservationFormData.vehicleColor}
                    onChange={(e) => setReservationFormData({ ...reservationFormData, vehicleColor: e.target.value })}
                    placeholder="e.g., Red, Blue, Black"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={reservationFormData.date}
                    onChange={(e) => setReservationFormData({ ...reservationFormData, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Time In
                  </label>
                  <input
                    type="time"
                    value={reservationFormData.timeIn}
                    onChange={(e) => setReservationFormData({ ...reservationFormData, timeIn: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Slot Number */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Slot #
                </label>
                <input
                  type="text"
                  value={reservationFormData.slotNumber}
                  readOnly
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: '#f9fafb',
                    color: '#6b7280'
                  }}
                />
              </div>

              {/* Status */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Status
                </label>
                <input
                  type="text"
                  value={reservationFormData.status}
                  readOnly
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: '#f9fafb',
                    color: '#6b7280'
                  }}
                />
              </div>
            </div>

            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                <strong>Location:</strong> {selectedSlot.location}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                <strong>Type:</strong> {selectedSlot.type || 'Standard'}
              </p>
            </div>

            <button
              onClick={handleConfirmReservation}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Confirm & Occupy Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuardDashboard;
