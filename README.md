## Uji Kualitas Aplikasi (Berdasarkan Use Case & ISO 25010)

| No | Use Case | Aspek Kualitas | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Hasil Aktual | Status |
|----|----------|----------------|--------------------|----------|----------------------|--------------|--------|
| 1  | UC-01 Input Data Alumni | Functional Suitability | Input data alumni baru | NIM: 12345 | Data tersimpan dengan status Pending | Data masuk ke database (Pending) |  Lulus |
| 2  | UC-01 Input Data Alumni | Reliability | Input NIM duplikat | NIM: 12345 (sudah ada) | Sistem menolak input | Muncul pesan "NIM sudah terdaftar!" |  Lulus |
| 3  | UC-01 Input Data Alumni | Usability | Isi form oleh user | Data lengkap | Form mudah diisi | User dapat submit tanpa kendala |  Lulus |
| 4  | UC-02 Lihat Daftar Alumni | Functional Suitability | Tampilkan data verified | Status: Verified | Data tampil di halaman list | Data tampil sesuai filter |  Lulus |
| 5  | UC-02 Lihat Daftar Alumni | Performance Efficiency | Load halaman list | - | < 3 detik | ±1 detik |  Lulus |
| 6  | UC-03 Dashboard Statistik | Functional Suitability | Hitung jumlah alumni | Data campuran | Statistik sesuai database | Jumlah sesuai |  Lulus |
| 7  | UC-04 Verifikasi Alumni | Functional Suitability | Admin verifikasi data | Status: Pending | Status berubah ke Verified | Data berubah & tampil publik |  Lulus |
| 8  | UC-05 Tolak Alumni | Functional Suitability | Admin menolak data | Status: Pending | Status menjadi Rejected | Data tidak tampil publik |  Lulus |
| 9  | UC-06 Hapus Alumni | Reliability | Hapus data alumni | ID valid | Data terhapus permanen | Data hilang dari database |  Lulus |
| 10 | UC-06 Hapus Alumni | Usability | Konfirmasi hapus | Klik batal | Data tidak terhapus | Sistem membatalkan |  Lulus |
| 11 | UC-07 Lihat Semua Data | Functional Suitability | Admin lihat semua data | Semua status | Semua data tampil | Data lengkap terlihat |  Lulus |
| 12 | UC-08 Filter Laporan | Functional Suitability | Filter berdasarkan tahun | Tahun: 2020 | Data sesuai filter | Data sesuai tahun |  Lulus |
| 13 | UC-08 Cetak Laporan | Compatibility | Cetak di browser | Chrome | Tampilan print rapi | Print berjalan normal |  Lulus |
| 14 | Sistem Keseluruhan | Security | Input karakter aneh | ' OR 1=1 | Tidak error / aman | Tidak crash |  Lulus |
| 15 | Sistem Keseluruhan | Portability | Akses di device berbeda | Laptop lain | Sistem tetap berjalan | Berjalan normal |  Lulus |
