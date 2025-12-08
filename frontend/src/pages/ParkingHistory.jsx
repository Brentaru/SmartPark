import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import { mockParkingHistory } from '../data/mockData';
import '../styles/ParkingHistory.css';

const ParkingHistory = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { isExpanded } = useSidebar();
  const navigate = useNavigate();
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Use mock parking history data from centralized location
  const parkingHistory = mockParkingHistory;

  // Filter and sort logic
  const getFilteredHistory = () => {
    let filtered = [...parkingHistory];

    // Filter by location
    if (filterLocation !== 'all') {
      filtered = filtered.filter(record => record.area.toLowerCase().includes(filterLocation.toLowerCase()));
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(record => record.status.toLowerCase() === filterStatus);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.slot.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.date.includes(searchTerm)
      );
    }

    // Sort
    switch (sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'duration-desc':
        filtered.sort((a, b) => {
          const getDuration = (dur) => {
            if (!dur) return 0;
            const [hours, mins] = dur.split('h ').map(s => parseInt(s));
            return hours * 60 + mins;
          };
          return getDuration(b.duration) - getDuration(a.duration);
        });
        break;
      case 'slot':
        filtered.sort((a, b) => a.slot.localeCompare(b.slot));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredHistory = getFilteredHistory();

  // Statistics
  const totalSessions = parkingHistory.length;
  const completedSessions = parkingHistory.filter(r => r.status === 'Completed').length;
  const expiredSessions = parkingHistory.filter(r => r.status === 'Expired').length;
  const mostUsedSlot = parkingHistory.reduce((acc, record) => {
    acc[record.slot] = (acc[record.slot] || 0) + 1;
    return acc;
  }, {});
  const favoriteSlot = Object.entries(mostUsedSlot).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="parking-history-page">
      <AuthTopbar pageTitle="Parking History" />

      <div className="dashboard-layout">
        <Sidebar />

        <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
          <div className="history-container">
            {/* Page Header */}
            <section className="history-header">
              <div className="header-content">
                <h1 className="history-title">Parking History</h1>
                <p className="history-subtitle">View your complete parking activity records</p>
              </div>
            </section>

            {/* Statistics Cards */}
            <section className="history-stats">
              <div className="stat-card">
                <div className="stat-icon stat-icon-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{totalSessions}</div>
                  <div className="stat-label">Total Sessions</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{completedSessions}</div>
                  <div className="stat-label">Completed</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-warning">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{expiredSessions}</div>
                  <div className="stat-label">Expired</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon stat-icon-info">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{favoriteSlot}</div>
                  <div className="stat-label">Favorite Slot</div>
                </div>
              </div>
            </section>

            {/* Filters and Controls */}
            <section className="history-controls">
              <div className="controls-row">
                <div className="search-box">
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by location, slot, or vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <select 
                    className="filter-select"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="all">All Locations</option>
                    <option value="nge">NGE Parking Area</option>
                  </select>

                  <select 
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
            </section>

            {/* History Table */}
            <section className="history-table-section">
              <div className="table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Slot</th>
                      <th>Parking Area</th>
                      <th>Time In</th>
                      <th>Time Out</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((record) => (
                        <tr key={record.id}>
                          <td className="cell-date">{record.date}</td>
                          <td className="cell-slot">
                            <span className="slot-badge">{record.slot}</span>
                          </td>
                          <td className="cell-area">{record.area}</td>
                          <td className="cell-time">{record.timeIn}</td>
                          <td className="cell-time">
                            {record.timeOut || <span className="text-muted">—</span>}
                          </td>
                          <td className="cell-duration">
                            {record.duration || <span className="text-muted">—</span>}
                          </td>
                          <td className="cell-status">
                            <span className={`status-badge status-${record.status.toLowerCase()}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="no-data">
                          <div className="no-data-content">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <p>No parking history found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParkingHistory;
