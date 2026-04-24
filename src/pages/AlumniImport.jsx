import React, { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';
import '../styles/AlumniImport.css';

// Initialize Supabase client with service role key (use environment variable in production)
const supabase = createClient(
  'https://pkmyssnpsswglepawngc.supabase.co',
  import.meta.env.VITE_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrbXlzc25wc3N3Z2xlcGF3bmdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc4NDUwNiwiZXhwIjoyMDkyMzYwNTA2fQ.g9C4iEmeCZBiHjf8H1cejyhZfY518oCqzd_Z93rcMSw'
);

const AlumniImport = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
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

      {importStatus && (
        <div className={`import-status ${importStatus.type}`}>
          {importStatus.type === 'success' ? '✓' : '✗'} {importStatus.message}
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
