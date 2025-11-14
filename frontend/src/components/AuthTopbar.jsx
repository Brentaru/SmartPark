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
        <button className="icon-btn" title="Notifications" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div className="profile-dropdown" ref={dropdownRef}>
          <button className="profile-btn" onClick={() => setOpen(!open)} aria-haspopup>
            <div className="profile-avatar">{(currentUser?.firstName || 'U').charAt(0)}</div>
          </button>

          {open && (
            <div className="profile-menu">
              <button className="profile-menu-item" onClick={() => goTo('/profile')}>Profile</button>
              <button className="profile-menu-item" onClick={() => goTo('/settings')}>Settings</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthTopbar;
