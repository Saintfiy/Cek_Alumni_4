import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, LogOut, Shield, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-container">
          <h2>AlumniTracker</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/alumni" className={({isActive}) => isActive && !location.pathname.includes('tambah') ? 'nav-item active' : 'nav-item'}>
          <Users size={20} />
          <span>Data Alumni</span>
        </NavLink>
        <NavLink to="/alumni/tambah" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <PlusCircle size={20} />
          <span>Tambah Data</span>
        </NavLink>
        {isAdmin && (
          <>
            <NavLink to="/verifikasi" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <UserCheck size={20} />
              <span>Verifikasi</span>
            </NavLink>
          </>
        )}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile-pill">
          <div className="user-avatar-small">
            {isAdmin ? <Shield size={16} /> : <User size={16} />}
          </div>
          <div className="user-info-small">
            <span className="user-name-small">{user?.name}</span>
            <span className={`role-tag ${isAdmin ? 'admin' : 'user'}`}>
              {isAdmin ? 'Administrator' : 'Pengunjung'}
            </span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Keluar">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
