import fs from 'fs';
import path from 'path';

const randomFrom = (items) => items[Math.floor(Math.random() * items.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const normalizeSlug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/(^\.|\.$)+/g, '');

const firstNames = ['Adi', 'Budi', 'Citra', 'Dewi', 'Eka', 'Fajar', 'Gita', 'Hendra', 'Indra', 'Joko', 'Krisna', 'Lina', 'Maya', 'Nina', 'Oka', 'Putri', 'Rina', 'Sari', 'Taufik', 'Vina'];
const lastNames = ['Saputra', 'Yuliana', 'Pratama', 'Kristanto', 'Susanto', 'Wijaya', 'Ramadhan', 'Prasetyo', 'Halim', 'Nugroho', 'Kusuma', 'Amalia', 'Hartono', 'Azizah', 'Fauzan'];

const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'proton.me'];
const jobTitles = ['Senior Engineer', 'Manajer Operasional', 'Analis Data', 'Spesialis Pemasaran', 'Desainer Produk', 'Konsultan SDM', 'Staf Akademik', 'Kepala Program', 'Customer Success', 'Founder'];
const faculties = ['Teknik', 'Ekonomi', 'Ilmu Sosial', 'Ilmu Komputer', 'Psikologi', 'Hukum'];
const majors = ['Teknik Informatika', 'Manajemen', 'Psikologi', 'Akuntansi', 'Hukum', 'Sistem Informasi'];

const workplaces = {
  PNS: [
    {
      company: 'Dinas Pendidikan Kabupaten Sleman',
      address: 'Jalan Magelang No. 14, Sleman, DIY',
      social: 'https://www.instagram.com/dikpora.sleman/'
    },
    {
      company: 'RSUD Prof. Dr. Margono Soekarjo',
      address: 'Jl. Dr. Gumbreg No. 1, Purwokerto, Banyumas',
      social: 'https://www.facebook.com/rsudmargono'
    },
    {
      company: 'Kantor Kecamatan Depok',
      address: 'Jl. Parangtritis KM 11, Bantul, DIY',
      social: 'https://www.linkedin.com/company/kecamatan-depok/'
    }
  ],
  Swasta: [
    {
      company: 'PT Mitra Inovasi Digital',
      address: 'Jl. Raya Bogor No. 88, Jakarta Timur',
      social: 'https://www.linkedin.com/company/mitra-inovasi/'
    },
    {
      company: 'CV Solusi Edukasi Nusantara',
      address: 'Jl. Diponegoro No. 22, Semarang',
      social: 'https://www.instagram.com/solusiedukasinusantara/'
    },
    {
      company: 'PT Arunika Teknologi Indonesia',
      address: 'Jl. Gatot Subroto Kav. 45, Jakarta Selatan',
      social: 'https://www.tiktok.com/@arunika.tech'
    }
  ],
  Wirausaha: [
    {
      company: 'Kopi Nusantara',
      address: 'Jl. Pahlawan No. 11, Yogyakarta',
      social: 'https://www.instagram.com/kopi.nusantara.id/'
    },
    {
      company: 'Studio Foto Pixel',
      address: 'Jl. Malioboro No. 65, Yogyakarta',
      social: 'https://www.facebook.com/studiofotopixel/'
    },
    {
      company: 'Toko Kue Manis',
      address: 'Jl. Cendana No. 5, Bandung',
      social: 'https://www.tiktok.com/@tokokue.manis'
    }
  ]
};

const createSocialUrl = (name, network) => {
  const slug = normalizeSlug(name).replace(/\.+/g, '');
  switch (network) {
    case 'linkedin':
      return `https://www.linkedin.com/in/${slug}${randomInt(10, 99)}`;
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

const createRecord = () => {
  const fullName = `${randomFrom(firstNames)} ${randomFrom(lastNames)}`;
  const employmentType = randomFrom(['PNS', 'Swasta', 'Wirausaha']);
  const workplace = randomFrom(workplaces[employmentType]);
  const entryYear = randomFrom([2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]);
  const graduationYear = randomFrom([2019, 2020, 2021, 2022, 2023, 2024]);

  return {
    Nama: fullName,
    NIM: `20${randomInt(18, 24)}${randomInt(1000, 9999)}`,
    'Tahun Masuk': entryYear,
    'Tahun Lulus': graduationYear,
    Fakultas: randomFrom(faculties),
    'Program Studi': randomFrom(majors),
    LinkedIn: createSocialUrl(fullName, 'linkedin'),
    Instagram: createSocialUrl(fullName, 'instagram'),
    Facebook: createSocialUrl(fullName, 'facebook'),
    TikTok: createSocialUrl(fullName, 'tiktok'),
    Email: `${normalizeSlug(fullName)}${randomInt(1, 99)}@${randomFrom(emailDomains)}`,
    'No HP': `628${randomInt(111, 999)}${randomInt(1000, 9999)}${randomInt(1000, 9999)}`,
    'Tempat Bekerja': workplace.company,
    'Alamat Bekerja': workplace.address,
    Posisi: randomFrom(jobTitles),
    'Status Kerja': employmentType,
    'Sosial Media Perusahaan': workplace.social
  };
};

const toCsv = (rows) => {
  const headers = Object.keys(rows[0]);
  const quote = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const body = rows.map(row => headers.map(header => quote(row[header])).join(',')).join('\n');
  return `${headers.map(quote).join(',')}\n${body}`;
};

const main = () => {
  const count = Number(process.argv[2] || 20);
  if (!Number.isInteger(count) || count < 1 || count > 500) {
    console.error('Usage: node scripts/generate-alumni-seed.js [count]');
    console.error('count must be an integer between 1 and 500');
    process.exit(1);
  }

  const records = Array.from({ length: count }, createRecord);
  const csv = toCsv(records);
  const outputPath = path.resolve(process.cwd(), 'seed-alumni.csv');
  fs.writeFileSync(outputPath, csv, 'utf8');
  console.log(`Generated ${count} seed records to ${outputPath}`);
};

main();
