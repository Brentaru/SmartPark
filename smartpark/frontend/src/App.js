import './App.css';
import { useState } from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [currentPage, setCurrentPage] = useState('landing'); // Changed this

  const handleOpenLogin = () => {
    setAuthView('login');
    setShowAuthModal(true);
    setIsClosing(false);
  };

  const handleOpenRegister = () => {
    setAuthView('register');
    setShowAuthModal(true);
    setIsClosing(false);
  };

  const handleCloseAuth = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowAuthModal(false);
      setIsClosing(false);
    }, 500);
  };

  const handleSwitchToRegister = () => {
    setAuthView('register');
  };

  const handleSwitchToLogin = () => {
    setAuthView('login');
  };

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard'); // Go to dashboard
    handleCloseAuth();
  };

  const handleLogout = () => {
    setCurrentPage('landing'); // Go back to landing
  };

  // Render based on current page
  if (currentPage === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />;
  }

  // Default: show landing page
  return (
    <div className="App">
      <LandingPage 
        onNavigateToLogin={handleOpenLogin}
        onNavigateToRegister={handleOpenRegister}
      />

      {showAuthModal && (
        <div 
          className={`auth-modal-overlay ${isClosing ? 'closing' : ''}`}
          onClick={handleCloseAuth}
        >
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            {authView === 'login' ? (
              <Login 
                onSwitchToRegister={handleSwitchToRegister}
                onClose={handleCloseAuth}
                isClosing={isClosing}
                onLoginSuccess={handleLoginSuccess}
              />
            ) : (
              <Register 
                onSwitchToLogin={handleSwitchToLogin}
                onClose={handleCloseAuth}
                isClosing={isClosing}
                onRegisterSuccess={handleLoginSuccess}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;