import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import '../../styles/guard/ShiftSchedule.css';

const ShiftSchedule = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { isExpanded } = useSidebar();
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8080/api';

  // State management
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  // Form state for adding/editing shifts
  const [shiftForm, setShiftForm] = useState({
    guardId: currentUser?.userID || '',
    guardName: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim(),
    date: new Date().toISOString().split('T')[0],
    shiftType: 'Morning',
    startTime: '06:00',
    endTime: '14:00',
    parkingArea: 'NGE Parking Area',
    status: 'Scheduled'
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      fetchShifts();
    }
  }, [currentWeek]);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await fetch(`${API_BASE_URL}/shifts?guardId=${currentUser?.userID}`);
      
      // Mock data for now
      const mockShifts = generateMockShifts();
      setShifts(mockShifts);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockShifts = () => {
    const startOfWeek = getStartOfWeek(currentWeek);
    const mockData = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      
      // Add some shifts (not all days)
      if (i % 2 === 0) {
        mockData.push({
          id: `shift-${i}`,
          guardId: currentUser?.userID || 'G001',
          guardName: `${currentUser?.firstName || 'Guard'} ${currentUser?.lastName || 'User'}`,
          date: date.toISOString().split('T')[0],
          shiftType: i % 4 === 0 ? 'Morning' : 'Afternoon',
          startTime: i % 4 === 0 ? '06:00' : '14:00',
          endTime: i % 4 === 0 ? '14:00' : '22:00',
          parkingArea: 'NGE Parking Area',
          status: date < new Date() ? 'Completed' : 'Scheduled'
        });
      }
    }
    
    return mockData;
  };

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getWeekDays = () => {
    const startOfWeek = getStartOfWeek(currentWeek);
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const getShiftForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.find(shift => shift.date === dateStr);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const handleAddShift = () => {
    setSelectedShift(null);
    setShiftForm({
      guardId: currentUser?.userID || '',
      guardName: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim(),
      date: new Date().toISOString().split('T')[0],
      shiftType: 'Morning',
      startTime: '06:00',
      endTime: '14:00',
      parkingArea: 'NGE Parking Area',
      status: 'Scheduled'
    });
    setShowAddModal(true);
  };

  const handleEditShift = (shift) => {
    setSelectedShift(shift);
    setShiftForm({
      guardId: shift.guardId,
      guardName: shift.guardName,
      date: shift.date,
      shiftType: shift.shiftType,
      startTime: shift.startTime,
      endTime: shift.endTime,
      parkingArea: shift.parkingArea,
      status: shift.status
    });
    setShowAddModal(true);
  };

  const handleSaveShift = async () => {
    try {
      // TODO: API call to save shift
      // const response = await fetch(`${API_BASE_URL}/shifts`, {
      //   method: selectedShift ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(shiftForm)
      // });

      // For now, just update local state
      if (selectedShift) {
        setShifts(shifts.map(s => s.id === selectedShift.id ? { ...selectedShift, ...shiftForm } : s));
      } else {
        const newShift = {
          id: `shift-${Date.now()}`,
          ...shiftForm
        };
        setShifts([...shifts, newShift]);
      }

      setShowAddModal(false);
      alert('Shift saved successfully!');
    } catch (error) {
      console.error('Error saving shift:', error);
      alert('Failed to save shift');
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if (!window.confirm('Are you sure you want to delete this shift?')) return;

    try {
      // TODO: API call to delete shift
      // await fetch(`${API_BASE_URL}/shifts/${shiftId}`, { method: 'DELETE' });

      setShifts(shifts.filter(s => s.id !== shiftId));
      alert('Shift deleted successfully!');
    } catch (error) {
      console.error('Error deleting shift:', error);
      alert('Failed to delete shift');
    }
  };

  const handleShiftTypeChange = (type) => {
    setShiftForm({
      ...shiftForm,
      shiftType: type,
      startTime: type === 'Morning' ? '06:00' : type === 'Afternoon' ? '14:00' : '22:00',
      endTime: type === 'Morning' ? '14:00' : type === 'Afternoon' ? '22:00' : '06:00'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getShiftStats = () => {
    const completed = shifts.filter(s => s.status === 'Completed').length;
    const scheduled = shifts.filter(s => s.status === 'Scheduled').length;
    const thisMonth = shifts.filter(s => {
      const shiftDate = new Date(s.date);
      return shiftDate.getMonth() === new Date().getMonth();
    }).length;

    const totalHours = shifts.reduce((acc, shift) => {
      const start = new Date(`2000-01-01T${shift.startTime}`);
      const end = new Date(`2000-01-01T${shift.endTime}`);
      const hours = (end - start) / (1000 * 60 * 60);
      return acc + (hours > 0 ? hours : hours + 24);
    }, 0);

    return { completed, scheduled, thisMonth, totalHours };
  };

  const weekDays = getWeekDays();
  const stats = getShiftStats();

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle="Shift Schedule" />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
          <div className="dashboard-container">
            
            {/* Page Header */}
            <div className="profile-page-header">
              <h1 className="profile-page-title">Shift Schedule</h1>
              <p className="profile-page-subtitle">Manage your work schedule and view upcoming shifts</p>
            </div>

            {/* Stats Cards */}
            <div className="shift-stats-grid">
              <div className="shift-stat-card">
                <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Completed Shifts</p>
                  <p className="stat-value">{stats.completed}</p>
                </div>
              </div>

              <div className="shift-stat-card">
                <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Scheduled Shifts</p>
                  <p className="stat-value">{stats.scheduled}</p>
                </div>
              </div>

              <div className="shift-stat-card">
                <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">Total Hours</p>
                  <p className="stat-value">{stats.totalHours}h</p>
                </div>
              </div>

              <div className="shift-stat-card">
                <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <p className="stat-label">This Month</p>
                  <p className="stat-value">{stats.thisMonth}</p>
                </div>
              </div>
            </div>

            {/* Weekly Calendar */}
            <div className="profile-section-card">
              <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <h3 className="section-title">Weekly Schedule</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button className="week-nav-btn" onClick={handlePreviousWeek}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                  <span className="week-label">
                    {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
                  </span>
                  <button className="week-nav-btn" onClick={handleNextWeek}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                  <button className="add-shift-btn" onClick={handleAddShift}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add Shift
                  </button>
                </div>
              </div>

              <div className="calendar-grid">
                {weekDays.map((day, index) => {
                  const shift = getShiftForDate(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isPast = day < new Date() && !isToday;

                  return (
                    <div key={index} className={`calendar-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}>
                      <div className="day-header">
                        <span className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="day-date">{day.getDate()}</span>
                      </div>
                      
                      {shift ? (
                        <div className={`shift-card ${shift.status.toLowerCase()}`}>
                          <div className="shift-badge">{shift.shiftType}</div>
                          <div className="shift-time">
                            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                          </div>
                          <div className="shift-location">{shift.parkingArea}</div>
                          <div className="shift-actions">
                            <button 
                              className="shift-action-btn edit"
                              onClick={() => handleEditShift(shift)}
                              title="Edit Shift"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button 
                              className="shift-action-btn delete"
                              onClick={() => handleDeleteShift(shift.id)}
                              title="Delete Shift"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="no-shift">No shift assigned</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Shifts List */}
            <div className="profile-section-card">
              <div className="section-header">
                <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                <h3 className="section-title">All Shifts</h3>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  Loading shifts...
                </div>
              ) : shifts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No shifts scheduled yet. Click "Add Shift" to create one.
                </div>
              ) : (
                <div className="shifts-table-container">
                  <table className="shifts-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Shift Type</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shifts.sort((a, b) => new Date(a.date) - new Date(b.date)).map(shift => (
                        <tr key={shift.id}>
                          <td>{new Date(shift.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td>
                            <span className={`shift-type-badge ${shift.shiftType.toLowerCase()}`}>
                              {shift.shiftType}
                            </span>
                          </td>
                          <td>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</td>
                          <td>{shift.parkingArea}</td>
                          <td>
                            <span className={`status-badge ${shift.status.toLowerCase()}`}>
                              {shift.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="table-action-btn edit"
                                onClick={() => handleEditShift(shift)}
                                title="Edit"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                              </button>
                              <button 
                                className="table-action-btn delete"
                                onClick={() => handleDeleteShift(shift.id)}
                                title="Delete"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Add/Edit Shift Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedShift ? 'Edit Shift' : 'Add New Shift'}</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={shiftForm.date}
                  onChange={(e) => setShiftForm({ ...shiftForm, date: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Shift Type</label>
                <div className="shift-type-options">
                  {['Morning', 'Afternoon', 'Night'].map(type => (
                    <button
                      key={type}
                      className={`shift-type-option ${shiftForm.shiftType === type ? 'active' : ''}`}
                      onClick={() => handleShiftTypeChange(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={shiftForm.startTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={shiftForm.endTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Parking Area</label>
                <select
                  value={shiftForm.parkingArea}
                  onChange={(e) => setShiftForm({ ...shiftForm, parkingArea: e.target.value })}
                  className="form-input"
                >
                  <option value="NGE Parking Area">NGE Parking Area</option>
                  <option value="Main Building">Main Building</option>
                  <option value="West Campus">West Campus</option>
                  <option value="East Campus">East Campus</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={shiftForm.status}
                  onChange={(e) => setShiftForm({ ...shiftForm, status: e.target.value })}
                  className="form-input"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveShift}>
                {selectedShift ? 'Update Shift' : 'Add Shift'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftSchedule;
