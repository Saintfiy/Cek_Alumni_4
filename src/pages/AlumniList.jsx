import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Mail, Phone, Globe, Building2, MapPin, Search, Filter, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AlumniList.css';

export default function AlumniList() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [offset, setOffset] = useState(0);
  
  // States for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterYear, setFilterYear] = useState('');

  useEffect(() => {
    setOffset(0);
    setAlumni([]);
    fetchAlumni(0);
  }, [filterFaculty, filterStatus, filterYear]);

  async function fetchAlumni(startOffset = offset) {
    const isInitial = startOffset === 0;
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      let query = supabase.from('alumni').select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,nim.ilike.%${searchTerm}%,workplace.ilike.%${searchTerm}%`);
      }
      if (filterFaculty) {
        query = query.eq('faculty', filterFaculty);
      }
      if (filterStatus) {
        query = query.eq('tracking_status', filterStatus);
      }
      if (filterYear) {
        query = query.eq('graduation_date', filterYear);
      }

      const { data, count, error } = await query
        .order('updated_at', { ascending: false })
        .range(startOffset, startOffset + 49);
      
      if (error) throw error;
      
      if (isInitial) {
        setAlumni(data || []);
      } else {
        setAlumni(prev => [...prev, ...(data || [])]);
      }
      setTotalCount(count || 0);
      setOffset(startOffset + 50);
    } catch (e) {
      console.warn('Could not fetch alumni.', e);
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setOffset(0);
    setAlumni([]);
    fetchAlumni(0);
  };

  const exportToCSV = () => {
    if (alumni.length === 0) return alert('Tidak ada data untuk diekspor.');
    
    const headers = ['Nama', 'NIM', 'Fakultas', 'Prodi', 'Lulus', 'Pekerjaan', 'Instansi', 'Status'];
    const rows = alumni.map(a => [
      a.full_name, a.nim, a.faculty, a.major, a.graduation_date, 
      a.position, a.workplace, a.tracking_status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_alumni_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getJobBadgeClass = (type) => {
    if (!type) return 'default';
    const lower = type.toLowerCase();
    if (lower.includes('pns')) return 'pns';
    if (lower.includes('swasta')) return 'swasta';
    if (lower.includes('wirausaha')) return 'wirausaha';
    return 'default';
  };

  const formatUrl = (url) => {
    if (!url) return '#';
    let newUrl = url.trim();
    if (newUrl.startsWith('https://')) newUrl = newUrl.slice(8);
    else if (newUrl.startsWith('http://')) newUrl = newUrl.slice(7);
    if (newUrl.startsWith('www.')) newUrl = newUrl.slice(4);
    if (newUrl.endsWith('/$0')) newUrl = newUrl.slice(0, -3);
    return `https://www.${newUrl}`;
  };

  return (
    <div className="alumni-list animate-fade-in">
      <div className="list-header-row">
        <div>
          <h1>Daftar Lulusan ({totalCount.toLocaleString()})</h1>
          <p className="subtitle">Data alumni terverifikasi dan dalam proses pelacakan.</p>
        </div>
        {isAdmin && (
          <button className="glass-button success" onClick={exportToCSV}>
            <Download size={18} style={{marginRight: 8}} /> Cetak Laporan (CSV)
          </button>
        )}
      </div>

      {/* Filter Section */}
      <div className="filter-bar glass-panel">
        <form onSubmit={handleSearchSubmit} className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari nama, NIM, atau tempat kerja..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="filter-group">
          <div className="filter-item">
            <Filter size={14} />
            <select value={filterFaculty} onChange={(e) => setFilterFaculty(e.target.value)}>
              <option value="">Semua Fakultas</option>
              <option value="Teknik">Teknik</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="Hukum">Hukum</option>
              <option value="Kedokteran">Kedokteran</option>
            </select>
          </div>
          
          <div className="filter-item">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">Semua Status</option>
              <option value="Terverifikasi">Terverifikasi</option>
              <option value="Perlu Verifikasi Manual">Perlu Verifikasi</option>
              <option value="Ditolak">Ditolak</option>
              <option value="Belum Dilacak">Belum Dilacak</option>
            </select>
          </div>

          <div className="filter-item">
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="">Semua Tahun</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </select>
          </div>
        </div>
      </div>
        
      <div className="glass-panel" style={{ paddingBottom: '24px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Mencari data alumni...</div>
        ) : alumni.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Data tidak ditemukan dengan kriteria tersebut.</div>
        ) : (
          <div className="alumni-list-container">
            <div className="alumni-list-header">
              <div>Profil & Pekerjaan</div>
              <div>Kontak & Alamat</div>
              <div>Sosial Media</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '0 24px' }}>
              {alumni.map((row, index) => (
                <div 
                  key={row.id} 
                  className="alumni-card" 
                  style={{ 
                    borderBottom: index !== alumni.length - 1 ? '1px solid var(--glass-border)' : 'none',
                    padding: '24px 0'
                  }}
                >
                  <div className="col-pekerjaan">
                    <div className="alumni-name-tag">
                      <Link to={`/alumni/${row.id}`} className="alumni-link">
                        {row.full_name} <span className="nim-text">({row.nim || '-'})</span>
                      </Link>
                      <span className={`status-badge-mini ${row.tracking_status === 'Terverifikasi' ? 'teridentifikasi' : row.tracking_status === 'Ditolak' ? 'tidak-ditemukan' : 'belum-dilacak'}`}>
                        {row.tracking_status}
                      </span>
                    </div>
                    
                    <div className="job-header">
                      <span className={`job-type-badge ${getJobBadgeClass(row.employment_type)}`}>
                        {row.employment_type || 'TIDAK DIKETAHUI'}
                      </span>
                      <span className="job-title">{row.position || 'Posisi Belum Diketahui'}</span>
                    </div>

                    <div className="job-detail-row">
                      <Building2 size={14} className="job-detail-icon" />
                      <span>{row.workplace || 'Instansi/Perusahaan Belum Diketahui'}</span>
                    </div>
                  </div>

                  <div className="col-kontak">
                    <div className="contact-row">
                      <Mail size={14} className="contact-icon email" />
                      <span>{row.email || 'Email tidak tersedia'}</span>
                    </div>
                    <div className="contact-row">
                      <MapPin size={14} className="contact-icon" />
                      <span className="text-truncate">{row.workplace_address || 'Alamat tidak tersedia'}</span>
                    </div>
                  </div>

                  <div className="col-sosmed">
                    <div className="sosmed-group">
                      {row.linkedin && (
                        <a href={formatUrl(row.linkedin)} target="_blank" rel="noreferrer" className="sosmed-link" title="LinkedIn">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                      )}
                      {row.instagram && (
                        <a href={formatUrl(row.instagram)} target="_blank" rel="noreferrer" className="sosmed-link" title="Instagram">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                      )}
                      {!row.linkedin && !row.instagram && <span className="text-muted" style={{fontSize: '0.8rem'}}>Tidak ada sosmed</span>}
                    </div>
                    <Link to={`/alumni/${row.id}`} className="view-detail-btn">
                      Lihat Detail <FileText size={14} style={{marginLeft: 4}} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && alumni.length > 0 && alumni.length < totalCount && (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <button 
              onClick={() => fetchAlumni(offset)}
              disabled={loadingMore}
              className="glass-button"
              style={{
                cursor: loadingMore ? 'not-allowed' : 'pointer',
                opacity: loadingMore ? 0.6 : 1
              }}
            >
              {loadingMore ? 'Memuat...' : `Muat Lebih Banyak (${alumni.length}/${totalCount})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
