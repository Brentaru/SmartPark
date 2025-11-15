import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/dashboard/StatsCard';
import ActivityTable from '../../components/dashboard/ActivityTable';
import ReservationPanel from '../../components/dashboard/ReservationPanel';
import ParkingMap from '../../components/dashboard/ParkingMap';
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

  // State management for dashboard data
  const [currentReservation, setCurrentReservation] = React.useState({
    slot: 'A-12',
    date: 'November 3, 2025',
    timeStart: '8:00 AM',
    timeEnd: '6:00 PM',
    location: 'North Parking Area'
  });

  const [selectedParkingArea, setSelectedParkingArea] = React.useState('NGE Parking Area');

  const parkingAreas = [
    'NGE Parking Area'
  ];

  const [notifications, setNotifications] = React.useState([
    { 
      id: 1,
      type: 'warning', 
      message: 'Your reservation will expire in 15 minutes. Please renew or vacate the slot.',
      time: '5 minutes ago'
    },
    { 
      id: 2,
      type: 'info', 
      message: 'Parking Lot C will be closed for maintenance tomorrow (Nov 3) from 8 AM to 12 PM.',
      time: '2 hours ago'
    },
    { 
      id: 3,
      type: 'success', 
      message: 'Your parking fee payment of $15.00 has been processed successfully.',
      time: '1 day ago'
    },
    { 
      id: 4,
      type: 'info', 
      message: 'New parking rates will be effective from November 15, 2025. Check your email for details.',
      time: '2 days ago'
    },
  ]);

  // Mock dashboard data - would come from API in real app
  const dashboardData = {
    stats: {
      activeSlot: currentReservation ? currentReservation.slot : 'None',
      reservation: currentReservation ? `Slot #${currentReservation.slot}` : 'No reservation',
      parkingArea: selectedParkingArea,
      totalVisits: 24
    },
    recentActivity: [
      { date: '2025-11-02', timeIn: '08:30 AM', timeOut: '05:45 PM', slot: 'A-12', duration: 555, status: 'Completed' },
      { date: '2025-11-01', timeIn: '09:15 AM', timeOut: '04:30 PM', slot: 'B-05', duration: 435, status: 'Completed' },
      { date: '2025-10-31', timeIn: '08:00 AM', timeOut: '06:00 PM', slot: 'A-12', duration: 600, status: 'Completed' },
      { date: '2025-10-30', timeIn: '10:00 AM', timeOut: '03:45 PM', slot: 'C-18', duration: 345, status: 'Completed' },
      { date: '2025-10-29', timeIn: '07:45 AM', timeOut: '04:15 PM', slot: 'A-12', duration: 510, status: 'Completed' },
      { date: '2025-10-28', timeIn: '09:30 AM', timeOut: '05:00 PM', slot: 'B-03', duration: 450, status: 'Completed' },
      { date: '2025-10-27', timeIn: '08:15 AM', timeOut: null, slot: 'A-08', duration: null, status: 'Expired' },
    ],
    parkingSlots: [
      { id: 'A-01', status: 'free' },
      { id: 'A-02', status: 'occupied' },
      { id: 'A-03', status: 'free' },
      { id: 'A-04', status: 'reserved' },
      { id: 'A-05', status: 'occupied' },
      { id: 'A-06', status: 'free' },
      { id: 'A-07', status: 'free' },
      { id: 'A-08', status: 'occupied' },
      { id: 'A-09', status: 'free' },
      { id: 'A-10', status: 'occupied' },
      { id: 'A-11', status: 'reserved' },
      { id: 'A-12', status: 'reserved' },
      { id: 'B-01', status: 'free' },
      { id: 'B-02', status: 'free' },
      { id: 'B-03', status: 'occupied' },
      { id: 'B-04', status: 'free' },
      { id: 'B-05', status: 'occupied' },
      { id: 'B-06', status: 'free' },
      { id: 'B-07', status: 'free' },
      { id: 'B-08', status: 'occupied' },
      { id: 'C-01', status: 'free' },
      { id: 'C-02', status: 'occupied' },
      { id: 'C-03', status: 'free' },
      { id: 'C-04', status: 'free' },
    ]
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
