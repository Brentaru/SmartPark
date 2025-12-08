import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import '../../styles/guard/GuardDashboard.css';

const GuardDashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { isExpanded } = useSidebar();
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8080/api';

  // State management
  const [stats, setStats] = useState({
    totalSlots: 0,
    availableSlots: 0,
    occupiedSlots: 0,
    reservedSlots: 0,
    vehiclesIn: 0,
    vehiclesOut: 0,
    pendingReservations: 0,
    activeShifts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [todayShift, setTodayShift] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchParkingStats(),
        fetchTodayActivity(),
        fetchTodayShift()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParkingStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking-slots`);
      if (!response.ok) throw new Error('Failed to fetch parking stats');
      
      const slots = await response.json();
      
      const available = slots.filter(s => s.status === 'Available').length;
      const occupied = slots.filter(s => s.status === 'Occupied').length;
      const reserved = slots.filter(s => s.status === 'Reserved').length;

      setStats(prev => ({
        ...prev,
        totalSlots: slots.length,
        availableSlots: available,
        occupiedSlots: occupied,
        reservedSlots: reserved,
        pendingReservations: reserved
      }));
    } catch (error) {
      console.error('Error fetching parking stats:', error);
    }
  };

  const fetchTodayActivity = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking-records`);
      if (!response.ok) throw new Error('Failed to fetch activity');
      
      const records = await response.json();
      const today = new Date().toISOString().split('T')[0];
      
      const todayRecords = records.filter(r => r.date === today);
      const vehiclesIn = todayRecords.filter(r => r.timeIn && !r.timeOut).length;
      const vehiclesOut = todayRecords.filter(r => r.timeOut).length;
      
      setStats(prev => ({
        ...prev,
        vehiclesIn,
        vehiclesOut
      }));

      // Set recent activity (last 5 records)
      const sortedRecords = todayRecords
        .sort((a, b) => new Date(b.date + ' ' + (b.timeIn || '00:00')) - new Date(a.date + ' ' + (a.timeIn || '00:00')))
        .slice(0, 5)
        .map(record => ({
          id: record.recordID,
          plateNumber: record.plateNumber,
          action: record.timeOut ? 'Exit' : 'Entry',
          time: record.timeOut || record.timeIn,
          slotNumber: record.slotNumber,
          status: record.status
        }));
      
      setRecentActivity(sortedRecords);
    } catch (error) {
      console.error('Error fetching today activity:', error);
    }
  };

  const fetchTodayShift = () => {
    // TODO: Replace with actual API when backend is ready
    const today = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    
    let shiftType = 'Morning';
    let startTime = '06:00';
    let endTime = '14:00';
    
    if (currentHour >= 14 && currentHour < 22) {
      shiftType = 'Afternoon';
      startTime = '14:00';
      endTime = '22:00';
    } else if (currentHour >= 22 || currentHour < 6) {
      shiftType = 'Night';
      startTime = '22:00';
      endTime = '06:00';
    }

    setTodayShift({
      date: today,
      shiftType,
      startTime,
      endTime,
      area: 'NGE Parking Area',
      status: 'Active'
    });
  };

  const formatTime = (time) => {
    if (!time) return '--:--';
    return time.slice(0, 5);
  };

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className={`dashboard-layout ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <AuthTopbar />
        <div className="dashboard-main">
          <div className="dashboard-container guard-dashboard">
            
            {/* Page Header - Compact */}
            <div className="page-header">
              <div className="header-content">
                <div>
                  <h1 className="page-title">Guard Dashboard</h1>
                  <p className="page-subtitle">
                    Welcome back, {currentUser?.firstName || 'Guard'}
                  </p>
                </div>
                {todayShift && (
                  <div className="shift-badge-compact">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{todayShift.shiftType} Shift</span>
                    <span className="shift-time-compact">{todayShift.startTime} - {todayShift.endTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon red">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Slots</p>
                  <p className="stat-value">{stats.totalSlots}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Available</p>
                  <p className="stat-value">{stats.availableSlots}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon occupied">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 17h14v-2H5v2zm0-4h14V5H5v8z"/>
                    <circle cx="7.5" cy="17" r="1.5"/>
                    <circle cx="16.5" cy="17" r="1.5"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Occupied</p>
                  <p className="stat-value">{stats.occupiedSlots}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon yellow">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Reserved</p>
                  <p className="stat-value">{stats.reservedSlots}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <polyline points="19 12 12 19 5 12"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">In Today</p>
                  <p className="stat-value">{stats.vehiclesIn}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="19" x2="12" y2="5"/>
                    <polyline points="5 12 12 5 19 12"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Out Today</p>
                  <p className="stat-value">{stats.vehiclesOut}</p>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="dashboard-grid">
              
              {/* Recent Activity Section */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2 className="section-title">Recent Activity</h2>
                  <span className="section-badge">{recentActivity.length} records</span>
                </div>
                <div className="activity-container">
                  {loading ? (
                    <div className="loading-state">Loading...</div>
                  ) : recentActivity.length === 0 ? (
                    <div className="empty-state">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <p>No activity today</p>
                    </div>
                  ) : (
                    <div className="activity-list">
                      {recentActivity.map((activity, index) => (
                        <div key={activity.id || index} className="activity-item">
                          <div className={`activity-icon ${activity.action.toLowerCase()}`}>
                            {activity.action === 'Entry' ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <polyline points="19 12 12 19 5 12"/>
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="19" x2="12" y2="5"/>
                                <polyline points="5 12 12 5 19 12"/>
                              </svg>
                            )}
                          </div>
                          <div className="activity-details">
                            <div className="activity-main">
                              <span className="activity-plate">{activity.plateNumber}</span>
                              <span className={`activity-badge ${activity.action.toLowerCase()}`}>
                                {activity.action}
                              </span>
                            </div>
                            <div className="activity-meta">
                              <span className="activity-slot">Slot {activity.slotNumber}</span>
                              <span className="activity-time">{formatTime(activity.time)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pending Reservations Section */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2 className="section-title">Pending Reservations</h2>
                  <span className="section-badge">{stats.pendingReservations} pending</span>
                </div>
                <div className="reservations-container">
                  {stats.pendingReservations === 0 ? (
                    <div className="empty-state">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                      <p>No pending reservations</p>
                    </div>
                  ) : (
                    <div className="info-card">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                      <div>
                        <p className="info-title">{stats.pendingReservations} reservations waiting</p>
                        <p className="info-subtitle">Go to Manage Parking to view details</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardDashboard;
