import './App.css';
import { useState } from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

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
    }, 500); // Match the animation duration
  };

  const handleSwitchToRegister = () => {
    setAuthView('register');
  };

  const handleSwitchToLogin = () => {
    setAuthView('login');
  };

  return (
    <div className="App">
      <LandingPage onNavigateToLogin={handleOpenLogin} onNavigateToRegister={handleOpenRegister} />
      
      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className={`auth-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleCloseAuth}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            {authView === 'login' ? (
              <Login onSwitchToRegister={handleSwitchToRegister} onClose={handleCloseAuth} isClosing={isClosing} />
            ) : (
              <Register onSwitchToLogin={handleSwitchToLogin} onClose={handleCloseAuth} isClosing={isClosing} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
