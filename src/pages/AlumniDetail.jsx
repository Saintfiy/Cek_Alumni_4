import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, MapPin, Briefcase, Mail, Phone, Globe, CheckCircle, AlertCircle, Trash2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AlumniDetail.css';

export default function AlumniDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  async function fetchDetail() {
    try {
      const { data, error } = await supabase.from('alumni').select('*').eq('id', id).single();
      if (error) throw error;
      setAlumni(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (newStatus) => {
    if (!confirm(`Yakin ingin mengubah status menjadi ${newStatus}?`)) return;
    setUpdating(true);
    try {
      const { error } = await supabase.from('alumni').update({ tracking_status: newStatus }).eq('id', id);
      if (error) throw error;
      alert(`Status berhasil diubah menjadi ${newStatus}`);
      fetchDetail();
    } catch (err) {
      alert('Gagal update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Yakin ingin MENGHAPUS data alumni ini secara permanen?')) return;
    setUpdating(true);
    try {
      const { error } = await supabase.from('alumni').delete().eq('id', id);
      if (error) throw error;
      alert('Data alumni berhasil dihapus');
      navigate('/alumni');
    } catch (err) {
      alert('Gagal menghapus data: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getSearchUrl = (platform, name) => {
    const encoded = encodeURIComponent(name || '');
    switch(platform) {
      case 'linkedin': return `https://www.linkedin.com/search/results/people/?keywords=${encoded}`;
      case 'instagram': return `https://www.instagram.com/explore/search/keyword/?q=${encoded}`;
      case 'facebook': return `https://www.facebook.com/search/top?q=${encoded}`;
      case 'tiktok': return `https://www.tiktok.com/search?q=${encoded}`;
      case 'workplace': return `https://www.google.com/search?q=${encoded}`;
      default: return '#';
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Memuat profil...</div>;
  if (!alumni) return <div style={{ padding: '40px' }}>Data tidak ditemukan.</div>;

  return (
    <div className="alumni-detail animate-fade-in">
      <button className="back-button" onClick={() => navigate('/alumni')}>
        <ArrowLeft size={18} /> Kembali ke Daftar
      </button>

      <div className="profile-header glass-panel">
        <div className="profile-avatar">
          {alumni.full_name.charAt(0)}
        </div>
        <div className="profile-info">
          <h1>{alumni.full_name}</h1>
          <p className="subtitle">{alumni.nim} • {alumni.faculty} ({alumni.major})</p>
          <div className="status-container">
            Status Pelacakan:
            <span className={`status-badge ${alumni.tracking_status?.includes('Teridentifikasi') ? 'teridentifikasi' : 'belum-dilacak'}`}>
              {alumni.tracking_status || 'Belum Dilacak'}
            </span>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="admin-actions-bar glass-panel animate-fade-in" style={{ marginBottom: '24px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, marginRight: '8px' }}>Kelola Data:</span>
          <button className="glass-button success" onClick={() => updateStatus('Terverifikasi')} disabled={updating || alumni.tracking_status === 'Terverifikasi'}>
            <CheckCircle size={18} style={{ marginRight: 8 }} /> Verifikasi
          </button>
          <button className="glass-button warning" onClick={() => updateStatus('Perlu Verifikasi Manual')} disabled={updating}>
            <AlertCircle size={18} style={{ marginRight: 8 }} /> Perlu Perbaikan
          </button>
          <button className="glass-button danger" onClick={() => updateStatus('Ditolak')} disabled={updating || alumni.tracking_status === 'Ditolak'}>
            <XCircle size={18} style={{ marginRight: 8 }} /> Tolak Data
          </button>
          <div style={{ flex: 1 }}></div>
          <button className="glass-button danger outline" onClick={handleDelete} disabled={updating}>
            <Trash2 size={18} style={{ marginRight: 8 }} /> Hapus Permanen
          </button>
        </div>
      )}

      <div className="detail-grid">
        {/* Pekerjaan */}
        <div className="detail-card glass-panel">
          <div className="card-header">
            <Briefcase size={20} className="icon-accent" />
            <h2>Informasi Pekerjaan</h2>
          </div>
          <div className="card-body">
            <div className="info-group">
              <label>Tempat Bekerja</label>
              <p>{alumni.workplace || '-'}</p>
            </div>
            <div className="info-group">
              <label>Posisi / Jabatan</label>
              <p>{alumni.position || '-'}</p>
            </div>
            <div className="info-group">
              <label>Jenis Pekerjaan</label>
              <p>{alumni.employment_type || '-'}</p>
            </div>
            <div className="info-group">
              <label>Alamat Tempat Bekerja</label>
              <p className="flex-align"><MapPin size={16} className="text-muted" style={{ marginRight: 6 }} /> {alumni.workplace_address || '-'}</p>
            </div>
            <div className="info-group">
              <label>Sosial Media Perusahaan</label>
              {alumni.workplace_social_media ? (
                <a href={getSearchUrl('workplace', alumni.workplace)} target="_blank" rel="noreferrer" className="link-accent">
                  <Globe size={16} style={{ marginRight: 6 }} /> Cari di Google
                </a>
              ) : <p>-</p>}
            </div>
          </div>
        </div>

        {/* Kontak & Sosial Media */}
        <div className="detail-card glass-panel">
          <div className="card-header">
            <Mail size={20} className="icon-accent" />
            <h2>Kontak & Sosial Media Pribadi</h2>
          </div>
          <div className="card-body">
            <div className="info-group">
              <label>Email</label>
              <p className="flex-align"><Mail size={16} className="text-muted" style={{ marginRight: 6 }} /> {alumni.email || '-'}</p>
            </div>
            <div className="info-group">
              <label>Nomor HP</label>
              <p className="flex-align"><Phone size={16} className="text-muted" style={{ marginRight: 6 }} /> {alumni.phone || '-'}</p>
            </div>

            <div className="divider"></div>
            <label>Jejaring Sosial</label>
            <div className="social-links">
              {alumni.linkedin ? (
                <a href={getSearchUrl('linkedin', alumni.full_name)} target="_blank" rel="noreferrer" className="social-btn linkedin">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> Cari LinkedIn
                </a>
              ) : <span className="social-empty"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> Tidak ada</span>}

              {alumni.instagram ? (
                <a href={getSearchUrl('instagram', alumni.full_name)} target="_blank" rel="noreferrer" className="social-btn instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> Cari Instagram
                </a>
              ) : <span className="social-empty"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> Tidak ada</span>}

              {alumni.facebook ? (
                <a href={getSearchUrl('facebook', alumni.full_name)} target="_blank" rel="noreferrer" className="social-btn facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> Cari Facebook
                </a>
              ) : <span className="social-empty"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg> Tidak ada</span>}

              {alumni.tiktok ? (
                <a href={getSearchUrl('tiktok', alumni.full_name)} target="_blank" rel="noreferrer" className="social-btn tiktok">Cari TikTok</a>
              ) : <span className="social-empty">TikTok Tidak ada</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
