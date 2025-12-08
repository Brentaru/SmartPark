import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import '../styles/ParkingHistory.css';

const ParkingHistory = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { isExpanded } = useSidebar();
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8080/api';
  
  const [parkingHistory, setParkingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch parking history from backend
  useEffect(() => {
    if (currentUser) {
      fetchParkingHistory();
    }
  }, [currentUser]);

  const fetchParkingHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/parking-records`);
      if (!response.ok) {
        throw new Error('Failed to fetch parking history');
      }
      const data = await response.json();
      
      // Transform backend data to display format
      const transformedHistory = data.map(record => {
        const entryTime = record.entryTime ? new Date(record.entryTime) : null;
        const exitTime = record.exitTime ? new Date(record.exitTime) : null;
        
        // Calculate duration
        let duration = null;
        if (entryTime && exitTime) {
          const diff = exitTime - entryTime;
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          duration = `${hours}h ${minutes}m`;
        }
        
        return {
          id: record.recordID,
          date: entryTime ? entryTime.toLocaleDateString() : 'N/A',
          slot: record.slotLocation || 'N/A',
          area: record.areaName || 'NGE Parking Area',
          timeIn: entryTime ? entryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
          timeOut: exitTime ? exitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
          duration: duration,
          vehicle: record.vehiclePlateNumber || 'N/A',
          status: exitTime ? 'Completed' : 'Active'
        };
      });
      
      setParkingHistory(transformedHistory);
    } catch (err) {
      console.error('Error fetching parking history:', err);
      setParkingHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort logic
  const getFilteredHistory = () => {
    let filtered = [...parkingHistory];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(record => record.status.toLowerCase() === filterStatus.toLowerCase());
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
  const activeSessions = parkingHistory.filter(r => r.status === 'Active').length;
  const mostUsedSlot = parkingHistory.reduce((acc, record) => {
    acc[record.slot] = (acc[record.slot] || 0) + 1;
    return acc;
  }, {});
  const favoriteSlot = Object.entries(mostUsedSlot).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle="Parking History" />

      <div className="dashboard-layout">
        <Sidebar />

        <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
          <div className="dashboard-container">
            {/* Page Header */}
            <div className="page-header">
              <h1 className="page-title">Parking History</h1>
              <p className="page-subtitle">View your complete parking activity records</p>
            </div>

            {/* Statistics Cards */}
            <div className="parking-stats">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Sessions</p>
                  <p className="stat-value">{totalSessions}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Completed</p>
                  <p className="stat-value">{completedSessions}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Active</p>
                  <p className="stat-value">{activeSessions}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#dbeafe', color: '#3b82f6' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Favorite Slot</p>
                  <p className="stat-value">{favoriteSlot}</p>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '250px', position: 'relative' }}>
                <svg 
                  style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search by slot, vehicle, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem 0.625rem 2.5rem',
                    fontSize: '0.875rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                />
              </div>

              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '0.625rem 0.875rem',
                  fontSize: '0.875rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  background: 'white',
                  color: '#111827',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '150px'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
              </select>
            </div>

            {/* History Table */}
            <div style={{ background: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '1rem', color: '#6b7280' }}>Loading parking history...</div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParkingHistory;
