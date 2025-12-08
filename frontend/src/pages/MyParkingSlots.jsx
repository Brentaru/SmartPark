import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import ParkingMap from '../components/dashboard/ParkingMap';
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
        setParkingSlots(transformedSlots);
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
    if (slot.status === 'free') {
      console.log(`Selected slot: ${slot.location}`);
      alert(`You selected slot ${slot.location}. Redirecting to reservation...`);
    } else if (slot.status === 'reserved') {
      console.log(`View reservation for slot: ${slot.location}`);
      alert(`This is your reserved slot: ${slot.location}`);
    } else {
      alert(`Slot ${slot.location} is currently occupied.`);
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
    </div>
  );
};

export default MyParkingSlots;
