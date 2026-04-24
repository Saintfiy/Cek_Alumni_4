import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CheckCircle, XCircle, Eye, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import './VerificationList.css';

export default function VerificationList() {
  const [pendingAlumni, setPendingAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .eq('tracking_status', 'Perlu Verifikasi Manual')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPendingAlumni(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (id, newStatus) => {
    if (!confirm(`Yakin ingin ${newStatus === 'Terverifikasi' ? 'menyetujui' : 'menolak'} data ini?`)) return;
    try {
      const { error } = await supabase.from('alumni').update({ tracking_status: newStatus }).eq('id', id);
      if (error) throw error;
      setPendingAlumni(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Gagal memproses: ' + err.message);
    }
  };

  return (
    <div className="verification-page animate-fade-in">
      <div className="page-header">
        <h1><UserCheck size={28} /> Verifikasi Data Alumni</h1>
        <p>Daftar alumni yang baru menginput data dan memerlukan tinjauan Admin.</p>
      </div>

      <div className="glass-panel">
        {loading ? (
          <div className="loading-state">Memuat data verifikasi...</div>
        ) : pendingAlumni.length === 0 ? (
          <div className="empty-state">Tidak ada data alumni yang perlu diverifikasi saat ini.</div>
        ) : (
          <table className="glass-table">
            <thead>
              <tr>
                <th>Nama Alumni</th>
                <th>Fakultas / Prodi</th>
                <th>Pekerjaan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pendingAlumni.map(row => (
                <tr key={row.id}>
                  <td>
                    <div className="alumni-info-cell">
                      <span className="name">{row.full_name}</span>
                      <span className="nim">{row.nim}</span>
                    </div>
                  </td>
                  <td>
                    <div className="alumni-info-cell">
                      <span>{row.faculty}</span>
                      <span className="subtext">{row.major}</span>
                    </div>
                  </td>
                  <td>
                    <div className="alumni-info-cell">
                      <span>{row.workplace || '-'}</span>
                      <span className="subtext">{row.position || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/alumni/${row.id}`} className="action-btn view" title="Lihat Detail">
                        <Eye size={18} />
                      </Link>
                      <button className="action-btn approve" title="Setujui" onClick={() => handleAction(row.id, 'Terverifikasi')}>
                        <CheckCircle size={18} />
                      </button>
                      <button className="action-btn reject" title="Tolak" onClick={() => handleAction(row.id, 'Ditolak')}>
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
