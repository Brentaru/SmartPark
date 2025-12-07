import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ParkingHistory from './pages/ParkingHistory';
import MyParkingSlots from './pages/MyParkingSlots';
import MyProfile from './pages/MyProfile';
import ProfileSettings from './pages/ProfileSettings';
import VehicleRegistration from './pages/VehicleRegistration';
import ProtectedRoute from './components/ProtectedRoute';

// Wrapper component to provide navigation handlers
function AppContent() {
  const navigate = useNavigate();

  // Navigation handlers
  const handleNavigateToLanding = () => navigate('/');
  const handleNavigateToLogin = () => navigate('/login');
  const handleNavigateToRegister = () => navigate('/register');
  const handleNavigateToForgotPassword = () => navigate('/forgot-password');
  const handleNavigateToDashboard = () => navigate('/dashboard');

  return (
    <div className="App">
      <Routes>
        {/* Landing Page */}
        <Route 
          path="/" 
          element={
            <Landing 
              onNavigateToLogin={handleNavigateToLogin}
              onNavigateToRegister={handleNavigateToRegister}
            />
          } 
        />

        {/* Login Page */}
        <Route 
          path="/login" 
          element={
            <Login 
              onNavigateToRegister={handleNavigateToRegister}
              onNavigateToLanding={handleNavigateToLanding}
              onNavigateToDashboard={handleNavigateToDashboard}
              onNavigateToForgotPassword={handleNavigateToForgotPassword}
            />
          } 
        />

        {/* Register Page */}
        <Route 
          path="/register" 
          element={
            <Register 
              onNavigateToLogin={handleNavigateToLogin}
              onNavigateToLanding={handleNavigateToLanding}
              onNavigateToDashboard={handleNavigateToDashboard}
            />
          } 
        />

        {/* Forgot Password Page */}
        <Route 
          path="/forgot-password" 
          element={
            <ForgotPassword 
              onNavigateToLogin={handleNavigateToLogin}
              onNavigateToLanding={handleNavigateToLanding}
            />
          } 
        />

        {/* Reset Password Page */}
        <Route 
          path="/reset-password" 
          element={
            <ResetPassword 
              onNavigateToLogin={handleNavigateToLogin}
              onNavigateToLanding={handleNavigateToLanding}
            />
          } 
        />

        {/* Dashboard Page (protected) - with nested routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Vehicle Registration (protected) */}
        <Route
          path="/vehicle-registration"
          element={
            <ProtectedRoute>
              <VehicleRegistration />
            </ProtectedRoute>
          }
        />
        
        {/* Parking History Page (protected) */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <ParkingHistory />
            </ProtectedRoute>
          }
        />

        {/* My Parking Slots / Reservations (protected) */}
        <Route
          path="/my-slots"
          element={
            <ProtectedRoute>
              <MyParkingSlots />
            </ProtectedRoute>
          }
        />

        {/* My Profile (View Mode - protected) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        {/* Profile Settings (Edit Mode - protected) */}
        <Route
          path="/profile-settings"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* 404 - Redirect to Landing */}
        <Route 
          path="*" 
          element={
            <Landing 
              onNavigateToLogin={handleNavigateToLogin}
              onNavigateToRegister={handleNavigateToRegister}
            />
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;