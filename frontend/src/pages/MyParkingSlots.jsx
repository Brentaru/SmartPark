import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import ParkingMap from '../components/dashboard/ParkingMap';
import NotificationModal from '../components/NotificationModal';
import { parkingSlotAPI } from '../api/api';
import { mockDashboardData } from '../data/mockData';
import '../styles/MyParkingSlots.css';

const MyParkingSlots = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { isExpanded } = useSidebar();
  const navigate = useNavigate();
  
  const [selectedParkingArea, setSelectedParkingArea] = useState(mockDashboardData.parkingAreas[0]);
  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: 'info', title: '', message: '' });
  
  const parkingAreas = mockDashboardData.parkingAreas;

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      loadParkingSlots();
    }
  }, [isAuthenticated, navigate]);

  const loadParkingSlots = async () => {
    try {
      setLoading(true);
      const result = await parkingSlotAPI.getAllSlots();
      
      if (result.success && result.data && result.data.length > 0) {
        const transformedSlots = result.data.map(slot => ({
          id: slot.slotID,
          location: slot.location,
          status: slot.status === 'Available' ? 'free' : 
                  slot.status === 'Reserved' ? 'reserved' : 'occupied',
          type: slot.slotType,
          reservedBy: slot.reservedBy,
          reservedFor: slot.reservedFor
        }));
        
        // Sort slots by location to ensure consistent order (A-01, A-02, ..., B-01, B-02, ...)
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
        
        setParkingSlots(sortedSlots);
      } else {
        setParkingSlots([]);
      }
    } catch (error) {
      console.error('Error loading parking slots:', error);
      setParkingSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotClick = (slot) => {
    console.log('Current user role:', currentUser.role);
    console.log('Clicked slot:', slot);
    
    // Only staff can make reservations (case-insensitive check)
    if (currentUser.role?.toLowerCase() !== 'staff') {
      if (slot.status === 'reserved' && slot.reservedBy === currentUser.id) {
        // Students can view their own reservations
        setNotification({
          show: true,
          type: 'info',
          title: 'Your Reserved Slot',
          message: `This is your reserved parking slot: ${slot.location}.`
        });
      } else if (slot.status === 'free') {
        setNotification({
          show: true,
          type: 'error',
          title: 'Access Restricted',
          message: 'Only staff members are authorized to make parking reservations. Students may view parking availability but cannot reserve slots.'
        });
      } else if (slot.status === 'reserved') {
        setNotification({
          show: true,
          type: 'warning',
          title: 'Slot Reserved',
          message: `This parking slot is already reserved by another user.`
        });
      } else {
        setNotification({
          show: true,
          type: 'info',
          title: 'Slot Occupied',
          message: `Parking slot ${slot.location} is currently occupied.`
        });
      }
      return;
    }

    // Staff reservation functionality
    if (slot.status === 'free') {
      setSelectedSlot(slot);
      setShowReservationModal(true);
    } else if (slot.status === 'reserved') {
      if (slot.reservedBy === currentUser.id) {
        if (window.confirm(`Do you want to cancel your reservation for slot ${slot.location}?`)) {
          handleCancelReservation(slot.id);
        }
      } else {
        alert(`This slot is already reserved by another user.`);
      }
    } else {
      alert(`Slot ${slot.location} is currently occupied.`);
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedSlot) return;

    try {
      const reservedFor = `${currentUser.firstName || 'Staff'} ${currentUser.lastName || 'User'}`;
      
      console.log('Attempting to reserve slot:', selectedSlot.id, 'for user:', currentUser.id);
      const result = await parkingSlotAPI.reserveSlot(selectedSlot.id, currentUser.id, reservedFor);

      if (result.success) {
        // Update the slot in state immediately to prevent re-sorting issues
        setParkingSlots(prevSlots => 
          prevSlots.map(slot => 
            slot.id === selectedSlot.id 
              ? { 
                  ...slot, 
                  status: 'reserved', 
                  reservedBy: currentUser.id, 
                  reservedFor: reservedFor,
                  location: selectedSlot.location // Ensure location is preserved
                }
              : slot
          )
        );
        
        alert(`Successfully reserved slot ${selectedSlot.location}!`);
        setShowReservationModal(false);
        setSelectedSlot(null);
        
        // Reload in background to sync with server
        setTimeout(() => loadParkingSlots(), 1000);
      } else {
        alert(`Failed to reserve slot: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error reserving slot:', error);
      alert('An error occurred while reserving the slot. Please try again.');
    }
  };

  const handleCancelReservation = async (slotId) => {
    try {
      // Find the slot to preserve its location
      const slotToCancel = parkingSlots.find(s => s.id === slotId);
      
      const result = await parkingSlotAPI.updateSlot(slotId, {
        slotID: slotId,
        location: slotToCancel?.location, // Preserve location
        slotType: slotToCancel?.type,
        status: 'Available',
        reservedBy: null,
        reservedFor: null
      });

      if (result.success) {
        alert(`Reservation cancelled successfully!`);
        loadParkingSlots(); // Reload to show updated status
      } else {
        alert(`Failed to cancel reservation: ${result.error}`);
      }
    } catch (error) {
      console.error('Error canceling reservation:', error);
      alert('An error occurred while canceling the reservation.');
    }
  };

  const activeSlotCount = parkingSlots.filter(s => s.status === 'free').length;

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle="Parking Slots" />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
          <div className="dashboard-container">
            
            {/* Page Header */}
            <div className="parking-slots-header">
              <h1 className="parking-slots-title">Parking Slots</h1>
              <p className="parking-slots-subtitle">Click on available slots to reserve them</p>
            </div>

            {/* Stats and Controls */}
            <div className="parking-controls">
              <div className="active-slots-counter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="10" rx="2"/>
                  <circle cx="12" cy="16" r="2"/>
                  <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
                <div>
                  <span className="counter-label">Available Slots</span>
                  <span className="counter-value">{activeSlotCount} / {parkingSlots.length}</span>
                </div>
              </div>

              <div className="parking-area-dropdown-container">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div className="dropdown-wrapper">
                  <label htmlFor="parkingArea">Parking Area</label>
                  <select 
                    id="parkingArea"
                    value={selectedParkingArea}
                    onChange={(e) => setSelectedParkingArea(e.target.value)}
                  >
                    {parkingAreas.map((area, index) => (
                      <option key={index} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Parking Map */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading parking slots...</p>
              </div>
            ) : (
              <ParkingMap 
                slots={parkingSlots} 
                onSlotClick={handleSlotClick}
                canReserve={true}
              />
            )}

          </div>
        </main>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="modal-overlay" onClick={() => setShowReservationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reserve Slot {selectedSlot?.location}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowReservationModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '1.1rem', marginBottom: '20px', textAlign: 'center' }}>
                Do you want to proceed on reserving this spot?
              </p>
              <div className="slot-details">
                <p><strong>Location:</strong> {selectedSlot?.location}</p>
                <p><strong>Area:</strong> {selectedParkingArea}</p>
                <p><strong>Type:</strong> {selectedSlot?.type || 'Standard'}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowReservationModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-proceed"
                onClick={handleConfirmReservation}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationModal
        show={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </div>
  );
};

export default MyParkingSlots;
