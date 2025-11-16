import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AuthTopbar from '../components/AuthTopbar';
import '../styles/MyParkingSlots.css';

const MyParkingSlots = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Sample reservations data
  const reservations = [
    {
      id: 1,
      slot: 'A-23',
      status: 'ACTIVE',
      location: 'North Parking Area',
      date: 'Thursday, November 13, 2025',
      time: '09:00 - 17:00',
      vehicle: 'ABC-1234'
    },
    {
      id: 2,
      slot: 'B-15',
      status: 'UPCOMING',
      location: 'South Parking Area',
      date: 'Saturday, November 15, 2025',
      time: '08:00 - 12:00',
      vehicle: 'ABC-1234'
    }
  ];

  return (
    <div className="dashboard-page">
      <AuthTopbar pageTitle="My Parking Slots / Reservations" onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="dashboard-layout">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-closed'}`}>
          <div className="dashboard-container">
            {/* Page Header */}
            <div className="parking-slots-header">
              <div>
                <h1 className="parking-slots-title">My Parking Slots / Reservations</h1>
                <p className="parking-slots-subtitle">Manage your active and upcoming parking slots</p>
              </div>
              <button className="new-reservation-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Reservation
              </button>
            </div>

            {/* Reservations Grid */}
            <div className="reservations-grid">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="reservation-card">
                  <div className="reservation-card-header">
                    <div className="reservation-slot-info">
                      <h3 className="slot-title">Slot {reservation.slot}</h3>
                      <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                        {reservation.status}
                      </span>
                    </div>
                    <button className="close-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>

                  <div className="reservation-card-body">
                    <div className="reservation-info-row">
                      <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/>
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/>
                      </svg>
                      <span>{reservation.location}</span>
                    </div>

                    <div className="reservation-info-row">
                      <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>{reservation.date}</span>
                    </div>

                    <div className="reservation-info-row">
                      <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>{reservation.time}</span>
                    </div>

                    <div className="reservation-info-row">
                      <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="11" width="14" height="10" rx="2"/>
                        <circle cx="12" cy="16" r="2"/>
                        <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                      <span>{reservation.vehicle}</span>
                    </div>
                  </div>

                  <div className="reservation-card-footer">
                    <button className="modify-btn">Modify Reservation</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyParkingSlots;
