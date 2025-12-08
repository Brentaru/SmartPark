import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/dashboard/StatsCard';
import ActivityTable from '../../components/dashboard/ActivityTable';
import ParkingMap from '../../components/dashboard/ParkingMap';
import { parkingSlotAPI, parkingRecordAPI } from '../../api/api';
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
  const [selectedParkingArea, setSelectedParkingArea] = useState(mockDashboardData.parkingAreas[0]);
  const [notifications, setNotifications] = useState(mockDashboardData.notifications);
  const [parkingSlots, setParkingSlots] = useState([]);
  const [parkingActivity, setParkingActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const parkingAreas = mockDashboardData.parkingAreas;

  // Load parking slots and activity on mount
  useEffect(() => {
    loadParkingSlots();
    loadParkingActivity();
  }, [currentUser.id]);

  const loadParkingSlots = async () => {
    try {
      setLoading(true);
      const result = await parkingSlotAPI.getAllSlots();
      
      if (result.success && result.data && result.data.length > 0) {
        // Transform backend data to match frontend format
        const transformedSlots = result.data.map(slot => ({
          id: slot.slotID,  // Numeric ID from backend
          location: slot.location,
          status: slot.status === 'Available' ? 'free' : 
                  slot.status === 'Reserved' ? 'reserved' : 'occupied',
          type: slot.slotType,
          reservedBy: slot.reservedBy,
          reservedFor: slot.reservedFor
        }));
        setParkingSlots(transformedSlots);
      } else {
        console.warn('No parking slots found in database.');
        setParkingSlots([]);
      }
    } catch (error) {
      console.error('Error loading parking slots:', error);
      setParkingSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const loadParkingActivity = async () => {
    try {
      // Load parking records for this specific user
      const recordsResult = await parkingRecordAPI.getRecordsByUser(currentUser.id);
      console.log('📊 Student parking records:', recordsResult);
      
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
        .slice(0, 10); // Latest 10 records
        
        console.log('✅ Student transformed activity:', transformedActivity);
        setParkingActivity(transformedActivity);
      } else {
        console.warn('⚠️ No parking records found for this student');
        setParkingActivity([]);
      }
    } catch (error) {
      console.error('Error loading parking activity:', error);
      setParkingActivity([]);
    }
  };

  // Dashboard data structure
  const dashboardData = {
    stats: {
      activeSlot: 'None',
      parkingArea: selectedParkingArea,
      totalVisits: parkingActivity.length // Use actual parking record count
    },
    recentActivity: parkingActivity,  // Use real parking activity data
    parkingSlots: parkingSlots  // Use only backend data
  };

  // Handler functions
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

      {/* Parking Map */}
      <div className="parking-map-full-width">
        <ParkingMap slots={dashboardData.parkingSlots} />
      </div>

      {/* Activity Table */}
      <div className="dashboard-section">
        <ActivityTable activities={dashboardData.recentActivity} />
      </div>
    </div>
  );
};

export default StudentDashboard;
