/**
 * Alumni Data Operations Utility
 * Reusable functions for alumni-related database operations
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pkmyssnpsswglepawngc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrbXlzc25wc3N3Z2xlcGF3bmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODQ1MDYsImV4cCI6MjA5MjM2MDUwNn0.fUYK0Zu9dLM5oLw0SqwEY_AbCsPjYd_LLjSzaqVgR6U';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Column mapping for CSV to database fields
 */
export const COLUMN_MAPPING = {
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
  employment_type: ['Status Kerja', 'status_kerja', 'Employment Type', 'PNS/Swasta/Wirausaha'],
  workplace_social_media: ['Sosial Media Perusahaan', 'sosial_media_perusahaan', 'Company Social Media']
};

/**
 * Map CSV row to alumni database object
 */
export function mapCSVToAlumni(csvRow, customMapping = {}) {
  const alumni = {};

  Object.entries(COLUMN_MAPPING).forEach(([dbField, possibleColumns]) => {
    if (customMapping[dbField]) {
      alumni[dbField] = csvRow[customMapping[dbField]] || '';
    } else {
      const found = possibleColumns.find(col => col in csvRow);
      alumni[dbField] = found ? csvRow[found] : '';
    }
  });

  return alumni;
}

/**
 * Validate alumni data
 */
export function validateAlumni(alumni) {
  const errors = [];

  // Check required fields
  if (!alumni.full_name || alumni.full_name.trim() === '') {
    errors.push('Nama alumni wajib diisi');
  }

  // Validate email format if provided
  if (alumni.email && alumni.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(alumni.email)) {
      errors.push(`Email tidak valid: ${alumni.email}`);
    }
  }

  // Validate phone format if provided (basic check)
  if (alumni.phone && alumni.phone.trim() !== '') {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(alumni.phone)) {
      errors.push(`Nomor HP tidak valid: ${alumni.phone}`);
    }
  }

  // Validate employment type if provided
  const validEmploymentTypes = ['PNS', 'Swasta', 'Wirausaha', ''];
  if (alumni.employment_type && !validEmploymentTypes.includes(alumni.employment_type.trim())) {
    errors.push(`Status kerja tidak valid: ${alumni.employment_type}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Batch insert alumni data
 */
export async function batchInsertAlumni(alumniList, batchSize = 100) {
  const results = {
    total: alumniList.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
    details: []
  };

  for (let i = 0; i < alumniList.length; i += batchSize) {
    const batch = alumniList.slice(i, i + batchSize);

    try {
      const { data, error } = await supabase
        .from('alumni')
        .insert(batch)
        .select();

      if (error) {
        results.errorCount += batch.length;
        results.errors.push(error);
        results.details.push({
          batch: Math.floor(i / batchSize) + 1,
          status: 'error',
          error: error.message
        });
      } else {
        results.successCount += batch.length;
        results.details.push({
          batch: Math.floor(i / batchSize) + 1,
          status: 'success',
          count: batch.length
        });
      }
    } catch (err) {
      results.errorCount += batch.length;
      results.errors.push(err);
      results.details.push({
        batch: Math.floor(i / batchSize) + 1,
        status: 'error',
        error: err.message
      });
    }
  }

  return results;
}

/**
 * Get all alumni
 */
export async function getAllAlumni() {
  const { data, error } = await supabase
    .from('alumni')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get alumni by ID
 */
export async function getAlumniById(id) {
  const { data, error } = await supabase
    .from('alumni')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update alumni data
 */
export async function updateAlumni(id, updates) {
  const { data, error } = await supabase
    .from('alumni')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete alumni
 */
export async function deleteAlumni(id) {
  const { error } = await supabase
    .from('alumni')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Search alumni
 */
export async function searchAlumni(query) {
  const { data, error } = await supabase
    .from('alumni')
    .select('*')
    .or(
      `full_name.ilike.%${query}%,email.ilike.%${query}%,workplace.ilike.%${query}%,phone.ilike.%${query}%`
    );

  if (error) throw error;
  return data;
}

/**
 * Get alumni statistics
 */
export async function getAlumniStatistics() {
  const { data, error } = await supabase
    .from('alumni')
    .select('employment_type');

  if (error) throw error;

  const stats = {
    total: data.length,
    byEmploymentType: {},
    withEmail: 0,
    withPhone: 0,
    withLinkedIn: 0,
    withInstagram: 0,
    withFacebook: 0,
    withTikTok: 0
  };

  const { data: allData, error: allError } = await supabase
    .from('alumni')
    .select('*');

  if (allError) throw allError;

  allData.forEach(alumni => {
    // Employment type stats
    const empType = alumni.employment_type || 'Tidak Diisi';
    stats.byEmploymentType[empType] = (stats.byEmploymentType[empType] || 0) + 1;

    // Contact info stats
    if (alumni.email) stats.withEmail++;
    if (alumni.phone) stats.withPhone++;
    if (alumni.linkedin) stats.withLinkedIn++;
    if (alumni.instagram) stats.withInstagram++;
    if (alumni.facebook) stats.withFacebook++;
    if (alumni.tiktok) stats.withTikTok++;
  });

  return stats;
}

/**
 * Export alumni to CSV format
 */
export function exportAlumniToCSV(alumniList) {
  const headers = [
    'Nama',
    'NIM',
    'Tahun Masuk',
    'Tahun Lulus',
    'Email',
    'No HP',
    'LinkedIn',
    'Instagram',
    'Facebook',
    'TikTok',
    'Tempat Bekerja',
    'Alamat Bekerja',
    'Posisi',
    'Status Kerja',
    'Sosial Media Perusahaan'
  ];

  const rows = alumniList.map(alumni => [
    alumni.full_name || '',
    alumni.nim || '',
    alumni.entry_year || '',
    alumni.graduation_date || '',
    alumni.email || '',
    alumni.phone || '',
    alumni.linkedin || '',
    alumni.instagram || '',
    alumni.facebook || '',
    alumni.tiktok || '',
    alumni.workplace || '',
    alumni.workplace_address || '',
    alumni.position || '',
    alumni.employment_type || '',
    alumni.workplace_social_media || ''
  ]);

  // Escape CSV values
  const csvHeaders = headers.map(h => `"${h}"`).join(',');
  const csvRows = rows
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return `${csvHeaders}\n${csvRows}`;
}

/**
 * Download CSV file
 */
export function downloadCSV(csv, filename = 'alumni_export.csv') {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default {
  supabase,
  COLUMN_MAPPING,
  mapCSVToAlumni,
  validateAlumni,
  batchInsertAlumni,
  getAllAlumni,
  getAlumniById,
  updateAlumni,
  deleteAlumni,
  searchAlumni,
  getAlumniStatistics,
  exportAlumniToCSV,
  downloadCSV
};
