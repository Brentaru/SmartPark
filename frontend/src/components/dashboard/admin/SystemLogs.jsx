import React, { useState, useEffect } from 'react';
import { parkingRecordAPI, userAPI } from '../../../api/api';
import '../../../styles/dashboard/admin/SystemLogs.css';
import { Box, Select, MenuItem, Typography, Chip, Paper } from '@mui/material';
import { Info, CheckCircle, Warning, Error as ErrorIcon } from '@mui/icons-material';

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
      const [recordsResult, usersResult] = await Promise.all([
        parkingRecordAPI.getAllRecords(),
        userAPI.getAllUsers()
      ]);
      
      if (recordsResult.success) {
        // Convert parking records to log format
        const formattedLogs = recordsResult.data.map(record => ({
          id: record.recordID,
          type: 'parking',
          action: record.exitTime ? 'exit' : 'entry',
          timestamp: record.exitTime || record.entryTime,
          userID: record.userID,
          slotID: record.slotID,
          vehicleID: record.vehicleID,
          details: `${record.exitTime ? 'Exited' : 'Entered'} parking slot #${record.slotID}`
        }));
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
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
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
      const logDate = new Date();
      
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
      entry: '🚗',
      exit: '🚦',
      create: '✅',
      update: '📝',
      delete: '🗑️'
    };
    return icons[action] || '📋';
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
            placeholder="🔍 Search logs..."
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
            🔄 Refresh
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
                    <span className="log-user">👤 {getUserName(log.userID)}</span>
                    <span className="log-separator">•</span>
                    <span className="log-timestamp">🕐 {formatTimestamp(log.timestamp)}</span>
                    {log.slotID && (
                      <>
                        <span className="log-separator">•</span>
                        <span className="log-slot">🅿️ Slot #{log.slotID}</span>
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
