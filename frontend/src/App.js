import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Wrapper component to provide navigation handlers
function AppContent() {
  const navigate = useNavigate();

  // Navigation handlers
  const handleNavigateToLanding = () => navigate('/');
  const handleNavigateToLogin = () => navigate('/login');
  const handleNavigateToRegister = () => navigate('/register');
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

        {/* Dashboard Page */}
        <Route 
          path="/dashboard" 
          element={
            <Dashboard />
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
      <AppContent />
    </Router>
  );
}

export default App;