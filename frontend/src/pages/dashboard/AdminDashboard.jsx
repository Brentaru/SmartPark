import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import { useSidebar } from '../../context/SidebarContext';
import '../../styles/Dashboard.css';
import '../../styles/dashboard/AdminDashboard.css';
import { userAPI, parkingSlotAPI, parkingAreaAPI, parkingRecordAPI, vehicleAPI } from '../../api/api';

const AdminDashboard = () => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalSlots: 0,
    occupiedSlots: 0,
    totalAreas: 0,
    activeRecords: 0
  });
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [areas, setAreas] = useState([]);
  const [users, setUsers] = useState([]);
  const [vehicleToUserMap, setVehicleToUserMap] = useState({});

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Load data in parallel with error handling for each
      const results = await Promise.allSettled([
        userAPI.getAllUsers(),
        parkingSlotAPI.getAllSlots(),
        parkingAreaAPI.getAllAreas(),
        parkingRecordAPI.getAllRecords(),
        vehicleAPI.getAllVehicles()
      ]);

      // Extract successful results
      const users = results[0].status === 'fulfilled' && results[0].value?.success ? results[0].value.data : [];
      const slots = results[1].status === 'fulfilled' && results[1].value?.success ? results[1].value.data : [];
      const areasData = results[2].status === 'fulfilled' && results[2].value?.success ? results[2].value.data : [];
      const recordsData = results[3].status === 'fulfilled' && results[3].value?.success ? results[3].value.data : [];
      const vehicles = results[4].status === 'fulfilled' && results[4].value?.success ? results[4].value.data : [];

      // Create vehicle to user mapping
      const vehicleMap = {};
      vehicles.forEach(vehicle => {
        if (vehicle.userID) {
          vehicleMap[vehicle.vehicleID] = vehicle.userID;
        }
      });

      setRecords(recordsData);
      setAreas(areasData);
      setUsers(users);
      setVehicleToUserMap(vehicleMap);

      setStats({
        totalUsers: users.length,
        pendingUsers: users.filter(u => !u.role || u.role === 'pending').length,
        totalSlots: slots.length,
        occupiedSlots: slots.filter(s => s.status === 'Occupied').length,
        totalAreas: areasData.length,
        activeRecords: recordsData.filter(r => !r.exitTime).length
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Set default stats on error
      setStats({
        totalUsers: 0,
        pendingUsers: 0,
        totalSlots: 0,
        occupiedSlots: 0,
        totalAreas: 0,
        activeRecords: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (vehicleID) => {
    const userID = vehicleToUserMap[vehicleID];
    if (!userID) return 'Unknown User';
    const user = users.find(u => u.userID === userID);
    if (!user) return 'Unknown User';
    const fullName = `${user.fname || ''} ${user.lname || ''}`.trim();
    return fullName || user.email || user.userID || 'Unknown User';
  };

  // Calculate occupancy trend for last 7 days
  const getOccupancyTrend = () => {
    const days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const dayRecords = records.filter(r => {
        const entryTime = new Date(r.entryTime);
        return entryTime >= date && entryTime < nextDate;
      });
      
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayRecords.length
      });
    }
    
    return days;
  };

  // Calculate area distribution
  const getAreaDistribution = () => {
    return areas.map(area => ({
      name: area.areaName,
      value: area.capacity || 0
    })).filter(a => a.value > 0);
  };

  const occupancyTrend = getOccupancyTrend();
  const areaDistribution = getAreaDistribution();
  const maxOccupancy = Math.max(...occupancyTrend.map(d => d.count), 1);

  return (
    <div className="dashboard-layout">
      <AuthTopbar onToggleSidebar={toggleSidebar} sidebarOpen={isExpanded} />
      <Sidebar isOpen={isExpanded} onToggle={toggleSidebar} />
      
      <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-closed'}`}>
        <div className="admin-dashboard-container">
          {/* Header */}
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <p>System overview and analytics</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              {loading ? (
                <div className="stat-skeleton">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-text"></div>
                </div>
              ) : (
                <>
                  <div className="stat-icon purple">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">{stats.totalUsers}</div>
                  </div>
                </>
              )}
            </div>

            <div className="stat-card">
              {loading ? (
                <div className="stat-skeleton">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-text"></div>
                </div>
              ) : (
                <>
                  <div className="stat-icon green">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">Parking Areas</div>
                    <div className="stat-value">{stats.totalAreas}</div>
                  </div>
                </>
              )}
            </div>

            <div className="stat-card">
              {loading ? (
                <div className="stat-skeleton">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-text"></div>
                </div>
              ) : (
                <>
                  <div className="stat-icon purple-light">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">Total Slots</div>
                    <div className="stat-value">{stats.totalSlots}</div>
                    <div className="stat-sublabel">{stats.occupiedSlots} occupied</div>
                  </div>
                </>
              )}
            </div>

            <div className="stat-card">
              {loading ? (
                <div className="stat-skeleton">
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-text"></div>
                </div>
              ) : (
                <>
                  <div className="stat-icon red">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">Occupancy</div>
                    <div className="stat-value">
                      {stats.totalSlots > 0 ? ((stats.occupiedSlots / stats.totalSlots) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            {/* Occupancy Trend Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3>Weekly Parking Activity</h3>
                  <p>Last 7 days entry count</p>
                </div>
                {!loading && (
                  <div className="chart-stats">
                    <div className="chart-stat-item">
                      <span className="chart-stat-label">Total</span>
                      <span className="chart-stat-value">{occupancyTrend.reduce((sum, d) => sum + d.count, 0)}</span>
                    </div>
                    <div className="chart-stat-item">
                      <span className="chart-stat-label">Avg</span>
                      <span className="chart-stat-value">{Math.round(occupancyTrend.reduce((sum, d) => sum + d.count, 0) / occupancyTrend.length)}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="chart-container">
                {loading ? (
                  <div className="chart-loading">Loading...</div>
                ) : (
                  <div className="bar-chart">
                    {/* Trend line */}
                    <div className="chart-grid">
                      {[0, 25, 50, 75, 100].map((percent) => (
                        <div key={percent} className="grid-line" style={{ bottom: `${percent}%` }}>
                          <span className="grid-label">{Math.round((maxOccupancy * percent) / 100)}</span>
                        </div>
                      ))}
                    </div>
                    {/* Average line */}
                    <div 
                      className="average-line" 
                      style={{ 
                        bottom: `${(occupancyTrend.reduce((sum, d) => sum + d.count, 0) / occupancyTrend.length / maxOccupancy) * 100}%` 
                      }}
                    >
                      <span className="average-label">Avg</span>
                    </div>
                    {occupancyTrend.map((day, index) => (
                      <div key={index} className="bar-item">
                        <div className="bar-wrapper">
                          <div 
                            className="bar-fill"
                            style={{ 
                              height: `${(day.count / maxOccupancy) * 100}%`,
                              animationDelay: `${index * 0.1}s`
                            }}
                          >
                            <span className="bar-value">{day.count}</span>
                          </div>
                        </div>
                        <div className="bar-label">{day.day}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Area Distribution Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3>Parking Area Capacity</h3>
                  <p>Distribution by area</p>
                </div>
              </div>
              <div className="chart-container">
                {loading ? (
                  <div className="chart-loading">Loading...</div>
                ) : areaDistribution.length > 0 ? (
                  <div className="donut-chart">
                    <svg viewBox="0 0 200 200" className="donut-svg">
                      {/* Background circle */}
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#f3f4f6" strokeWidth="30" />
                      {(() => {
                        const total = areaDistribution.reduce((sum, a) => sum + a.value, 0);
                        let currentAngle = 0;
                        const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
                        
                        return areaDistribution.map((area, index) => {
                          const percentage = area.value / total;
                          const angle = percentage * 360;
                          const largeArc = angle > 180 ? 1 : 0;
                          
                          const startX = 100 + 70 * Math.cos((currentAngle - 90) * Math.PI / 180);
                          const startY = 100 + 70 * Math.sin((currentAngle - 90) * Math.PI / 180);
                          const endX = 100 + 70 * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
                          const endY = 100 + 70 * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
                          
                          const innerStartX = 100 + 40 * Math.cos((currentAngle - 90) * Math.PI / 180);
                          const innerStartY = 100 + 40 * Math.sin((currentAngle - 90) * Math.PI / 180);
                          const innerEndX = 100 + 40 * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
                          const innerEndY = 100 + 40 * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
                          
                          const path = `
                            M ${startX} ${startY}
                            A 70 70 0 ${largeArc} 1 ${endX} ${endY}
                            L ${innerEndX} ${innerEndY}
                            A 40 40 0 ${largeArc} 0 ${innerStartX} ${innerStartY}
                            Z
                          `;
                          
                          const previousAngle = currentAngle;
                          currentAngle += angle;
                          
                          return (
                            <g key={index}>
                              <path
                                d={path}
                                fill={colors[index % colors.length]}
                                className="donut-segment"
                                style={{ animationDelay: `${index * 0.1}s` }}
                              />
                              {percentage > 0.08 && (
                                <text
                                  x={100 + 55 * Math.cos((previousAngle + angle / 2 - 90) * Math.PI / 180)}
                                  y={100 + 55 * Math.sin((previousAngle + angle / 2 - 90) * Math.PI / 180)}
                                  textAnchor="middle"
                                  fontSize="11"
                                  fontWeight="600"
                                  fill="white"
                                >
                                  {(percentage * 100).toFixed(0)}%
                                </text>
                              )}
                            </g>
                          );
                        });
                      })()}
                      {/* Center circle with glow effect */}
                      <circle cx="100" cy="100" r="38" fill="white" />
                      <text x="100" y="95" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1f2937">
                        {stats.totalSlots}
                      </text>
                      <text x="100" y="110" textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="500">
                        Total Slots
                      </text>
                    </svg>
                    <div className="donut-legend">
                      {areaDistribution.map((area, index) => {
                        const total = areaDistribution.reduce((sum, a) => sum + a.value, 0);
                        const percentage = ((area.value / total) * 100).toFixed(1);
                        return (
                          <div key={index} className="legend-item">
                            <div className="legend-info">
                              <span 
                                className="legend-color" 
                                style={{ backgroundColor: ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'][index % 5] }}
                              ></span>
                              <span className="legend-label">{area.name}</span>
                            </div>
                            <div className="legend-stats">
                              <span className="legend-value">{area.value}</span>
                              <span className="legend-percent">{percentage}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="chart-empty">No area data available</div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {records.slice(0, 5).map((record, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">
                      {getUserName(record.vehicleID)} {record.exitTime ? 'exited' : 'entered'} Slot #{record.slotID}
                    </div>
                    <div className="activity-time">
                      {new Date(record.entryTime).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              {records.length === 0 && (
                <div className="activity-empty">No recent activity</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
