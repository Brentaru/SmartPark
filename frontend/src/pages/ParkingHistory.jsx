import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import { parkingRecordAPI } from '../api/api';
import '../styles/ParkingHistory.css';

const ParkingHistory = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { isExpanded } = useSidebar();
  const navigate = useNavigate();
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [parkingHistory, setParkingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load parking history from API
  useEffect(() => {
    const loadParkingHistory = async () => {
      if (!currentUser?.id) {
        console.warn('⚠️ No user ID found, cannot load parking history');
        console.log('currentUser object:', currentUser);
        return;
      }

      try {
        setLoading(true);
        
        const userRole = currentUser.role?.toLowerCase();
        const userID = currentUser.id;
        
        console.log('═══════════════════════════════════════════');
        console.log('📋 PARKING HISTORY LOAD REQUEST');
        console.log('═══════════════════════════════════════════');
        console.log(`👤 User Role: ${userRole}`);
        console.log(`🆔 User ID: ${userID}`);
        console.log(`📧 Email: ${currentUser.email}`);
        console.log(`👤 Name: ${currentUser.firstName} ${currentUser.lastName}`);
        console.log('═══════════════════════════════════════════');
        
        // Guard sees all records, Staff and Student see only their own
        let result;
        if (userRole === 'guard') {
          console.log('🛡️ [GUARD] Fetching ALL parking records from system');
          result = await parkingRecordAPI.getAllRecords();
          console.log('📊 API Response:', result);
        } else if (userRole === 'staff' || userRole === 'student') {
          console.log(`👨‍💼 [${userRole.toUpperCase()}] Fetching records for user: ${userID}`);
          result = await parkingRecordAPI.getRecordsByUser(userID);
          console.log('📊 API Response:', result);
        } else {
          console.error('❌ Unknown role:', userRole);
          setParkingHistory([]);
          setLoading(false);
          return;
        }

        if (result.success && result.data) {
          console.log(`✅ Received ${result.data.length} parking records`);
          console.log('🔍 Raw API data:', result.data);
          
          // Validate data before transformation
          if (!Array.isArray(result.data)) {
            console.error('❌ API returned non-array data:', result.data);
            setParkingHistory([]);
            setLoading(false);
            return;
          }
          
          if (result.data.length === 0) {
            console.log('ℹ️ No parking records found for this user/role');
            setParkingHistory([]);
            setLoading(false);
            return;
          }
          
          // Transform API data to match component format
          const transformedHistory = result.data.map((record, index) => {
            try {
              console.log(`📝 Transforming record ${index}:`, record);
              
              if (!record.entryTime) {
                console.warn(`⚠️ Record ${index} has no entryTime:`, record);
                return null;
              }
              
              const entryTime = new Date(record.entryTime);
              const exitTime = record.exitTime ? new Date(record.exitTime) : null;

              // Calculate duration
              let duration = null;
              if (exitTime) {
                const durationMs = exitTime - entryTime;
                const hours = Math.floor(durationMs / (1000 * 60 * 60));
                const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                duration = `${hours}h ${minutes}m`;
              }

              // Determine status
              let status = 'Active';
              if (exitTime) {
                status = 'Completed';
              } else if (entryTime < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
                status = 'Expired';
              }

              const transformedRecord = {
                id: record.recordID,
                date: entryTime.toISOString().split('T')[0],
                slot: record.slotLocation || 'N/A',
                area: 'NGE Parking Area',
                timeIn: entryTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: true 
                }),
                timeOut: exitTime ? exitTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: true 
                }) : null,
                duration: duration,
                status: status,
                vehicle: record.plateNumber || 'N/A',
                verifiedBy: record.verifiedByUserName || 'System'
              };
              
              console.log(`✅ Transformed record ${index}:`, transformedRecord);
              return transformedRecord;
            } catch (error) {
              console.error(`❌ Error transforming record ${index}:`, error, record);
              return null;
            }
          }).filter(record => record !== null);

          console.log('✅ Final transformed parking history:', transformedHistory);
          console.log(`📊 Total records after transformation: ${transformedHistory.length}`);
          setParkingHistory(transformedHistory);
        } else {
          console.warn('⚠️ API call failed or returned no data');
          console.log('Result object:', result);
          console.log('Result.success:', result?.success);
          console.log('Result.data:', result?.data);
          console.log('Result.error:', result?.error);
          
          // Show a more helpful message
          if (!result.success && result.error) {
            alert(`Error loading parking history: ${result.error}`);
          }
          setParkingHistory([]);
        }
      } catch (error) {
        console.error('❌ Error loading parking history:', error);
        setParkingHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadParkingHistory();
  }, [currentUser]);

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
  const activeSessions = parkingHistory.filter(r => r.status === 'Active').length;

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="parking-history-page">
        <AuthTopbar pageTitle="Parking History" />
        <div className="dashboard-layout">
          <Sidebar />
          <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading parking history...</p>
            </div>
          </main>
        </div>
      </div>
    );
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
                <p className="history-subtitle">
                  {currentUser?.role?.toLowerCase() === 'guard' 
                    ? 'View all parking activity records across the system' 
                    : 'View your complete parking activity records'}
                </p>
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
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{activeSessions}</div>
                  <div className="stat-label">Active Sessions</div>
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
                      {currentUser?.role?.toLowerCase() === 'guard' && (
                        <>
                          <th>Vehicle</th>
                          <th>Verified By</th>
                        </>
                      )}
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
                          {currentUser?.role?.toLowerCase() === 'guard' && (
                            <>
                              <td className="cell-vehicle">{record.vehicle}</td>
                              <td className="cell-verified">{record.verifiedBy}</td>
                            </>
                          )}
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
                        <td colSpan={currentUser?.role?.toLowerCase() === 'guard' ? '9' : '7'} className="no-data">
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
