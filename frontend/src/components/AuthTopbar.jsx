import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Topbar.css';

const AuthTopbar = ({ pageTitle = 'Dashboard', onToggleSidebar, sidebarOpen = true }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goTo = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className={`auth-topbar ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="topbar-left">
        <button 
          className="menu-toggle-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="topbar-brand">
          <span className="brand-smart">Smart</span>
          <span className="brand-park">Park</span>
        </div>
        <div className="topbar-sep">—</div>
        <div className="topbar-title">{pageTitle}</div>
      </div>

      <div className="topbar-right">
        <div className="topbar-name">{currentUser?.firstName} {currentUser?.lastName}</div>

        <div className="profile-dropdown" ref={dropdownRef}>
          <button className="profile-btn" onClick={() => setOpen(!open)} aria-haspopup>
            <div className="profile-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </button>

          {open && (
            <div className="profile-menu">
              <button className="profile-menu-item" onClick={() => goTo('/dashboard/profile')}>Profile</button>
              <button className="profile-menu-item" onClick={() => goTo('/dashboard/settings')}>Settings</button>
              <button className="profile-menu-item" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthTopbar;
