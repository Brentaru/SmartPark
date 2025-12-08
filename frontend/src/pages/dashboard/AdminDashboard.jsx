import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import AuthTopbar from '../../components/AuthTopbar';
import '../../styles/Dashboard.css';
import '../../styles/dashboard/AdminDashboard.css';
import { userAPI, parkingSlotAPI, parkingAreaAPI, parkingRecordAPI } from '../../api/api';
import { Box, Container, Typography, Card, CardContent, Grid, Tabs, Tab, Skeleton, CircularProgress } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';

// Lazy load heavy components
const UserManagement = lazy(() => import('../../components/dashboard/admin/UserManagement'));
const ParkingAreaManagement = lazy(() => import('../../components/dashboard/admin/ParkingAreaManagement'));
const SystemLogs = lazy(() => import('../../components/dashboard/admin/SystemLogs'));
const Reports = lazy(() => import('../../components/dashboard/admin/Reports'));

const AdminDashboard = () => {
  // const { user } = useAuth(); // Uncomment if needed
  const [activeTab, setActiveTab] = useState(0);
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

  const tabs = [
    { id: 0, label: 'Manage Users', icon: <GroupIcon /> },
    { id: 1, label: 'Parking Areas', icon: <LocalParkingIcon /> },
    { id: 2, label: 'System Logs', icon: <DescriptionIcon /> },
    { id: 3, label: 'Reports', icon: <AssessmentIcon /> }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="dashboard-layout">
      <AuthTopbar onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />
      
      <main className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1f2937' }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users, parking areas, and system settings
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', height: '100%' }}>
                <CardContent>
                  {loading ? (
                    <Box>
                      <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                      <Skeleton variant="text" width={60} height={30} />
                      <Skeleton variant="text" width={100} />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: '14px', 
                        backgroundColor: '#ede9fe',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <GroupIcon sx={{ fontSize: 32, color: '#7c3aed' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px', mb: 0.5 }}>
                          Total Users
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                          {stats.totalUsers}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', height: '100%' }}>
                <CardContent>
                  {loading ? (
                    <Box>
                      <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                      <Skeleton variant="text" width={60} height={30} />
                      <Skeleton variant="text" width={120} />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: '14px', 
                        backgroundColor: '#d1fae5',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <LocalParkingIcon sx={{ fontSize: 32, color: '#059669' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px', mb: 0.5 }}>
                          Parking Areas
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                          {stats.totalAreas}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', height: '100%' }}>
                <CardContent>
                  {loading ? (
                    <Box>
                      <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                      <Skeleton variant="text" width={60} height={30} />
                      <Skeleton variant="text" width={100} />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: '14px', 
                        backgroundColor: '#ddd6fe',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <DirectionsCarIcon sx={{ fontSize: 32, color: '#7c3aed' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px', mb: 0.5 }}>
                          Total Slots
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                          {stats.totalSlots}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {stats.occupiedSlots} occupied
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', height: '100%' }}>
                <CardContent>
                  {loading ? (
                    <Box>
                      <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                      <Skeleton variant="text" width={60} height={30} />
                      <Skeleton variant="text" width={120} />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ 
                        width: 64, 
                        height: 64, 
                        borderRadius: '14px', 
                        backgroundColor: '#fee2e2',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <DescriptionIcon sx={{ fontSize: 32, color: '#dc2626' }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px', mb: 0.5 }}>
                          Occupancy
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
                          {stats.totalSlots > 0 ? ((stats.occupiedSlots / stats.totalSlots) * 100).toFixed(1) : 0}%
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              {tabs.map((tab) => (
                <Tab 
                  key={tab.id} 
                  icon={tab.icon} 
                  iconPosition="start" 
                  label={tab.label}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    minHeight: 48
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ mt: 3 }}>
            <Suspense fallback={
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
              </Box>
            }>
              {activeTab === 0 && <UserManagement onUpdate={loadDashboardStats} />}
              {activeTab === 1 && <ParkingAreaManagement onUpdate={loadDashboardStats} />}
              {activeTab === 2 && <SystemLogs />}
              {activeTab === 3 && <Reports />}
            </Suspense>
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default AdminDashboard;
