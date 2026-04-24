## Uji Kualitas Aplikasi (Validasi Data & Integrasi API OpenAI)

| No | Fitur | Aspek Kualitas | Skenario Pengujian | Data Uji | Hasil yang Diharapkan | Hasil Aktual | Status |
|----|------|----------------|--------------------|----------|----------------------|--------------|--------|
| 16 | Validasi Sosial Media | Functional Suitability | Input link LinkedIn, IG, FB, TikTok | Link valid | Sistem menerima hanya format URL valid | Link tervalidasi | ✅ Lulus |
| 17 | Validasi Sosial Media | Reliability | Input link tidak valid | "abc123" | Sistem menolak input | Muncul error validasi | ✅ Lulus |
| 18 | Validasi Email | Functional Suitability | Input email | user@gmail.com | Email valid diterima | Email tersimpan | ✅ Lulus |
| 19 | Validasi Email | Security | Input email aneh | test@@gmail | Ditolak | Error muncul | ✅ Lulus |
| 20 | Validasi No HP | Functional Suitability | Input nomor HP | 08123456789 | Format angka valid | Data tersimpan | ✅ Lulus |
| 21 | Validasi No HP | Reliability | Input huruf | 08abc | Ditolak | Error muncul | ✅ Lulus |
| 22 | Tempat Bekerja | Functional Suitability | Input nama perusahaan | PT Maju Jaya | Data tersimpan | Berhasil tersimpan | ✅ Lulus |
| 23 | Alamat Bekerja | Functional Suitability | Input alamat kerja | Surabaya | Data tersimpan | Berhasil tersimpan | ✅ Lulus |
| 24 | Posisi | Functional Suitability | Input jabatan | Software Engineer | Data tersimpan | Berhasil tersimpan | ✅ Lulus |
| 25 | Status Pekerjaan | Functional Suitability | Pilih kategori | PNS | Hanya pilihan valid | Tersimpan sesuai pilihan | ✅ Lulus |
| 26 | Sosial Media Perusahaan | Functional Suitability | Input link perusahaan | linkedin.com/company/... | Valid URL | Tersimpan | ✅ Lulus |
| 27 | Integrasi API OpenAI | Functional Suitability | Kirim data ke API | Data alumni | API memproses & validasi | Respon diterima | ✅ Lulus |
| 28 | Integrasi API OpenAI | Performance | Response API | Request data | < 5 detik | ±2 detik | ✅ Lulus |
| 29 | Integrasi API OpenAI | Reliability | API key salah | invalid key | Request ditolak | Error API muncul | ✅ Lulus |
| 30 | Integrasi API OpenAI | Security | API key disembunyikan | .env | Tidak expose di frontend | Aman | ✅ Lulus |
