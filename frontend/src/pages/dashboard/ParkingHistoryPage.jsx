import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import { parkingRecordAPI, parkingAreaAPI } from '../../api/api';
import '../../styles/ParkingHistory.css';

const ParkingHistoryPage = () => {
  const { currentUser } = useAuth();
  const { isExpanded } = useSidebar();
  const [parkingHistory, setParkingHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // For admin only - area and vehicle filtering
  const [areas, setAreas] = useState([]);
  const [filterArea, setFilterArea] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');

  // Load parking history on component mount or when user changes
  useEffect(() => {
    const loadParkingHistory = async () => {
      try {
        setLoading(true);

        // Admin sees all records, others see their own
        let result;
        const userRole = currentUser?.role?.toLowerCase();

        if (userRole === 'admin') {
          console.log('🔓 [ADMIN] Loading ALL parking records');
          result = await parkingRecordAPI.getAllRecords();
          
          // Also load areas for admin filtering
          const areasResult = await parkingAreaAPI.getAllAreas();
          if (areasResult.success) {
            setAreas(areasResult.data);
          }
        } else {
          console.log(`👤 [${userRole}] Loading own parking records`);
          result = await parkingRecordAPI.getRecordsByUser(currentUser?.id);
        }

        if (result.success && Array.isArray(result.data)) {
          console.log('✅ Parking records API response:', result.data);        if (result.data.length > 0) {
          console.log('📊 Sample record from API:', JSON.stringify(result.data[0], null, 2));
        }          const transformed = result.data
            .map(record => {
              try {
                console.log('📝 Raw record from API:', record);
                const entryTime = new Date(record.entryTime);
                const exitTime = record.exitTime ? new Date(record.exitTime) : null;

                let duration = null;
                if (exitTime) {
                  const durationMs = exitTime - entryTime;
                  const hours = Math.floor(durationMs / (1000 * 60 * 60));
                  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                  duration = `${hours}h ${minutes}m`;
                }

                let status = 'Active';
                if (exitTime) {
                  status = 'Completed';
                } else if (entryTime < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
                  status = 'Expired';
                }

                return {
                  id: record.recordID || record.id || '',
                  date: entryTime.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit' 
                  }),
                  time: entryTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true 
                  }),
                  slot: record.slotLocation || record.slotID || 'N/A',
                  area: record.areaName || record.area || 'Parking Area',
                  timeIn: entryTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    hour12: true 
                  }),
                  timeOut: exitTime ? exitTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true 
                  }) : null,
                  duration: duration,
                  status: status,
                  vehicle: record.plateNumber || record.vehiclePlateNumber || record.vehicleID || 'N/A',
                  verifiedBy: record.verifiedByUserName || record.verifiedBy || 'System',
                  entryTimeObj: entryTime,
                  exitTimeObj: exitTime
                };
              } catch (error) {
                console.error('Error transforming record:', error);
                return null;
              }
            })
            .filter(r => r !== null)
            .sort((a, b) => b.entryTimeObj - a.entryTimeObj);

          setParkingHistory(transformed);
          console.log('✅ Transformed parking history:', transformed);
          console.log('📊 Total records loaded:', transformed.length);
        }
      } catch (error) {
        console.error('Error loading parking history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParkingHistory();
  }, [currentUser]);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...parkingHistory];

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === filterStatus.toLowerCase());
    }

    // Area filter (admin only)
    if (currentUser?.role?.toLowerCase() === 'admin' && filterArea !== 'all') {
      filtered = filtered.filter(r => r.area === filterArea);
    }

    // Vehicle filter (admin only)
    if (currentUser?.role?.toLowerCase() === 'admin' && filterVehicle !== 'all') {
      filtered = filtered.filter(r => r.vehicle === filterVehicle);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.slot.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.date.includes(searchTerm) ||
        r.verifiedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => b.entryTimeObj - a.entryTimeObj);
        break;
      case 'date-asc':
        filtered.sort((a, b) => a.entryTimeObj - b.entryTimeObj);
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

    setFilteredHistory(filtered);
  }, [parkingHistory, filterStatus, filterArea, filterVehicle, searchTerm, sortBy, currentUser]);

  // Get unique vehicles for dropdown
  const uniqueVehicles = [...new Set(parkingHistory.map(r => r.vehicle))].filter(v => v !== 'N/A');

  // Statistics
  const totalSessions = parkingHistory.length;
  const completedSessions = parkingHistory.filter(r => r.status === 'Completed').length;
  const activeSessions = parkingHistory.filter(r => r.status === 'Active').length;

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';

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
                  {isAdmin 
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
                    placeholder="Search by slot, area, vehicle, or date..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  {isAdmin && (
                    <>
                      <select 
                        className="filter-select"
                        value={filterArea}
                        onChange={(e) => setFilterArea(e.target.value)}
                      >
                        <option value="all">All Areas</option>
                        {areas.map(area => (
                          <option key={area.areaID} value={area.areaName}>
                            {area.areaName}
                          </option>
                        ))}
                      </select>

                      <select 
                        className="filter-select"
                        value={filterVehicle}
                        onChange={(e) => setFilterVehicle(e.target.value)}
                      >
                        <option value="all">All Vehicles</option>
                        {uniqueVehicles.map(vehicle => (
                          <option key={vehicle} value={vehicle}>
                            {vehicle}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  <select 
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>

                  <select 
                    className="filter-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date-desc">Latest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="duration-desc">Longest Duration</option>
                    <option value="slot">Slot (A-Z)</option>
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
                      <th>Vehicle</th>
                      <th>Verified By</th>
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
                          <td className="cell-vehicle">{record.vehicle}</td>
                          <td className="cell-verified">{record.verifiedBy}</td>
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
                        <td colSpan="9" className="no-data">
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

export default ParkingHistoryPage;
