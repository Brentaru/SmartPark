import React, { useState } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import '../../styles/guard/ManageVehicle.css';

// Import modals
import VerifyVehicleModal from './modals/VerifyVehicleModal';
import RecordEntryModal from './modals/RecordEntryModal';
import RecordExitModal from './modals/RecordExitModal';
import VerifyAccessModal from './modals/VerifyAccessModal';
import AllVehiclesModal from './modals/AllVehiclesModal';

const ManageVehicle = () => {
  const { isExpanded } = useSidebar();
  
  // Modal states
  const [showVerifyVehicle, setShowVerifyVehicle] = useState(false);
  const [showRecordEntry, setShowRecordEntry] = useState(false);
  const [showRecordExit, setShowRecordExit] = useState(false);
  const [showVerifyAccess, setShowVerifyAccess] = useState(false);
  const [showAllVehicles, setShowAllVehicles] = useState(false);

  const quickActions = [
    {
      id: 'verify-vehicle',
      title: 'Verify Vehicle',
      description: 'Scan and verify vehicle registration',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      ),
      color: 'blue',
      onClick: () => setShowVerifyVehicle(true)
    },
    {
      id: 'record-entry',
      title: 'Record Entry Time',
      description: 'Log vehicle entry to parking area',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <polyline points="19 12 12 19 5 12"/>
        </svg>
      ),
      color: 'green',
      onClick: () => setShowRecordEntry(true)
    },
    {
      id: 'record-exit',
      title: 'Record Exit Time',
      description: 'Log vehicle exit from parking area',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="19" x2="12" y2="5"/>
          <polyline points="5 12 12 5 19 12"/>
        </svg>
      ),
      color: 'orange',
      onClick: () => setShowRecordExit(true)
    },
    {
      id: 'verify-access',
      title: 'Verify User Access',
      description: 'Check user parking permissions',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      color: 'purple',
      onClick: () => setShowVerifyAccess(true)
    },
    {
      id: 'view-all',
      title: 'View All Vehicles',
      description: 'Browse all registered vehicles',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      color: 'red',
      onClick: () => setShowAllVehicles(true)
    }
  ];

  return (
    <div className="dashboard-page manage-vehicle-container">
      <AuthTopbar pageTitle="Manage Vehicle" />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className={`dashboard-main ${isExpanded ? '' : 'sidebar-collapsed'}`}>
          <div className="dashboard-container">
            
            {/* Page Header */}
            <div className="page-header">
              <h1 className="page-title">Vehicle Management</h1>
              <p className="page-subtitle">Quick actions to manage and monitor vehicles in the parking area</p>
            </div>

            {/* Quick Actions Grid */}
            <div className="quick-actions-grid">
              {quickActions.map((action) => (
                <div 
                  key={action.id} 
                  className={`action-card action-card-${action.color}`}
                  onClick={action.onClick}
                >
                  <div className="action-card-header">
                    <div className={`action-icon action-icon-${action.color}`}>
                      {action.icon}
                    </div>
                  </div>
                  <div className="action-card-body">
                    <h3 className="action-title">{action.title}</h3>
                    <p className="action-description">{action.description}</p>
                  </div>
                  <div className="action-card-footer">
                    <button className="action-btn">
                      <span>Open</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics Section */}
            <div className="stats-section">
              <h2 className="section-title">Today's Overview</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Vehicles In</p>
                    <p className="stat-value">—</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <polyline points="19 12 12 19 5 12"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Total Entries</p>
                    <p className="stat-value">—</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Avg. Duration</p>
                    <p className="stat-value">—</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#f3f4f6', color: '#6b7280' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Violations</p>
                    <p className="stat-value">—</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modals */}
      {showVerifyVehicle && (
        <VerifyVehicleModal onClose={() => setShowVerifyVehicle(false)} />
      )}
      {showRecordEntry && (
        <RecordEntryModal onClose={() => setShowRecordEntry(false)} />
      )}
      {showRecordExit && (
        <RecordExitModal onClose={() => setShowRecordExit(false)} />
      )}
      {showVerifyAccess && (
        <VerifyAccessModal onClose={() => setShowVerifyAccess(false)} />
      )}
      {showAllVehicles && (
        <AllVehiclesModal onClose={() => setShowAllVehicles(false)} />
      )}
    </div>
  );
};

export default ManageVehicle;
