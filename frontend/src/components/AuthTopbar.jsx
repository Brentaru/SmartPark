import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import '../styles/Topbar.css';

const AuthTopbar = ({ pageTitle = 'Dashboard' }) => {
  const { currentUser, logout } = useAuth();
  const { isExpanded } = useSidebar();
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
    <header className={`auth-topbar ${isExpanded ? '' : 'sidebar-collapsed'}`}>
      <div className="topbar-left">
        <div className="topbar-brand">
          <span className="brand-smart">Smart</span>
          <span className="brand-park">Park</span>
        </div>
        <div className="topbar-sep">—</div>
        <div className="topbar-title">{pageTitle}</div>
      </div>

      <div className="topbar-right">
        <div className="topbar-name">{currentUser?.firstName} {currentUser?.lastName}</div>
        
        <button className="notification-btn" title="Notifications" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notification-badge">3</span>
        </button>

        <div className="profile-dropdown" ref={dropdownRef}>
          <button className="profile-btn" onClick={() => setOpen(!open)} aria-haspopup>
            <div className="profile-avatar">{(currentUser?.firstName || 'U').charAt(0)}</div>
          </button>

          {open && (
            <div className="profile-menu">
              <div className="profile-menu-header">
                <div className="profile-menu-avatar">{(currentUser?.firstName || 'U').charAt(0)}</div>
                <div className="profile-menu-info">
                  <div className="profile-menu-name">{currentUser?.firstName} {currentUser?.lastName}</div>
                  <div className="profile-menu-email">{currentUser?.email}</div>
                </div>
              </div>
              <div className="profile-menu-divider"></div>
              <button className="profile-menu-item" onClick={() => goTo('/profile')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                View My Profile
              </button>
              <button className="profile-menu-item logout-item" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthTopbar;
