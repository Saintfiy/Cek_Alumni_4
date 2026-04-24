import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Topbar.css';

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="topbar glass-panel">
      <div style={{ flex: 1 }}></div>
      
      <div className="topbar-actions">
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">Sistem Cek Alumni</span>
          </div>
        </div>
      </div>
    </header>
  );
}
