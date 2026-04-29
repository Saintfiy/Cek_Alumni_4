import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pkmyssnpsswglepawngc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrbXlzc25wc3N3Z2xlcGF3bmdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODQ1MDYsImV4cCI6MjA5MjM2MDUwNn0.fUYK0Zu9dLM5oLw0SqwEY_AbCsPjYd_LLjSzaqVgR6U';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dummyData = [
  {
    full_name: 'Budi Santoso',
    nim: '12345678',
    entry_year: '2019',
    graduation_date: '2023',
    faculty: 'Teknik',
    major: 'Teknik Informatika',
    linkedin: 'https://www.linkedin.com/in/budisantoso',
    instagram: 'https://www.instagram.com/budi.s',
    facebook: 'https://www.facebook.com/budi.santoso',
    tiktok: 'https://www.tiktok.com/@budisantoso',
    email: 'budi.santoso@example.com',
    phone: '081234567890',
    workplace: 'PT Maju Bersama',
    workplace_address: 'Jl. Sudirman No. 1, Jakarta',
    position: 'Software Engineer',
    employment_type: 'Swasta',
    workplace_social_media: 'https://www.linkedin.com/company/majubersama',
    tracking_status: 'Terverifikasi'
  },
  {
    full_name: 'Siti Aminah',
    nim: '87654321',
    entry_year: '2018',
    graduation_date: '2022',
    faculty: 'Ekonomi',
    major: 'Akuntansi',
    linkedin: 'https://www.linkedin.com/in/sitiaminah',
    instagram: 'https://www.instagram.com/siti_aminah',
    facebook: 'https://www.facebook.com/siti.aminah.123',
    tiktok: 'https://www.tiktok.com/@sitiaminah',
    email: 'siti.aminah@example.com',
    phone: '081987654321',
    workplace: 'Kementerian Keuangan',
    workplace_address: 'Jl. Lapangan Banteng Timur No. 2, Jakarta',
    position: 'Analis Keuangan',
    employment_type: 'PNS',
    workplace_social_media: 'https://www.instagram.com/kemenkeuri',
    tracking_status: 'Terverifikasi'
  },
  {
    full_name: 'Joko Widodo',
    nim: '11223344',
    entry_year: '2017',
    graduation_date: '2021',
    faculty: 'Teknik',
    major: 'Teknik Mesin',
    linkedin: '',
    instagram: 'https://www.instagram.com/jokowi_tech',
    facebook: '',
    tiktok: '',
    email: 'joko.w@example.com',
    phone: '085511223344',
    workplace: 'Bengkel Mandiri',
    workplace_address: 'Jl. Raya Bogor KM 30, Depok',
    position: 'Pemilik',
    employment_type: 'Wirausaha',
    workplace_social_media: 'https://www.instagram.com/bengkelmandiri',
    tracking_status: 'Perlu Verifikasi Manual'
  }
];

async function seed() {
  for (const data of dummyData) {
    const { error } = await supabase.from('alumni').insert(data);
    if (error) {
      console.error('Error inserting:', data.full_name, error);
    } else {
      console.log('Inserted:', data.full_name);
    }
  }
  console.log('Seeding finished.');
}

seed();
