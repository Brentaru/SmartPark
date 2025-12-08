import React, { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import '../../styles/Dashboard.css';
import '../../styles/dashboard/AdminDashboard.css';
import { userAPI, parkingSlotAPI, parkingAreaAPI, parkingRecordAPI } from '../../api/api';

// Lazy load heavy components
const UserManagement = lazy(() => import('../../components/dashboard/admin/UserManagement'));

const AdminDashboard = () => {
  // const { user } = useAuth(); // Uncomment if needed
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    totalSlots: 0,
    occupiedSlots: 0,
    totalAreas: 0,
    activeRecords: 0
  });
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
        parkingRecordAPI.getAllRecords()
      ]);

      // Extract successful results
      const users = results[0].status === 'fulfilled' && results[0].value?.success ? results[0].value.data : [];
      const slots = results[1].status === 'fulfilled' && results[1].value?.success ? results[1].value.data : [];
      const areas = results[2].status === 'fulfilled' && results[2].value?.success ? results[2].value.data : [];
      const records = results[3].status === 'fulfilled' && results[3].value?.success ? results[3].value.data : [];

      setStats({
        totalUsers: users.length,
        pendingUsers: users.filter(u => !u.role || u.role === 'pending').length,
        totalSlots: slots.length,
        occupiedSlots: slots.filter(s => s.status === 'Occupied').length,
        totalAreas: areas.length,
        activeRecords: records.filter(r => !r.exitTime).length
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

  return (
    <div className="dashboard-layout">
      <AuthTopbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        <div className="admin-dashboard-container">
          {/* Header */}
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <p>Manage users, parking areas, and system settings</p>
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
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
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

          {/* User Management Content */}
          <div className="admin-content">
            <Suspense fallback={
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            }>
              <UserManagement onUpdate={loadDashboardStats} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
