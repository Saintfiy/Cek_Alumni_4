import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Search, Users, UserCheck, Clock, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

export default function UserDashboard() {
  const { user } = useAuth();
  const [totalAlumni, setTotalAlumni] = useState(0);
  const [tracked, setTracked] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const { count: total } = await supabase.from('alumni').select('*', { count: 'exact', head: true });
    const { count: trackedCount } = await supabase.from('alumni').select('*', { count: 'exact', head: true }).neq('tracking_status', 'Belum Dilacak');
    setTotalAlumni(total || 0);
    setTracked(trackedCount || 0);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setHasSearched(true);
    const { data } = await supabase
      .from('alumni')
      .select('id, full_name, nim, faculty, major, position, workplace, employment_type, tracking_status')
      .ilike('full_name', `%${searchQuery}%`)
      .limit(20);
    setSearchResults(data || []);
    setSearching(false);
  }

  const getJobBadgeClass = (type) => {
    if (!type) return 'default';
    const lower = type.toLowerCase();
    if (lower.includes('pns')) return 'pns';
    if (lower.includes('swasta')) return 'swasta';
    if (lower.includes('wirausaha')) return 'wirausaha';
    return 'default';
  };

  return (
    <div className="user-dashboard animate-fade-in">
      <div className="welcome-banner glass-panel">
        <div className="welcome-text">
          <h1>Selamat Datang, {user?.name}! 👋</h1>
          <p>Cari dan telusuri profil lulusan universitas kami melalui sistem ini.</p>
        </div>
        <div className="welcome-stats">
          <div className="stat-pill">
            <Users size={18} />
            <span><strong>{totalAlumni.toLocaleString('id-ID')}</strong> Total Alumni</span>
          </div>
          <div className="stat-pill tracked">
            <UserCheck size={18} />
            <span><strong>{tracked.toLocaleString('id-ID')}</strong> Sudah Terlacak</span>
          </div>
        </div>
      </div>

      <div className="search-section glass-panel">
        <h2><Search size={22} /> Cari Alumni</h2>
        <p className="search-subtitle">Masukkan nama lengkap atau sebagian nama alumni yang ingin Anda cari.</p>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Contoh: Budi Santoso, Siti Rahayu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={searching}>
            {searching ? 'Mencari...' : 'Cari'}
          </button>
        </form>

        {hasSearched && (
          <div className="search-results">
            {searchResults.length === 0 ? (
              <div className="no-results">Tidak ada alumni ditemukan dengan nama "{searchQuery}".</div>
            ) : (
              <>
                <div className="results-count">Ditemukan {searchResults.length} hasil pencarian</div>
                <div className="results-grid">
                  {searchResults.map(row => (
                    <Link to={`/alumni/${row.id}`} key={row.id} className="result-card">
                      <div className="result-avatar">{row.full_name.charAt(0)}</div>
                      <div className="result-info">
                        <div className="result-name">{row.full_name}</div>
                        <div className="result-meta">{row.faculty} — {row.major}</div>
                        {row.workplace && (
                          <div className="result-work">
                            <span className={`job-type-badge ${getJobBadgeClass(row.employment_type)}`}>
                              {row.employment_type || '?'}
                            </span>
                            <span className="result-workplace">{row.position} @ {row.workplace}</span>
                          </div>
                        )}
                        {!row.workplace && (
                          <div className="result-untracked">Data belum tersedia</div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="guide-section glass-panel">
        <h2><BookOpen size={22} /> Panduan Penggunaan</h2>
        <div className="guide-grid">
          <div className="guide-card">
            <div className="guide-icon">🔍</div>
            <h3>Cari Alumni</h3>
            <p>Gunakan kotak pencarian di atas untuk menemukan alumni berdasarkan nama.</p>
          </div>
          <div className="guide-card">
            <div className="guide-icon">👤</div>
            <h3>Lihat Profil</h3>
            <p>Klik nama alumni dari hasil pencarian untuk melihat profil lengkap beserta informasi pekerjaan dan kontaknya.</p>
          </div>
          <div className="guide-card">
            <div className="guide-icon">📋</div>
            <h3>Daftar Alumni</h3>
            <p>Gunakan menu "Data Alumni" di sidebar untuk menelusuri daftar lengkap alumni yang sudah terlacak.</p>
          </div>
          <div className="guide-card">
            <div className="guide-icon">✏️</div>
            <h3>Tambah Data</h3>
            <p>Gunakan menu "Tambah Data" untuk menginput data profil Anda sendiri ke dalam sistem.</p>
          </div>
          <div className="guide-card">
            <div className="guide-icon">🔒</div>
            <h3>Verifikasi Admin</h3>
            <p>Setiap data yang diinput akan melewati proses verifikasi oleh administrator sebelum dipublikasikan.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
