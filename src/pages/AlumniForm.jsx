import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Save, User, Book, GraduationCap, MapPin, Briefcase } from 'lucide-react';
import './AlumniForm.css';

export default function AlumniForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    nim: '',
    entry_year: '',
    graduation_date: '',
    faculty: '',
    major: '',
    workplace: '',
    position: '',
    employment_type: 'Swasta',
    email: '',
    phone: '',
    linkedin: '',
    instagram: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name) return alert('Nama lengkap wajib diisi!');
    
    setLoading(true);
    try {
      const { error } = await supabase.from('alumni').insert([{
        ...formData,
        tracking_status: 'Perlu Verifikasi Manual'
      }]);
      
      if (error) throw error;
      
      alert('Data alumni berhasil disimpan! Admin akan melakukan verifikasi.');
      navigate('/alumni');
    } catch (err) {
      alert('Gagal menyimpan data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alumni-form-page animate-fade-in">
      <div className="form-header">
        <h1>Input Data Alumni</h1>
        <p>Silakan isi data Anda untuk memperbarui sistem penelusuran lulusan.</p>
      </div>

      <form onSubmit={handleSubmit} className="alumni-form-grid">
        {/* Identitas Diri */}
        <div className="form-section glass-panel">
          <div className="section-title">
            <User size={20} />
            <h2>Identitas Diri</h2>
          </div>
          <div className="form-inputs">
            <div className="input-group">
              <label>Nama Lengkap *</label>
              <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Nama Lengkap" required />
            </div>
            <div className="input-group">
              <label>NIM</label>
              <input type="text" name="nim" value={formData.nim} onChange={handleChange} placeholder="Nomor Induk Mahasiswa" />
            </div>
          </div>
        </div>

        {/* Akademik */}
        <div className="form-section glass-panel">
          <div className="section-title">
            <GraduationCap size={20} />
            <h2>Data Akademik</h2>
          </div>
          <div className="form-inputs">
            <div className="input-group">
              <label>Fakultas</label>
              <input type="text" name="faculty" value={formData.faculty} onChange={handleChange} placeholder="Contoh: Teknik" />
            </div>
            <div className="input-group">
              <label>Program Studi</label>
              <input type="text" name="major" value={formData.major} onChange={handleChange} placeholder="Contoh: Teknik Informatika" />
            </div>
            <div className="input-group">
              <label>Tahun Lulus</label>
              <input type="text" name="graduation_date" value={formData.graduation_date} onChange={handleChange} placeholder="Tahun Lulus" />
            </div>
          </div>
        </div>

        {/* Pekerjaan */}
        <div className="form-section glass-panel">
          <div className="section-title">
            <Briefcase size={20} />
            <h2>Data Pekerjaan</h2>
          </div>
          <div className="form-inputs">
            <div className="input-group">
              <label>Tempat Kerja</label>
              <input type="text" name="workplace" value={formData.workplace} onChange={handleChange} placeholder="Nama Perusahaan/Institusi" />
            </div>
            <div className="input-group">
              <label>Posisi / Jabatan</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Contoh: Senior Engineer" />
            </div>
            <div className="input-group">
              <label>Tipe Pekerjaan</label>
              <select name="employment_type" value={formData.employment_type} onChange={handleChange}>
                <option value="PNS">PNS / ASN</option>
                <option value="Swasta">Pegawai Swasta</option>
                <option value="Wirausaha">Wirausaha / Entrepreneur</option>
                <option value="Belum Bekerja">Belum Bekerja</option>
              </select>
            </div>
          </div>
        </div>

        {/* Kontak & Sosial */}
        <div className="form-section glass-panel">
          <div className="section-title">
            <MapPin size={20} />
            <h2>Kontak & Media Sosial</h2>
          </div>
          <div className="form-inputs">
            <div className="input-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Alamat Email Aktif" />
            </div>
            <div className="input-group">
              <label>No. WhatsApp</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="628..." />
            </div>
            <div className="input-group">
              <label>Link LinkedIn</label>
              <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="input-group">
              <label>Username Instagram</label>
              <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="@username" />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="glass-button secondary" onClick={() => navigate(-1)}>Batal</button>
          <button type="submit" className="glass-button" disabled={loading}>
            <Save size={18} style={{marginRight: '8px'}} />
            {loading ? 'Menyimpan...' : 'Simpan Data Alumni'}
          </button>
        </div>
      </form>
    </div>
  );
}
