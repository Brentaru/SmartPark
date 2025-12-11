import React, { useState, useEffect } from 'react';
import { parkingRecordAPI, parkingSlotAPI, parkingAreaAPI, userAPI } from '../../../api/api';
import '../../../styles/dashboard/admin/Reports.css';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('usage');
  const [dateRange, setDateRange] = useState('week');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    generateReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, dateRange]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const [recordsResult, slotsResult, areasResult, usersResult] = await Promise.all([
        parkingRecordAPI.getAllRecords(),
        parkingSlotAPI.getAllSlots(),
        parkingAreaAPI.getAllAreas(),
        userAPI.getAllUsers()
      ]);

      const records = recordsResult.success ? recordsResult.data : [];
      const slots = slotsResult.success ? slotsResult.data : [];
      const areas = areasResult.success ? areasResult.data : [];
      const users = usersResult.success ? usersResult.data : [];

      let data;
      switch(reportType) {
        case 'usage':
          data = generateUsageReport(records, slots);
          break;
        case 'occupancy':
          data = generateOccupancyReport(slots, areas);
          break;
        case 'user-activity':
          data = generateUserActivityReport(records, users);
          break;
        case 'revenue':
          data = generateRevenueReport(records);
          break;
        default:
          data = {};
      }

      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateUsageReport = (records, slots) => {
    const filteredRecords = filterByDateRange(records, dateRange);

    const totalSlots = slots.length;
    const occupiedSlots = slots.filter(s => s.status === 'Occupied').length;
    const availableSlots = slots.filter(s => s.status === 'Available').length;
    const totalSessions = filteredRecords.length;
    const activeSessions = filteredRecords.filter(r => !r.exitTime).length;
    const completedSessions = filteredRecords.filter(r => r.exitTime).length;

    // Calculate average duration
    const completedWithDuration = filteredRecords.filter(r => r.exitTime && r.entryTime);
    const avgDuration = completedWithDuration.length > 0
      ? completedWithDuration.reduce((sum, r) => {
          const duration = new Date(r.exitTime) - new Date(r.entryTime);
          return sum + duration;
        }, 0) / completedWithDuration.length
      : 0;

    // Calculate daily trend
    const dailyTrend = getDailyTrend(filteredRecords);
    const hourlyDistribution = getHourlyDistribution(filteredRecords);

    return {
      totalSlots,
      occupiedSlots,
      availableSlots,
      occupancyRate: ((occupiedSlots / totalSlots) * 100).toFixed(1),
      totalSessions,
      activeSessions,
      completedSessions,
      avgDuration: formatDuration(avgDuration),
      peakHours: calculatePeakHours(filteredRecords),
      dailyTrend,
      hourlyDistribution
    };
  };

  const generateOccupancyReport = (slots, areas) => {
    const areaStats = areas.map(area => {
      const areaSlots = slots.filter(s => s.parkingAreaID === area.areaID);
      const occupied = areaSlots.filter(s => s.status === 'Occupied').length;
      const total = areaSlots.length;
      
      return {
        areaName: area.areaName,
        total,
        occupied,
        available: total - occupied,
        occupancyRate: total > 0 ? ((occupied / total) * 100).toFixed(1) : 0
      };
    });

    return { areaStats };
  };

  const generateUserActivityReport = (records, users) => {
    const filteredRecords = filterByDateRange(records, dateRange);
    
    const userStats = users.map(user => {
      const userRecords = filteredRecords.filter(r => r.userID === user.userID);
      return {
        userID: user.userID,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        totalVisits: userRecords.length,
        activeSession: userRecords.some(r => !r.exitTime)
      };
    }).filter(u => u.totalVisits > 0)
      .sort((a, b) => b.totalVisits - a.totalVisits)
      .slice(0, 10);

    return {
      totalActiveUsers: userStats.length,
      topUsers: userStats,
      roleDistribution: calculateRoleDistribution(users)
    };
  };

  const generateRevenueReport = (records) => {
    const filteredRecords = filterByDateRange(records, dateRange);
    const completedSessions = filteredRecords.filter(r => r.exitTime && r.entryTime);
    
    // Assuming $2 per hour rate
    const hourlyRate = 2;
    const totalRevenue = completedSessions.reduce((sum, r) => {
      const duration = (new Date(r.exitTime) - new Date(r.entryTime)) / (1000 * 60 * 60);
      return sum + (duration * hourlyRate);
    }, 0);

    return {
      totalRevenue: totalRevenue.toFixed(2),
      totalTransactions: completedSessions.length,
      avgTransactionValue: (totalRevenue / completedSessions.length || 0).toFixed(2),
      estimatedMonthly: (totalRevenue * (30 / getDaysInRange())).toFixed(2)
    };
  };

  const filterByDateRange = (records, range) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch(range) {
      case 'today':
        cutoffDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return records;
    }

    return records.filter(r => {
      const recordDate = new Date(r.entryTime);
      return recordDate >= cutoffDate;
    });
  };

  const calculatePeakHours = (records) => {
    const hourCounts = new Array(24).fill(0);
    records.forEach(r => {
      const hour = new Date(r.entryTime).getHours();
      hourCounts[hour]++;
    });

    const maxCount = Math.max(...hourCounts);
    const peakHour = hourCounts.indexOf(maxCount);
    
    return `${peakHour}:00 - ${peakHour + 1}:00 (${maxCount} entries)`;
  };

  const calculateRoleDistribution = (users) => {
    const distribution = {};
    users.forEach(u => {
      const role = u.role || 'Pending';
      distribution[role] = (distribution[role] || 0) + 1;
    });
    return distribution;
  };

  const getDailyTrend = (records) => {
    const days = [];
    const daysCount = getDaysInRange();
    const now = new Date();
    
    for (let i = Math.min(daysCount - 1, 6); i >= 0; i--) {
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
        day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayRecords.length
      });
    }
    
    return days;
  };

  const getHourlyDistribution = (records) => {
    const hourCounts = Array(24).fill(0);
    records.forEach(r => {
      const hour = new Date(r.entryTime).getHours();
      hourCounts[hour]++;
    });
    
    return hourCounts.map((count, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      count
    }));
  };

  const formatDuration = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getDaysInRange = () => {
    const map = { today: 1, week: 7, month: 30, year: 365 };
    return map[dateRange] || 7;
  };

  const exportReport = () => {
    const reportContent = JSON.stringify(reportData, null, 2);
    const blob = new Blob([reportContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Generating report...</p>
      </div>
    );
  }

  return (
    <div className="reports">
      <div className="reports-header">
        <h2>Reports & Analytics</h2>
        <div className="report-actions">
          <button className="btn-secondary" onClick={exportReport}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
          <button className="btn-primary" onClick={generateReport}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="usage">Usage Statistics</option>
            <option value="occupancy">Occupancy by Area</option>
            <option value="user-activity">User Activity</option>
            <option value="revenue">Revenue Estimate</option>
          </select>
        </div>

        <div className="control-group">
          <label>Date Range:</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="report-content">
        {reportType === 'usage' && reportData && (
          <div className="usage-report">
            <h3>Parking Usage Statistics</h3>
            <div className="stats-grid-report">
              <div className="stat-card-report">
                <div className="stat-label">Total Slots</div>
                <div className="stat-value">{reportData.totalSlots}</div>
              </div>
              <div className="stat-card-report">
                <div className="stat-label">Occupied</div>
                <div className="stat-value">{reportData.occupiedSlots}</div>
              </div>
              <div className="stat-card-report">
                <div className="stat-label">Available</div>
                <div className="stat-value">{reportData.availableSlots}</div>
              </div>
              <div className="stat-card-report highlight">
                <div className="stat-label">Occupancy Rate</div>
                <div className="stat-value">{reportData.occupancyRate}%</div>
              </div>
            </div>

            <div className="report-section">
              <h4>Session Statistics</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Total Sessions:</span>
                  <span className="info-value">{reportData.totalSessions}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Active Sessions:</span>
                  <span className="info-value">{reportData.activeSessions}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Completed Sessions:</span>
                  <span className="info-value">{reportData.completedSessions}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Average Duration:</span>
                  <span className="info-value">{reportData.avgDuration}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Peak Hours:</span>
                  <span className="info-value">{reportData.peakHours}</span>
                </div>
              </div>
            </div>

            {/* Charts Row - Daily Trend and Hourly Distribution Side by Side */}
            <div className="charts-row-container">
              {/* Daily Trend Chart */}
              {reportData.dailyTrend && reportData.dailyTrend.length > 0 && (
                <div className="report-section chart-section-half">
                  <h4>Daily Parking Trend</h4>
                  <div className="chart-container-report">
                  <div className="bar-chart-report">
                    {(() => {
                      const maxCount = Math.max(...reportData.dailyTrend.map(d => d.count), 1);
                      return reportData.dailyTrend.map((day, index) => (
                        <div key={index} className="bar-item-report">
                          <div className="bar-wrapper-report">
                            <div 
                              className="bar-fill-report"
                              style={{ height: `${(day.count / maxCount) * 100}%` }}
                            >
                              <span className="bar-value-report">{day.count}</span>
                            </div>
                          </div>
                          <div className="bar-label-report">{day.day}</div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
              )}

              {/* Hourly Distribution Line Chart */}
              {reportData.hourlyDistribution && reportData.hourlyDistribution.length > 0 && (
                <div className="report-section chart-section-half">
                  <h4>Hourly Entry Distribution</h4>
                  <div className="chart-container-report">
                    <div className="line-chart">
                      <svg width="100%" height="280" viewBox="0 0 800 280">
                      {(() => {
                        const data = reportData.hourlyDistribution;
                        const maxCount = Math.max(...data.map(d => d.count), 1);
                        const padding = { top: 20, right: 40, bottom: 40, left: 50 };
                        const chartWidth = 800 - padding.left - padding.right;
                        const chartHeight = 280 - padding.top - padding.bottom;
                        const pointSpacing = chartWidth / (data.length - 1);

                        // Create path points
                        const points = data.map((d, i) => ({
                          x: padding.left + (i * pointSpacing),
                          y: padding.top + chartHeight - (d.count / maxCount * chartHeight)
                        }));

                        // Create line path
                        const linePath = points.map((p, i) => 
                          `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                        ).join(' ');

                        // Create area path
                        const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`;

                        return (
                          <>
                            {/* Grid lines */}
                            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                              <g key={i}>
                                <line
                                  x1={padding.left}
                                  y1={padding.top + chartHeight * (1 - ratio)}
                                  x2={padding.left + chartWidth}
                                  y2={padding.top + chartHeight * (1 - ratio)}
                                  stroke="#e5e7eb"
                                  strokeWidth="1"
                                />
                                <text
                                  x={padding.left - 10}
                                  y={padding.top + chartHeight * (1 - ratio) + 4}
                                  textAnchor="end"
                                  fontSize="11"
                                  fill="#6b7280"
                                >
                                  {Math.round(maxCount * ratio)}
                                </text>
                              </g>
                            ))}

                            {/* Area fill */}
                            <path
                              d={areaPath}
                              fill="#4f46e5"
                              fillOpacity="0.1"
                            />

                            {/* Line */}
                            <path
                              d={linePath}
                              fill="none"
                              stroke="#4f46e5"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            {/* Data points */}
                            {points.map((p, i) => (
                              <g key={i}>
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r="4"
                                  fill="white"
                                  stroke="#4f46e5"
                                  strokeWidth="2"
                                />
                                {data[i].count > 0 && (
                                  <text
                                    x={p.x}
                                    y={p.y - 10}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#374151"
                                    fontWeight="500"
                                  >
                                    {data[i].count}
                                  </text>
                                )}
                              </g>
                            ))}

                            {/* X-axis labels (every 3 hours) */}
                            {data.filter((_, i) => i % 3 === 0).map((d, i) => {
                              const actualIndex = i * 3;
                              return (
                                <text
                                  key={actualIndex}
                                  x={padding.left + (actualIndex * pointSpacing)}
                                  y={padding.top + chartHeight + 25}
                                  textAnchor="middle"
                                  fontSize="11"
                                  fill="#6b7280"
                                >
                                  {d.hour}
                                </text>
                              );
                            })}
                          </>
                        );
                      })()}
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {reportType === 'occupancy' && reportData && (
          <div className="occupancy-report">
            <h3>Occupancy by Parking Area</h3>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Area Name</th>
                  <th>Total Slots</th>
                  <th>Occupied</th>
                  <th>Available</th>
                  <th>Occupancy Rate</th>
                </tr>
              </thead>
              <tbody>
                {reportData.areaStats.map((area, idx) => (
                  <tr key={idx}>
                    <td>{area.areaName}</td>
                    <td>{area.total}</td>
                    <td>{area.occupied}</td>
                    <td>{area.available}</td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${area.occupancyRate}%` }}
                        ></div>
                        <span className="progress-text">{area.occupancyRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'user-activity' && reportData && (
          <div className="user-activity-report">
            <h3>User Activity Report</h3>
            
            <div className="stats-grid-report">
              <div className="stat-card-report">
                <div className="stat-label">Active Users</div>
                <div className="stat-value">{reportData.totalActiveUsers}</div>
              </div>
              {Object.entries(reportData.roleDistribution).map(([role, count]) => (
                <div key={role} className="stat-card-report">
                  <div className="stat-label">{role}s</div>
                  <div className="stat-value">{count}</div>
                </div>
              ))}
            </div>

            {/* Role Distribution Chart */}
            {reportData.roleDistribution && Object.keys(reportData.roleDistribution).length > 0 && (
              <div className="report-section">
                <h4>User Role Distribution</h4>
                <div className="chart-container-report">
                  <div className="horizontal-bar-chart">
                    {(() => {
                      const total = Object.values(reportData.roleDistribution).reduce((sum, val) => sum + val, 0);
                      const colors = { 'Admin': '#8b5cf6', 'Student': '#10b981', 'Staff': '#f59e0b', 'Guard': '#3b82f6', 'Pending': '#ef4444' };
                      return Object.entries(reportData.roleDistribution).map(([role, count], index) => (
                        <div key={role} className="horizontal-bar-item">
                          <div className="horizontal-bar-label">{role}</div>
                          <div className="horizontal-bar-wrapper">
                            <div 
                              className="horizontal-bar-fill"
                              style={{ 
                                width: `${(count / total) * 100}%`,
                                backgroundColor: colors[role] || '#6b7280'
                              }}
                            >
                              <span className="horizontal-bar-value">{count} ({((count / total) * 100).toFixed(1)}%)</span>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}

            <div className="report-section">
              <h4>Top 10 Most Active Users</h4>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Total Visits</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.topUsers.map((user, idx) => (
                    <tr key={user.userID}>
                      <td>#{idx + 1}</td>
                      <td>{user.userID}</td>
                      <td>{user.name}</td>
                      <td>{user.role || 'Pending'}</td>
                      <td>{user.totalVisits}</td>
                      <td>
                        <span className={`status-badge ${user.activeSession ? 'status-active' : 'status-inactive'}`}>
                          {user.activeSession ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'revenue' && reportData && (
          <div className="revenue-report">
            <h3>Revenue Estimate</h3>
            <div className="stats-grid-report">
              <div className="stat-card-report highlight">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">${reportData.totalRevenue}</div>
              </div>
              <div className="stat-card-report">
                <div className="stat-label">Transactions</div>
                <div className="stat-value">{reportData.totalTransactions}</div>
              </div>
              <div className="stat-card-report">
                <div className="stat-label">Avg Transaction</div>
                <div className="stat-value">${reportData.avgTransactionValue}</div>
              </div>
              <div className="stat-card-report">
                <div className="stat-label">Est. Monthly</div>
                <div className="stat-value">${reportData.estimatedMonthly}</div>
              </div>
            </div>

            <div className="report-note">
              <p>💡 Revenue calculated at $2/hour rate. Actual rates may vary.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
