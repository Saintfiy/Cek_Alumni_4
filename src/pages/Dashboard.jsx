import React, { useEffect, useState } from 'react';
import { Users, Search, AlertCircle, CheckCircle, Database } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '../lib/supabaseClient';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    teridentifikasi: 0,
    perluVerifikasi: 0,
    belumDilacak: 0
  });
  
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { count: totalCount, error: totalErr } = await supabase.from('alumni').select('*', { count: 'exact', head: true });
      if (totalErr) {
        console.warn('Error fetching stats (maybe table missing):', totalErr);
        return;
      }
      
      const { count: teridentifikasiCount } = await supabase.from('alumni').select('*', { count: 'exact', head: true }).eq('tracking_status', 'Terverifikasi');
      const { count: perluVerifikasiCount } = await supabase.from('alumni').select('*', { count: 'exact', head: true }).eq('tracking_status', 'Perlu Verifikasi Manual');
      const { count: belumDilacakCount } = await supabase.from('alumni').select('*', { count: 'exact', head: true }).eq('tracking_status', 'Belum Dilacak');
      
      const summary = {
        total: totalCount || 0,
        teridentifikasi: teridentifikasiCount || 0,
        perluVerifikasi: perluVerifikasiCount || 0,
        belumDilacak: belumDilacakCount || 0
      };
      setStats(summary);
    } catch (e) {
      console.error(e);
    }
  }

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const response = await fetch('/data.csv');
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const records = results.data.map(row => ({
            full_name: row['Nama Lulusan'] || '',
            nim: row['NIM'] || '',
            entry_year: row['Tahun Masuk'] || '',
            graduation_date: row['Tanggal Lulus'] || '',
            faculty: row['Fakultas'] || '',
            major: row['Program Studi'] || '',
            tracking_status: 'Belum Dilacak'
          }));
          
          const { error } = await supabase.from('alumni').insert(records);
          if (error) {
            alert('Gagal import data: ' + error.message + '\nPastikan Anda sudah menjalankan script SQL di Supabase.');
          } else {
            alert(`Berhasil mengimpor ${records.length} data alumni!`);
            fetchStats();
          }
          setIsImporting(false);
        }
      });
    } catch (error) {
      alert('Gagal membaca file CSV.');
      setIsImporting(false);
    }
  };

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-header">
        <h1>Dashboard Pelacakan</h1>
        <p className="subtitle">Ringkasan hasil pelacakan data alumni otomatis.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-primary)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Alumni</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Terverifikasi</h3>
            <p className="stat-value">{stats.teridentifikasi}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)' }}>
            <AlertCircle size={24} />
          </div>
          <div className="stat-info">
            <h3>Perlu Verifikasi</h3>
            <p className="stat-value">{stats.perluVerifikasi}</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(148, 163, 184, 0.2)', color: 'var(--text-muted)' }}>
            <Search size={24} />
          </div>
          <div className="stat-info">
            <h3>Belum Dilacak</h3>
            <p className="stat-value">{stats.belumDilacak}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
