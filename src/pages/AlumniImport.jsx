import React, { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import '../styles/AlumniImport.css';

// Initialize Supabase client with service role key (use environment variable in production)
const supabase = createClient(
  'https://pkmyssnpsswglepawngc.supabase.co',
  import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrbXlzc25wc3N3Z2xlcGF3bmdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc4NDUwNiwiZXhwIjoyMDkyMzYwNTA2fQ.g9C4iEmeCZBiHjf8H1cejyhZfY518oCqzd_Z93rcMSw'
);

const randomFrom = (items) => items[Math.floor(Math.random() * items.length)];
const normalizeSlug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const workplaceProfiles = {
  PNS: [
    {
      workplace: 'Dinas Pendidikan Kabupaten Sleman',
      workplace_address: 'Jalan Magelang No. 14, Sleman, DIY',
      workplace_social_media: 'https://www.instagram.com/dikpora.sleman/'
    },
    {
      workplace: 'RSUD Prof. Dr. Margono Soekarjo',
      workplace_address: 'Jl. Dr. Gumbreg No. 1, Purwokerto, Banyumas',
      workplace_social_media: 'https://www.facebook.com/rsudmargono'
    },
    {
      workplace: 'Kantor Kecamatan Depok',
      workplace_address: 'Jl. Parangtritis KM 11, Bantul, DIY',
      workplace_social_media: 'https://www.linkedin.com/company/kecamatan-depok/'
    }
  ],
  Swasta: [
    {
      workplace: 'PT Mitra Inovasi Digital',
      workplace_address: 'Jl. Raya Bogor No. 88, Jakarta Timur',
      workplace_social_media: 'https://www.linkedin.com/company/mitra-inovasi/'
    },
    {
      workplace: 'CV Solusi Edukasi Nusantara',
      workplace_address: 'Jl. Diponegoro No. 22, Semarang',
      workplace_social_media: 'https://www.instagram.com/solusiedukasinusantara/'
    },
    {
      workplace: 'PT Arunika Teknologi Indonesia',
      workplace_address: 'Jl. Gatot Subroto Kav. 45, Jakarta Selatan',
      workplace_social_media: 'https://www.tiktok.com/@arunika.tech'
    }
  ],
  Wirausaha: [
    {
      workplace: 'Kopi Nusantara',
      workplace_address: 'Jl. Pahlawan No. 11, Yogyakarta',
      workplace_social_media: 'https://www.instagram.com/kopi.nusantara.id/'
    },
    {
      workplace: 'Studio Foto Pixel',
      workplace_address: 'Jl. Malioboro No. 65, Yogyakarta',
      workplace_social_media: 'https://www.facebook.com/studiofotopixel/'
    },
    {
      workplace: 'Toko Kue Manis',
      workplace_address: 'Jl. Cendana No. 5, Bandung',
      workplace_social_media: 'https://www.tiktok.com/@tokokue.manis'
    }
  ]
};

const nameParts = ['Adi', 'Budi', 'Citra', 'Dewi', 'Eka', 'Fajar', 'Gita', 'Hendra', 'Indra', 'Joko', 'Krisna', 'Lina', 'Maya', 'Nina', 'Oka', 'Putri', 'Rina', 'Sari', 'Taufik', 'Vina'];
const lastNames = ['Saputra', 'Yuliana', 'Pratama', 'Kristanto', 'Susanto', 'Wijaya', 'Ramadhan', 'Prasetyo', 'Halim', 'Nugroho', 'Kusuma', 'Amalia', 'Hartono', 'Azizah', 'Fauzan'];
const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'proton.me'];
const jobTitles = ['Senior Engineer', 'Manajer Operasional', 'Analis Data', 'Spesialis Pemasaran', 'Desainer Produk', 'Konsultan SDM', 'Staf Akademik', 'Kepala Program', 'Customer Success', 'Founder'];
const socialNetworks = ['linkedin', 'instagram', 'facebook', 'tiktok'];

const createSocialHandle = (name, network) => {
  const slug = normalizeSlug(name).replace(/-+/g, '');
  switch (network) {
    case 'linkedin':
      return `https://www.linkedin.com/in/${slug}-${randomInt(10, 99)}`;
    case 'instagram':
      return `https://www.instagram.com/${slug}${randomInt(1, 99)}`;
    case 'facebook':
      return `https://www.facebook.com/${slug}.${randomInt(1, 99)}`;
    case 'tiktok':
      return `https://www.tiktok.com/@${slug}${randomInt(1, 99)}`;
    default:
      return '';
  }
};

