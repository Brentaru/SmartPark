import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Simple logout function
  const logout = () => {
    alert('Logging out...'); // Test alert
    if (onLogout) {
      onLogout();
    }
  };

  // Mock data for parking slots
  const parkingSlots = [
    { id: 'A1', status: 'available' },
    { id: 'A2', status: 'occupied' },
    { id: 'A3', status: 'available' },
    { id: 'A4', status: 'occupied' },
    { id: 'A5', status: 'available' },
    { id: 'A6', status: 'occupied' },
    { id: 'A7', status: 'available' },
    { id: 'A8', status: 'available' },
    { id: 'A9', status: 'occupied' },
    { id: 'A10', status: 'available' },
    { id: 'A11', status: 'available' },
    { id: 'A12', status: 'occupied' },
    { id: 'B1', status: 'available' },
    { id: 'B2', status: 'available' },
    { id: 'B3', status: 'occupied' },
    { id: 'B4', status: 'available' },
    { id: 'B5', status: 'occupied' },
    { id: 'B6', status: 'available' },
    { id: 'B7', status: 'available' },
    { id: 'B8', status: 'occupied' },
    { id: 'B9', status: 'available' },
    { id: 'B10', status: 'available' },
    { id: 'B11', status: 'occupied' },
    { id: 'B12', status: 'available' },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'parking', label: 'Parking Slots', icon: '🚗' },
    { id: 'reservations', label: 'Reservations', icon: '📅' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const stats = [
    { label: 'Total Slots', value: '24', color: '#FFC107' },
    { label: 'Available', value: '14', color: '#4CAF50' },
    { label: 'Occupied', value: '10', color: '#F44336' },
    { label: 'Today\'s Revenue', value: '$280', color: '#2196F3' },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">
            <span className="brand-text">SMART</span>
            <span className="brand-accent">PARK</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button 
            className="logout-btn" 
            onClick={logout}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              padding: '15px 25px',
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span className="nav-icon" style={{ marginRight: '15px' }}>🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <h1 className="page-title">User Dashboard</h1>
          <div className="header-actions">
            <div className="user-info">
              <span className="welcome-text">Welcome back, John!</span>
              <div className="user-avatar">JD</div>
              {/* Extra logout button for testing */}
              <button 
                onClick={logout}
                style={{
                  background: '#A40000',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '15px'
                }}
              >
                LOGOUT
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Parking Slots Grid */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Parking Slots Overview</h2>
            <div className="legend">
              <div className="legend-item">
                <div className="legend-color available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-color occupied"></div>
                <span>Occupied</span>
              </div>
            </div>
          </div>

          <div className="parking-grid">
            {parkingSlots.map((slot) => (
              <div
                key={slot.id}
                className={`parking-slot ${slot.status}`}
              >
                <div className="slot-id">{slot.id}</div>
                <div className="slot-status">
                  {slot.status === 'available' ? '✓' : '🚗'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary">
              <span className="action-icon">➕</span>
              <span>New Reservation</span>
            </button>
            <button className="action-btn secondary">
              <span className="action-icon">🔄</span>
              <span>Refresh Status</span>
            </button>
            <button className="action-btn secondary">
              <span className="action-icon">📊</span>
              <span>View Reports</span>
            </button>
            <button className="action-btn secondary" onClick={logout}>
              <span className="action-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;