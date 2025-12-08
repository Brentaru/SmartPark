import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/dashboard/StatsCard';
import ActivityTable from '../../components/dashboard/ActivityTable';
import ParkingMap from '../../components/dashboard/ParkingMap';
import ReservationPanel from '../../components/dashboard/ReservationPanel';
import { parkingSlotAPI, parkingRecordAPI } from '../../api/api';
import { mockDashboardData } from '../../data/mockData';
import '../../styles/dashboard/StaffDashboard.css';

const StaffDashboard = ({ currentUser }) => {
  // Icons for stats cards
  const icons = {
    parking: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2"/>
        <circle cx="12" cy="16" r="2"/>
        <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    location: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    reserved: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  };

  const [selectedParkingArea, setSelectedParkingArea] = useState(mockDashboardData.parkingAreas[0]);
  const [myReservations, setMyReservations] = useState([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [parkingSlots, setParkingSlots] = useState([]);
  const [parkingActivity, setParkingActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const parkingAreas = mockDashboardData.parkingAreas;

  // Load parking slots, reservations, and activity on mount
  useEffect(() => {
    loadParkingData();
    loadParkingActivity();
  }, [currentUser.id]);

  const loadParkingData = async () => {
    try {
      setLoading(true);
      
      // Load all parking slots
      const slotsResult = await parkingSlotAPI.getAllSlots();
      console.log('🔍 API Response:', slotsResult);
      console.log('🔍 Raw data from backend:', slotsResult.data);
      console.log('🔍 Data length:', slotsResult.data?.length);
      
      if (slotsResult.success && slotsResult.data && slotsResult.data.length > 0) {
        // Transform backend data to match frontend format
        const transformedSlots = slotsResult.data.map(slot => ({
          id: slot.slotID,  // This is numeric from backend
          location: slot.location,
          status: slot.status === 'Available' ? 'free' : 
                  slot.status === 'Reserved' ? 'reserved' : 'occupied',
          type: slot.slotType,
          reservedBy: slot.reservedBy,
          reservedFor: slot.reservedFor
        }));
        console.log('✅ Transformed slots:', transformedSlots);
        console.log('✅ Number of slots to display:', transformedSlots.length);
        setParkingSlots(transformedSlots);
      } else {
        // If no slots from backend, use empty array (don't fall back to mock)
        console.warn('No parking slots found in database. Please add slots via admin panel.');
        setParkingSlots([]);
      }
      
      // Load user's reservations
      const reservationsResult = await parkingSlotAPI.getSlotsByReservedBy(currentUser.id);
      if (reservationsResult.success) {
        const transformedReservations = reservationsResult.data.map(slot => ({
          id: slot.slotID,
          location: slot.location,
          reservedFor: slot.reservedFor,
          reservedBy: slot.reservedBy
        }));
        setMyReservations(transformedReservations);
      }
    } catch (error) {
      console.error('Error loading parking data:', error);
      // On error, set empty array instead of using mock data
      setParkingSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const loadParkingActivity = async () => {
    try {
      // Load parking records for current user (staff member)
      const recordsResult = await parkingRecordAPI.getRecordsByUser(currentUser.id);
      console.log('📊 Staff parking records for user', currentUser.id, ':', recordsResult);
      
      if (recordsResult.success && recordsResult.data) {
        // Transform records to match ActivityTable format
        const transformedActivity = recordsResult.data.map(record => {
          const entryTime = new Date(record.entryTime);
          const exitTime = record.exitTime ? new Date(record.exitTime) : null;
          
          // Determine status
          let status = 'ACTIVE';
          if (exitTime) {
            status = 'COMPLETED';
          } else if (entryTime < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
            status = 'EXPIRED';
          }
          
          return {
            date: entryTime.toISOString().split('T')[0],
            timeIn: entryTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
            slot: record.slotLocation || 'N/A',
            status: status
          };
        })
        .filter(activity => activity.status !== 'EXPIRED') // Filter out expired records
        .sort((a, b) => new Date(b.date + ' ' + b.timeIn) - new Date(a.date + ' ' + a.timeIn))
        .slice(0, 10); // Latest 10 active records
        
        console.log('✅ Transformed staff activity:', transformedActivity);
        setParkingActivity(transformedActivity);
      } else {
        console.warn('⚠️ No parking records found for staff member');
        setParkingActivity([]);
      }
    } catch (error) {
      console.error('Error loading parking activity:', error);
      setParkingActivity([]);
    }
  };

  // Dashboard data
  const dashboardData = {
    stats: {
      activeSlot: 'None',
      parkingArea: selectedParkingArea,
      reservedSlots: myReservations.length
    },
    recentActivity: parkingActivity,
    parkingSlots: parkingSlots  // Use only backend data, no mock fallback
  };

  // Handler functions
  const handleParkingAreaChange = (area) => {
    setSelectedParkingArea(area);
    console.log('Selected parking area:', area);
  };

  const handleReserveSlot = (slot) => {
    setSelectedSlot(slot);
    setShowReservationModal(true);
  };

  const handleConfirmReservation = async () => {
    try {
      // Call API to reserve slot for current user
      const result = await parkingSlotAPI.reserveSlot(
        selectedSlot.id,
        currentUser.id,
        currentUser.id // Reserve for current user
      );
      
      if (result.success) {
        // Reload parking data to get updated slots
        await loadParkingData();
        
        setShowReservationModal(false);
        setSelectedSlot(null);
        
        alert(`Slot ${selectedSlot.id} has been reserved successfully!`);
      } else {
        alert(`Failed to reserve slot: ${result.error}`);
      }
    } catch (error) {
      console.error('Error reserving slot:', error);
      alert('An error occurred while reserving the slot. Please try again.');
    }
  };

  const handleCancelReservation = async (slotId) => {
    try {
      // Call API to cancel reservation
      const result = await parkingSlotAPI.cancelReservation(slotId);
      
      if (result.success) {
        // Reload parking data to get updated slots
        await loadParkingData();
        
        alert(`Reservation for slot ${slotId} cancelled`);
      } else {
        alert(`Failed to cancel reservation: ${result.error}`);
      }
    } catch (error) {
      console.error('Error canceling reservation:', error);
      alert('An error occurred while canceling the reservation. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="staff-dashboard">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading parking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-dashboard">
      {/* Quick Overview Cards */}
      <section className="quick-overview">
        <div className="stats-grid">
          <StatsCard
            icon={icons.parking}
            label="Active Slot"
            value={dashboardData.stats.activeSlot || 'None'}
            status={dashboardData.stats.activeSlot ? 'active' : 'neutral'}
          />
          <div className="stats-card stats-location">
            <div className="stats-icon">
              {icons.location}
            </div>
            <div className="stats-info">
              <p className="stats-label">Parking Area</p>
              <div className="parking-area-wrapper">
                <select 
                  className="parking-area-select"
                  value={selectedParkingArea}
                  onChange={(e) => handleParkingAreaChange(e.target.value)}
                >
                  {parkingAreas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <StatsCard
            icon={icons.reserved}
            label="My Reservations"
            value={dashboardData.stats.reservedSlots}
            status="active"
          />
        </div>
      </section>

      {/* Reservation Panel - Staff/Guard can reserve slots */}
      <div className="dashboard-section">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="section-title">My Reservations</h2>
          <p className="section-subtitle">View and manage your parking reservations</p>
        </div>
        <ReservationPanel 
          myReservations={myReservations}
          onCancelReservation={handleCancelReservation}
          currentUser={currentUser}
        />
      </div>
      
      {/* Parking Map - View Only with Reservation Button */}
      <div className="parking-map-full-width">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Parking Map</h2>
          <p className="section-subtitle">View current parking slot status</p>
        </div>
        <div style={{ position: 'relative' }}>
          <ParkingMap 
            slots={dashboardData.parkingSlots} 
            canReserve={false}
          />
          <button 
            className="make-reservation-btn"
            onClick={() => window.location.href = '/my-slots'}
          >
            Make Reservation
          </button>
        </div>
      </div>

      {/* Activity Table */}
      <div className="dashboard-section">
        <ActivityTable activities={dashboardData.recentActivity} />
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="modal-overlay" onClick={() => setShowReservationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reserve Slot {selectedSlot?.id}</h3>
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
                className="btn btn-primary"
                onClick={handleConfirmReservation}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
