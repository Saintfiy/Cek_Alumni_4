import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admin');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'admin123';

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (adminUser === ADMIN_USER && adminPass === ADMIN_PASS) {
        login('admin', 'Administrator');
        navigate('/');
      } else {
        setError('Username atau password salah.');
      }
      setLoading(false);
    }, 400);
  };

  const handleUserLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!userName.trim()) {
      setError('Masukkan nama Anda.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login('user', userName.trim());
      navigate('/');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
      </div>

      <div className="login-container">
        <div className="login-header">
          <h1>AlumniTracker</h1>
          <p>Sistem Pelacakan Alumni Universitas</p>
        </div>

        <div className="login-card glass-panel">
          <div className="login-tabs">
            <button
              className={`login-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => { setActiveTab('admin'); setError(''); }}
            >
              Admin
            </button>
            <button
              className={`login-tab ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => { setActiveTab('user'); setError(''); }}
            >
              Pengunjung
            </button>
          </div>

          {activeTab === 'admin' ? (
            <form onSubmit={handleAdminLogin} className="login-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={adminUser}
                  onChange={e => setAdminUser(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  className="form-input"
                />
              </div>
              {error && <div className="login-error">{error}</div>}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Masuk...' : 'Masuk'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUserLogin} className="login-form">
              <div className="form-group">
                <label>Nama</label>
                <input
                  type="text"
                  placeholder="Masukkan nama Anda"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>
              {error && <div className="login-error">{error}</div>}
              <button type="submit" className="login-btn user" disabled={loading}>
                {loading ? 'Masuk...' : 'Masuk'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
