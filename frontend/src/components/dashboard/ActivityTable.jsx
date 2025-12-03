import React from 'react';
import '../../styles/dashboard/ActivityTable.css';

const ActivityTable = ({ activities }) => {
  const getStatusBadge = (status) => {
    const statusClass = status.toLowerCase();
    return <span className={`status-badge status-${statusClass}`}>{status}</span>;
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleViewAll = () => {
    console.log('Navigate to full history page');
    // In real app: navigate('/history');
  };

  return (
    <div className="activity-table-container">
      <div className="table-header">
        <h2 className="table-title">Recent Parking Activity</h2>
        <button className="view-all-btn" onClick={handleViewAll}>View All</button>
      </div>
      
      <div className="table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time In</th>
              <th>Slot #</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activities && activities.length > 0 ? (
              activities.map((activity, index) => (
                <tr key={index}>
                  <td>{activity.date}</td>
                  <td>{activity.timeIn}</td>
                  <td>
                    <span className="slot-badge">{activity.slot}</span>
                  </td>
                  <td>{getStatusBadge(activity.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  No parking activity yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
