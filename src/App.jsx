import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import AlumniList from './pages/AlumniList';
import AlumniDetail from './pages/AlumniDetail';
import AlumniForm from './pages/AlumniForm';
import VerificationList from './pages/VerificationList';
import './App.css';

function ProtectedLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const isAdmin = user.role === 'admin';

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={isAdmin ? <Dashboard /> : <UserDashboard />} />
            <Route path="/alumni" element={<AlumniList />} />
            <Route path="/alumni/tambah" element={<AlumniForm />} />
            <Route path="/alumni/:id" element={<AlumniDetail />} />
            {isAdmin && (
              <>
                <Route path="/verifikasi" element={<VerificationList />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
