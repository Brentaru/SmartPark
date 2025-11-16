import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/dashboard/StatsCard';
import ActivityTable from '../../components/dashboard/ActivityTable';
import ReservationPanel from '../../components/dashboard/ReservationPanel';
import ParkingMap from '../../components/dashboard/ParkingMap';
import { mockDashboardData } from '../../data/mockData';
import '../../styles/dashboard/StudentDashboard.css';

const StudentDashboard = ({ currentUser }) => {
  const navigate = useNavigate();

  // Icons for stats cards
  const icons = {
    parking: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2"/>
        <circle cx="12" cy="16" r="2"/>
        <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    reservation: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    location: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    visits: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="8.5" cy="7" r="4"/>
        <polyline points="17 11 19 13 23 9"/>
      </svg>
    ),
  };

  // State management for dashboard data - using centralized mock data
  const [currentReservation, setCurrentReservation] = React.useState(mockDashboardData.currentReservation);
  const [selectedParkingArea, setSelectedParkingArea] = React.useState(mockDashboardData.parkingAreas[0]);
  const [notifications, setNotifications] = React.useState(mockDashboardData.notifications);

  const parkingAreas = mockDashboardData.parkingAreas;

  // Dashboard data from centralized mock data
  const dashboardData = {
    stats: {
      activeSlot: currentReservation ? currentReservation.slot : 'None',
      reservation: currentReservation ? `Slot #${currentReservation.slot}` : 'No reservation',
      parkingArea: selectedParkingArea,
      totalVisits: mockDashboardData.stats.totalVisits
    },
    recentActivity: mockDashboardData.recentActivity,
    parkingSlots: mockDashboardData.parkingSlots
  };

  // Handler functions
  const handleReserve = () => {
    console.log('Navigate to reservation page');
    // In real app: navigate('/reserve');
    alert('Redirecting to reservation page... (Feature coming soon)');
  };

  const handleCancelReservation = () => {
    if (window.confirm('Are you sure you want to cancel your reservation?')) {
      setCurrentReservation(null);
      console.log('Reservation cancelled');
      // In real app: call API to cancel reservation
      alert('Reservation cancelled successfully!');
    }
  };

  const handleDismissNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const handleMarkAllRead = () => {
    setNotifications([]);
    console.log('All notifications marked as read');
  };

  const handleParkingAreaChange = (area) => {
    setSelectedParkingArea(area);
    console.log('Selected parking area:', area);
    // In real app: filter parking slots by area
  };

  return (
    <div className="student-dashboard">
      {/* Quick Overview Cards */}
      <section className="quick-overview">
        <div className="stats-grid">
          <StatsCard
            icon={icons.parking}
            label="Active Slot"
            value={dashboardData.stats.activeSlot || 'None'}
            status={dashboardData.stats.activeSlot ? 'active' : 'neutral'}
          />
          <StatsCard
            icon={icons.reservation}
            label="Reservation"
            value={dashboardData.stats.reservation || 'No reservation'}
            status="reserved"
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
            icon={icons.visits}
            label="Total Visits"
            value={dashboardData.stats.totalVisits}
            status="neutral"
          />
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="dashboard-columns">
        {/* Left Column */}
        <div className="left-column">
          <ActivityTable activities={dashboardData.recentActivity} />
        </div>

        {/* Right Column */}
        <div className="right-column">
          <ReservationPanel 
            currentReservation={currentReservation}
            onReserve={handleReserve}
            onCancel={handleCancelReservation}
          />
        </div>
      </div>
      
      {/* Full Width Parking Map */}
      <div className="parking-map-full-width">
        <ParkingMap slots={dashboardData.parkingSlots} />
      </div>
    </div>
  );
};

export default StudentDashboard;
