import React from 'react';
import ParkingInfoCard from './ParkingInfoCard';
import '../styles/ParkingOverview.css';

const ParkingOverview = ({ userRole, parkingData }) => {
  // Icons as reusable components
  const icons = {
    parking: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2"/>
        <circle cx="12" cy="16" r="2"/>
        <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    alert: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    grid: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  };

  // Different card configurations based on role
  const getCardsForRole = () => {
    switch(userRole) {
      case 'student':
        return [
          {
            icon: icons.parking,
            title: 'My Parking Slot',
            value: parkingData?.currentSlot || 'No Active Slot',
            subtitle: parkingData?.slotLocation || 'Reserve a slot to get started',
            status: parkingData?.currentSlot ? 'active' : 'info'
          },
          {
            icon: icons.clock,
            title: 'Time Remaining',
            value: parkingData?.timeRemaining || '0h 0m',
            subtitle: parkingData?.expiresAt || 'No active reservation',
            status: parkingData?.timeRemaining ? 'warning' : 'info'
          },
          {
            icon: icons.check,
            title: 'Total Reservations',
            value: parkingData?.totalReservations || '0',
            subtitle: 'This month',
            status: 'info'
          },
        ];
      
      case 'staff':
        return [
          {
            icon: icons.grid,
            title: 'Total Slots',
            value: parkingData?.totalSlots || '0',
            subtitle: `${parkingData?.availableSlots || 0} available`,
            status: 'info'
          },
          {
            icon: icons.users,
            title: 'Active Users',
            value: parkingData?.activeUsers || '0',
            subtitle: 'Currently parked',
            status: 'active'
          },
          {
            icon: icons.alert,
            title: 'Violations',
            value: parkingData?.violations || '0',
            subtitle: 'This week',
            status: parkingData?.violations > 0 ? 'danger' : 'info'
          },
        ];
      
      case 'guard':
        return [
          {
            icon: icons.parking,
            title: 'Vehicles Logged',
            value: parkingData?.vehiclesLogged || '0',
            subtitle: 'Today',
            status: 'active'
          },
          {
            icon: icons.grid,
            title: 'Available Slots',
            value: parkingData?.availableSlots || '0',
            subtitle: `Out of ${parkingData?.totalSlots || 0} total`,
            status: 'info'
          },
          {
            icon: icons.alert,
            title: 'Violations Recorded',
            value: parkingData?.violations || '0',
            subtitle: 'This week',
            status: parkingData?.violations > 0 ? 'warning' : 'info'
          },
        ];
      
      default:
        return [];
    }
  };

  const cards = getCardsForRole();

  return (
    <div className="parking-overview">
      <h2 className="overview-title">Parking Overview</h2>
      <div className="overview-grid">
        {cards.map((card, index) => (
          <ParkingInfoCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            status={card.status}
          />
        ))}
      </div>
    </div>
  );
};

export default ParkingOverview;
