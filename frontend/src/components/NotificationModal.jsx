import React from 'react';
import '../styles/NotificationModal.css';

const NotificationModal = ({ show, type = 'info', title, message, onClose }) => {
  if (!show) return null;

  const getIcon = () => {
    switch(type) {
      case 'error':
        return (
          <svg className="notification-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      case 'success':
        return (
          <svg className="notification-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        );
      case 'warning':
        return (
          <svg className="notification-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      default:
        return (
          <svg className="notification-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
    }
  };

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          {getIcon()}
          <h3 className="notification-title">{title}</h3>
        </div>
        
        <div className="notification-body">
          <p className="notification-message">{message}</p>
        </div>
        
        <div className="notification-footer">
          <button className="notification-btn" onClick={onClose}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