const createSeedRecord = (index) => {
  const fullName = `${randomFrom(nameParts)} ${randomFrom(lastNames)}`;
  const employment_type = randomFrom(['PNS', 'Swasta', 'Wirausaha']);
  const workplace = randomFrom(workplaceProfiles[employment_type]);

  return {
    full_name: fullName,
    email: `${normalizeSlug(fullName)}${randomInt(1, 99)}@${randomFrom(emailDomains)}`,
    phone: `628${randomInt(111, 999)}${randomInt(1000, 9999)}${randomInt(1000, 9999)}`,
    linkedin: createSocialHandle(fullName, 'linkedin'),
    instagram: createSocialHandle(fullName, 'instagram'),
    facebook: createSocialHandle(fullName, 'facebook'),
    tiktok: createSocialHandle(fullName, 'tiktok'),
    workplace: workplace.workplace,
    workplace_address: workplace.workplace_address,
    workplace_social_media: workplace.workplace_social_media,
    position: randomFrom(jobTitles),
    employment_type,
    nim: `20${randomInt(18, 24)}${randomInt(1000, 9999)}`,
    entry_year: `${randomInt(2015, 2023)}`,
    graduation_date: `${randomInt(2019, 2024)}`,
    faculty: randomFrom(['Teknik', 'Ekonomi', 'Ilmu Sosial', 'Ilmu Komputer', 'Psikologi', 'Hukum']),
    major: randomFrom(['Teknik Informatika', 'Manajemen', 'Psikologi', 'Akuntansi', 'Hukum', 'Sistem Informasi'])
  };
};

const generateSeedData = (count = 20) => Array.from({ length: count }, (_, index) => createSeedRecord(index));

