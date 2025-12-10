import React, { useState, useEffect } from 'react';
import { parkingRecordAPI, userAPI, vehicleAPI } from '../../../api/api';
import '../../../styles/dashboard/admin/SystemLogs.css';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const [recordsResult, usersResult, vehiclesResult] = await Promise.all([
        parkingRecordAPI.getAllRecords(),
        userAPI.getAllUsers(),
        vehicleAPI.getAllVehicles()
      ]);
      
      if (recordsResult.success) {
        // Create a mapping of vehicleID to userID
        const vehicleToUserMap = {};
        if (vehiclesResult.success) {
          vehiclesResult.data.forEach(vehicle => {
            if (vehicle.userID) {
              vehicleToUserMap[vehicle.vehicleID] = vehicle.userID;
            }
          });
        }
        
        console.log('Vehicle to User map:', vehicleToUserMap);
        console.log('Sample parking record:', recordsResult.data[0]);
        
        // Convert parking records to log format
        const formattedLogs = recordsResult.data.map(record => {
          const userID = vehicleToUserMap[record.vehicleID];
          return {
            id: record.recordID,
            type: 'parking',
            action: record.exitTime ? 'exit' : 'entry',
            timestamp: record.exitTime || record.entryTime,
            userID: userID,
            slotID: record.slotID,
            vehicleID: record.vehicleID,
            details: `${record.exitTime ? 'Exited' : 'Entered'} parking slot #${record.slotLocation || record.slotID || 'N/A'}`
          };
        });
        setLogs(formattedLogs);
      }
      
      if (usersResult.success) setUsers(usersResult.data);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userID) => {
    const user = users.find(u => u.userID === userID);
    if (!user) {
      console.log('User not found for ID:', userID, 'Available users:', users.length);
      return 'Unknown User';
    }
    const fullName = `${user.fname || ''} ${user.lname || ''}`.trim();
    return fullName || user.email || user.userID || 'Unknown User';
  };

  const getFilteredLogs = () => {
    let filtered = logs;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.action === filterType);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      
      filtered = filtered.filter(log => {
        const timestamp = new Date(log.timestamp);
        switch(dateFilter) {
          case 'today':
            return timestamp.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return timestamp >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return timestamp >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => {
        const userName = getUserName(log.userID).toLowerCase();
        const details = log.details.toLowerCase();
        const search = searchTerm.toLowerCase();
        return userName.includes(search) || details.includes(search) || 
               log.userID?.toString().includes(search);
      });
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLogIcon = (action) => {
    const icons = {
      entry: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
          <circle cx="6.5" cy="15.5" r="1.5"/>
          <circle cx="17.5" cy="15.5" r="1.5"/>
        </svg>
      ),
      exit: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      ),
      create: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      ),
      update: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
      delete: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      )
    };
    return icons[action] || (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    );
  };

  const getLogTypeClass = (action) => {
    const classes = {
      entry: 'log-entry',
      exit: 'log-exit',
      create: 'log-create',
      update: 'log-update',
      delete: 'log-delete'
    };
    return classes[action] || 'log-default';
  };

  const filteredLogs = getFilteredLogs();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading system logs...</p>
      </div>
    );
  }

  return (
    <div className="system-logs">
      <div className="logs-header">
        <h2>System Logs</h2>
        <div className="logs-stats">
          <div className="stat-item">
            <span className="stat-label">Total Events:</span>
            <span className="stat-value">{logs.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Today:</span>
            <span className="stat-value">
              {logs.filter(log => {
                const logDate = new Date(log.timestamp);
                const today = new Date();
                return logDate.toDateString() === today.toDateString();
              }).length}
            </span>
          </div>
        </div>
      </div>

      <div className="logs-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="entry">Entry</option>
            <option value="exit">Exit</option>
          </select>

          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          <button className="btn-secondary" onClick={loadLogs}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="logs-container">
        {filteredLogs.length === 0 ? (
          <div className="no-logs">
            <p>No logs found matching your criteria</p>
          </div>
        ) : (
          <div className="logs-list">
            {filteredLogs.map(log => (
              <div key={log.id} className={`log-item ${getLogTypeClass(log.action)}`}>
                <div className="log-icon">
                  {getLogIcon(log.action)}
                </div>
                <div className="log-content">
                  <div className="log-main">
                    <span className="log-type-badge">{log.action.toUpperCase()}</span>
                    <span className="log-details">{log.details}</span>
                  </div>
                  <div className="log-meta">
                    <span className="log-user">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {getUserName(log.userID)}
                    </span>
                    <span className="log-separator">•</span>
                    <span className="log-timestamp">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {formatTimestamp(log.timestamp)}
                    </span>
                    {log.slotID && (
                      <>
                        <span className="log-separator">•</span>
                        <span className="log-slot">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                          Slot #{log.slotID}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="logs-footer">
        <p>Showing {filteredLogs.length} of {logs.length} logs</p>
      </div>
    </div>
  );
};

export default SystemLogs;