const AlumniImport = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [seedPreview, setSeedPreview] = useState([]);
  const [seedCount, setSeedCount] = useState(20);
  const [importStatus, setImportStatus] = useState(null);
  const [columnMapping, setColumnMapping] = useState({});

  /**
   * Map CSV columns to database fields
   */
  const mapCSVToAlumni = (csvRow, mapping = {}) => {
    const defaultMapping = {
      full_name: ['Nama', 'nama', 'Full Name', 'full_name'],
      nim: ['NIM', 'nim', 'Student ID'],
      entry_year: ['Tahun Masuk', 'tahun_masuk', 'Entry Year'],
      graduation_date: ['Tahun Lulus', 'tahun_lulus', 'Graduation Date'],
      faculty: ['Fakultas', 'fakultas', 'Faculty'],
      major: ['Program Studi', 'program_studi', 'Major'],
      linkedin: ['LinkedIn', 'linkedin', 'Linkedin'],
      instagram: ['Instagram', 'instagram', 'IG', 'ig'],
      facebook: ['Facebook', 'facebook', 'FB', 'fb'],
      tiktok: ['TikTok', 'tiktok', 'Tiktok'],
      email: ['Email', 'email'],
      phone: ['No HP', 'no_hp', 'Phone', 'phone', 'Nomor HP'],
      workplace: ['Tempat Bekerja', 'tempat_bekerja', 'Workplace', 'Company'],
      workplace_address: ['Alamat Bekerja', 'alamat_bekerja', 'Workplace Address'],
      position: ['Posisi', 'posisi', 'Position', 'Job Title'],
      employment_type: ['Status Kerja', 'status_kerja', 'Employment Type', 'PNS/Swasta/Wirausaha', 'Employment Status'],
      workplace_social_media: ['Sosial Media Perusahaan', 'sosial_media_perusahaan', 'Company Social Media']
    };

    const alumni = {};

    Object.entries(defaultMapping).forEach(([dbField, possibleColumns]) => {
      // Check if user provided custom mapping
      if (mapping[dbField]) {
        alumni[dbField] = csvRow[mapping[dbField]] || '';
      } else {
        // Try to find matching column
        const found = possibleColumns.find(col => col in csvRow);
        alumni[dbField] = found ? csvRow[found] : '';
      }
    });

    return alumni;
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setImportStatus(null);

    // Parse and preview file
    Papa.parse(selectedFile, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      preview: 5,
      complete: (results) => {
        if (results.data.length > 0) {
          const mapped = results.data.map(row => mapCSVToAlumni(row));
          setPreview(mapped);
        }
      },
      error: (error) => {
        setImportStatus({
          type: 'error',
          message: `Error reading file: ${error.message}`
        });
      }
    });
  };

  /**
   * Handle import
   */
  const handleImport = async () => {
    if (!file) {
      setImportStatus({ type: 'error', message: 'Please select a file' });
      return;
    }

    setLoading(true);
    setImportStatus(null);

    try {
      // Parse full file
      Papa.parse(file, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Map and validate
            const alumniList = results.data
              .map(row => mapCSVToAlumni(row, columnMapping))
              .filter(alumni => alumni.full_name && alumni.full_name.trim() !== '');

            if (alumniList.length === 0) {
              setImportStatus({
                type: 'error',
                message: 'No valid alumni records found in file'
              });
              setLoading(false);
              return;
            }

            // Batch insert
            let successCount = 0;
            let errorCount = 0;
            const batchSize = 100;

            for (let i = 0; i < alumniList.length; i += batchSize) {
              const batch = alumniList.slice(i, i + batchSize);

              const { error } = await supabase
                .from('alumni')
                .insert(batch);

              if (error) {
                console.error('Batch insert error:', error);
                errorCount += batch.length;
              } else {
                successCount += batch.length;
              }
            }

            setImportStatus({
              type: 'success',
              message: `Import completed: ${successCount} records inserted, ${errorCount} failed`
            });

            // Reset form
            setFile(null);
            setPreview([]);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }

          } catch (err) {
            setImportStatus({
              type: 'error',
              message: `Import error: ${err.message}`
            });
          } finally {
            setLoading(false);
          }
        },
        error: (error) => {
          setImportStatus({
            type: 'error',
            message: `File parsing error: ${error.message}`
          });
          setLoading(false);
        }
      });

    } catch (err) {
      setImportStatus({
        type: 'error',
        message: `Error: ${err.message}`
      });
      setLoading(false);
    }
  };

  return (
    <div className="alumni-import-container">
      <h2>Import Alumni Data</h2>

      <div className="import-section">
        <h3>Step 1: Select CSV File</h3>
        <p className="help-text">
          Export your Google Sheets as CSV file and upload it here
        </p>
        <div className="file-input-wrapper">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={loading}
          />
          {file && <span className="file-name">✓ {file.name}</span>}
        </div>
      </div>

      {preview.length > 0 && (
        <div className="import-section">
          <h3>Step 2: Preview Data</h3>
          <div className="preview-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Workplace</th>
                  <th>Position</th>
                  <th>LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((alumni, idx) => (
                  <tr key={idx}>
                    <td>{alumni.full_name}</td>
                    <td>{alumni.email}</td>
                    <td>{alumni.phone}</td>
                    <td>{alumni.workplace}</td>
                    <td>{alumni.position}</td>
                    <td>
                      {alumni.linkedin && (
                        <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer">
                          Profile
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="import-section">
        <h3>Generate Random Seed Data</h3>
        <p className="help-text">
          Buat data alumni acak yang masuk akal dan langsung simpan ke Supabase.
        </p>
        <div className="seed-controls">
          <label htmlFor="seedCount">Jumlah record</label>
          <input
            id="seedCount"
            type="number"
            min="1"
            max="100"
            value={seedCount}
            onChange={handleSeedCountChange}
            disabled={loading}
          />
          <button className="btn-secondary" type="button" onClick={handleGenerateSeedPreview} disabled={loading}>
            Preview Seed
          </button>
          <button className="btn-import" type="button" onClick={handleSeedInsert} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Seed ke Supabase'}
          </button>
          <button className="btn-secondary" type="button" onClick={handleResetSeedPreview} disabled={loading}>
            Reset Preview
          </button>
        </div>
      </div>

      {seedPreview.length > 0 && (
        <div className="import-section">
          <h3>Seed Preview</h3>
          <div className="preview-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Workplace</th>
                  <th>Position</th>
                  <th>Employment</th>
                </tr>
              </thead>
              <tbody>
                {seedPreview.map((alumni, idx) => (
                  <tr key={idx}>
                    <td>{alumni.full_name}</td>
                    <td>{alumni.email}</td>
                    <td>{alumni.phone}</td>
                    <td>{alumni.workplace}</td>
                    <td>{alumni.position}</td>
                    <td>{alumni.employment_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {importStatus && (
        <div className={`import-status ${importStatus.type}`}>
          {importStatus.type === 'success' ? '✓' : importStatus.type === 'warning' ? '⚠️' : '✗'} {importStatus.message}
        </div>
      )}

      <div className="import-actions">
        <button
          onClick={handleImport}
          disabled={loading || !file}
          className="btn-import"
        >
          {loading ? 'Importing...' : 'Import to Supabase'}
        </button>
      </div>

      <div className="import-info">
        <h4>Expected CSV Columns:</h4>
        <ul>
          <li><strong>Nama</strong> - Alumni full name (required)</li>
          <li><strong>Email</strong> - Email address</li>
          <li><strong>No HP</strong> - Phone number</li>
          <li><strong>LinkedIn</strong> - LinkedIn profile URL</li>
          <li><strong>Instagram</strong> - Instagram handle or URL</li>
          <li><strong>Facebook</strong> - Facebook profile URL</li>
          <li><strong>TikTok</strong> - TikTok profile URL</li>
          <li><strong>Tempat Bekerja</strong> - Workplace/Company name</li>
          <li><strong>Alamat Bekerja</strong> - Workplace address</li>
          <li><strong>Posisi</strong> - Job position/title</li>
          <li><strong>Status Kerja</strong> - Employment type (PNS/Swasta/Wirausaha)</li>
          <li><strong>Sosial Media Perusahaan</strong> - Company social media</li>
        </ul>
      </div>
    </div>
  );
};

export default AlumniImport;
