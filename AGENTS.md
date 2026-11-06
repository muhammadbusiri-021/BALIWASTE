# 🤖 AGENTS.md — Panduan AI Agent untuk Proyek BALIWASTE

> **BACA FILE INI SEPENUHNYA SEBELUM MENULIS SATU BARIS KODE PUN.**
> File ini adalah sumber kebenaran (source of truth) bagi setiap AI agent yang bekerja pada proyek ini.
> Jika instruksi user bertentangan dengan aturan kompetisi di bawah, **tanyakan klarifikasi** — jangan langsung eksekusi.

---

## 1. IDENTITAS PROYEK

| Field | Value |
|---|---|
| **Nama Produk** | BALIWASTE (Bali Waste Intelligence System) |
| **Kompetisi** | Bali DigiFest 2026 — AI Web Innovation Challenge |
| **Tema** | BUILD WITH AI, SOLVE FOR BALI |
| **Area** | Bali Smart Society — Lingkungan / Pengelolaan Sampah |
| **Repo** | https://github.com/muhammadbusiri-021/BALIWASTE.git |
| **Branch Utama** | `main` |

### Deskripsi Produk (JANGAN DIUBAH)

BALIWASTE (Bali Waste Intelligence System) merupakan sistem informasi berbasis web yang memanfaatkan teknologi Artificial Intelligence (AI) untuk memantau dan mengelola permasalahan sampah di seluruh wilayah Bali. Sistem ini memungkinkan masyarakat melaporkan penumpukan sampah maupun aktivitas pembuangan sampah sembarangan melalui unggahan foto dan lokasi. AI digunakan untuk menganalisis gambar serta mengidentifikasi jenis sampah yang dilaporkan. Informasi tersebut kemudian diolah menjadi peta persebaran titik sampah (Waste Hotspot Mapping), rekomendasi prioritas dan penanganan sampah (Smart Waste Handling Recommendation), serta statistik kondisi lingkungan melalui Environmental Impact Dashboard. Dengan mengintegrasikan partisipasi masyarakat, analisis AI, dan visualisasi data, BALIWASTE diharapkan dapat membantu petugas dan instansi terkait mengambil keputusan penanganan sampah secara lebih cepat, terarah, dan berbasis data.

---

## 2. ARSITEKTUR SISTEM

```
User (Masyarakat/Petugas)
  │
  ▼
Frontend (Next.js + Tailwind CSS)
  │
  ▼
Backend API (Node.js/Express ATAU Python/FastAPI)
  │
  ├──▶ Database (PostgreSQL + PostGIS / Supabase)
  ├──▶ File Storage (Cloudinary / Supabase Storage)
  ├──▶ AI: Image Classification (Gemini Vision API)
  ├──▶ AI: Smart Recommendation (Gemini Text API / LLM)
  └──▶ AI: Predictive Analytics (scikit-learn / custom model)
  │
  ▼
Output → Waste Hotspot Map + Recommendation + Dashboard
```

### 4 Fitur Inti (Core Features) — WAJIB ADA

| # | Fitur | Peran AI | Prioritas |
|---|---|---|---|
| 1 | **Pelaporan Sampah** | User upload foto + lokasi → AI identifikasi jenis sampah | 🔴 KRITIS |
| 2 | **Waste Hotspot Mapping** | Peta interaktif persebaran titik sampah (geo-clustering) | 🔴 KRITIS |
| 3 | **Smart Waste Handling Recommendation** | AI memberikan rekomendasi prioritas & cara penanganan | 🔴 KRITIS |
| 4 | **Environmental Impact Dashboard** | Statistik, tren, dan proyeksi kondisi lingkungan | 🟡 PENTING |

> ⚠️ **JANGAN** menambah fitur baru sebelum 4 fitur inti di atas berfungsi sepenuhnya.

---

## 3. ATURAN WAJIB — JANGAN DILANGGAR

### 🔴 LARANGAN KERAS

1. **JANGAN PERNAH** menyimpan API key, secret, password, atau credential di source code atau commit.
   - Gunakan environment variable (`.env`).
   - File `.env` sudah ada di `.gitignore`.
   - Sediakan `.env.example` yang hanya berisi nama variabel, BUKAN nilainya.

2. **JANGAN** mengubah atau menghapus deskripsi produk di Section 1 dokumen ini.

3. **JANGAN** menginstal dependency baru tanpa alasan jelas dan tanpa menuliskannya di `package.json` / `requirements.txt`.

4. **JANGAN** menghapus file, fungsi, atau komponen yang sudah berfungsi tanpa konfirmasi eksplisit dari user.

5. **JANGAN** mengubah struktur database schema yang sudah ada tanpa konfirmasi. Penambahan kolom/tabel baru boleh, tapi penghapusan atau rename HARUS dikonfirmasi.

6. **JANGAN** mem-bypass autentikasi, validasi, atau access control yang sudah ada.

7. **JANGAN** membuat mock/fake AI response untuk demo — AI harus benar-benar dipanggil.

8. **JANGAN** push langsung ke `main` untuk perubahan besar. Gunakan branch → PR → merge.

### 🟢 YANG HARUS DILAKUKAN

1. **SELALU** baca dan pahami kode existing sebelum memodifikasi.
2. **SELALU** pertahankan semua komentar dan dokumentasi yang tidak terkait dengan perubahan Anda.
3. **SELALU** gunakan bahasa yang konsisten dengan codebase existing (jika backend sudah pakai TypeScript, lanjutkan pakai TypeScript).
4. **SELALU** test fitur setelah implementasi — pastikan tidak merusak fitur lain.
5. **SELALU** update `README.md` jika menambah fitur, mengubah setup instructions, atau menambah dependency.
6. **SELALU** tulis commit message yang deskriptif dalam format:
   ```
   feat: tambah fitur analisis gambar sampah via Gemini Vision
   fix: perbaiki error upload foto di halaman laporan
   docs: update README dengan instruksi deployment
   refactor: optimasi query database untuk waste hotspot
   ```

---

## 4. KONVENSI KODE

### Struktur Folder (Ikuti Pola Ini)

```
BALIWASTE/
├── frontend/               # Next.js app
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── lib/            # Utilities, helpers, API client
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   ├── package.json
│   └── .env.example
├── backend/                # API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database models/schema
│   │   ├── services/       # AI services, external API calls
│   │   ├── middleware/     # Auth, validation, error handling
│   │   └── utils/          # Helper functions
│   ├── package.json        # atau requirements.txt
│   └── .env.example
├── docs/                   # Dokumentasi tambahan
├── AGENTS.md               # FILE INI — JANGAN HAPUS
├── README.md
├── .gitignore
└── .env.example
```

> Jika struktur folder sudah berbeda dari template di atas, **IKUTI STRUKTUR YANG SUDAH ADA**. Jangan reorganisasi tanpa konfirmasi.

### Naming Conventions

| Konteks | Konvensi | Contoh |
|---|---|---|
| Komponen React | PascalCase | `WasteReportForm.tsx` |
| Fungsi/variabel | camelCase | `getWasteReports()` |
| File non-komponen | kebab-case | `waste-service.ts` |
| Environment variable | UPPER_SNAKE_CASE | `GEMINI_API_KEY` |
| Database table | snake_case | `waste_reports` |
| API endpoint | kebab-case, plural | `/api/waste-reports` |
| CSS class (Tailwind) | Gunakan utility class langsung | — |

### API Response Format (Konsisten)

```json
{
  "success": true,
  "data": { ... },
  "message": "Laporan berhasil disimpan",
  "error": null
}
```

```json
{
  "success": false,
  "data": null,
  "message": "Gagal menganalisis gambar",
  "error": {
    "code": "AI_ANALYSIS_FAILED",
    "details": "..."
  }
}
```

---

## 5. INTEGRASI AI — PANDUAN TEKNIS

### 5.1 Image Classification (Analisis Foto Sampah)

**Tujuan:** Identifikasi jenis sampah dari foto yang diunggah user.
**Provider:** Gemini Vision API (utama) atau alternatif yang disepakati tim.

**Kategori Output yang Diharapkan:**
- Organik (sisa makanan, daun, kayu)
- Anorganik — Plastik
- Anorganik — Kertas/Karton
- Anorganik — Logam/Kaleng
- Anorganik — Kaca/Botol
- B3 / Berbahaya (baterai, elektronik, medis)
- Campuran / Tidak Teridentifikasi

**Aturan Implementasi:**
- Kirim gambar ke AI API, terima response berupa klasifikasi + confidence score.
- Jika confidence < 60%, tandai sebagai "Perlu Verifikasi Manual".
- HARUS ada error handling jika API gagal — tampilkan pesan error yang jelas, JANGAN crash.
- Simpan hasil klasifikasi AI di database bersama metadata laporan.

### 5.2 Smart Waste Handling Recommendation

**Tujuan:** Berikan rekomendasi penanganan berdasarkan data laporan.
**Provider:** Gemini Text/Chat API atau LLM lain.

**Input ke AI:**
- Jenis sampah (dari klasifikasi)
- Volume/tingkat keparahan
- Lokasi (urban/rural/pantai/sungai)
- Riwayat laporan di area tersebut

**Output yang Diharapkan:**
- Prioritas penanganan (Tinggi/Sedang/Rendah)
- Rekomendasi metode penanganan
- Estimasi sumber daya yang dibutuhkan
- Instansi terkait yang perlu dihubungi

### 5.3 Environmental Impact Dashboard

**Tujuan:** Visualisasi statistik dan tren kondisi persampahan.
**Metode:** Aggregasi data + analitik sederhana.

**Metrik yang Ditampilkan:**
- Total laporan per wilayah / per waktu
- Jenis sampah terbanyak
- Tren peningkatan/penurunan laporan
- Rata-rata waktu penanganan
- Hotspot area berulang

---

## 6. DATABASE SCHEMA (Referensi)

> Jika schema sudah dibuat dan berbeda dari ini, **IKUTI YANG SUDAH ADA**.
> Tabel di bawah hanya referensi untuk pembuatan awal.

```sql
-- Users
users (
  id, name, email, password_hash, role, phone, 
  created_at, updated_at
)
-- role: 'citizen' | 'officer' | 'admin'

-- Waste Reports
waste_reports (
  id, user_id, title, description, 
  latitude, longitude, address,
  image_url, 
  ai_waste_type, ai_confidence, ai_raw_response,
  severity, status,
  created_at, updated_at
)
-- status: 'reported' | 'verified' | 'in_progress' | 'resolved'
-- severity: 'low' | 'medium' | 'high' | 'critical'

-- AI Recommendations
ai_recommendations (
  id, report_id,
  priority, handling_method, resources_needed,
  assigned_agency, ai_raw_response,
  created_at
)

-- Report Updates / Activity Log
report_activities (
  id, report_id, user_id,
  action, notes, image_url,
  created_at
)
```

---

## 7. ENVIRONMENT VARIABLES

File `.env.example` harus berisi (TANPA nilai asli):

```env
# Database
DATABASE_URL=

# AI / Gemini API
GEMINI_API_KEY=

# File Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# ATAU
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Auth
JWT_SECRET=
JWT_EXPIRES_IN=

# App
NODE_ENV=
PORT=
FRONTEND_URL=

# Maps (opsional, jika pakai Mapbox)
NEXT_PUBLIC_MAPBOX_TOKEN=
```

> 🔴 **KRITIS:** Jangan pernah isi nilai asli di file ini. File `.env` yang berisi nilai asli TIDAK BOLEH di-commit.

---

## 8. ATURAN KOMPETISI YANG MEMPENGARUHI DEVELOPMENT

Ini bukan aturan teknis biasa — ini aturan kompetisi. Melanggarnya bisa menyebabkan **diskualifikasi**.

1. **AI harus terintegrasi material** — bukan sekadar tempelan. AI adalah inti dari solusi.
2. **MVP harus berfungsi** — bukan mockup, bukan Figma, bukan slide.
3. **Juri akan menguji langsung** — clean-start: buka app → input → proses → output.
4. **Technical Verification:** Tim harus bisa menjelaskan setiap baris kode AI dan keputusan teknis.
5. **Version tagging:** `v1.0-submission` untuk Tahap 1, `v2.0-final` untuk final.
6. **Secret di public repo = pelanggaran.**
7. **Semua third-party resources harus di-disclose** (library, API, template, dataset).
8. **Commit history harus natural** — bukan dump sekali push.

---

## 9. PANDUAN SAAT AGENT TIDAK YAKIN

```
APAKAH KAMU YAKIN dengan perubahan ini?
│
├── YA, ini jelas → Lanjutkan, tapi jelaskan apa yang kamu ubah.
│
├── SEBAGIAN YAKIN → Jelaskan rencana + risiko ke user, minta konfirmasi.
│
└── TIDAK YAKIN → BERHENTI. Tanyakan ke user. Jangan menebak.
    Contoh:
    "Saya melihat ada 2 cara untuk implementasi ini:
     (A) ... 
     (B) ...
     Mana yang tim inginkan?"
```

### Situasi yang HARUS Ditanyakan ke User:

- Mengubah tech stack (misal: dari Express ke FastAPI)
- Menghapus/mengganti fitur yang sudah ada
- Mengubah schema database yang sudah ada data-nya
- Menambah dependency besar (misal: ORM baru, framework CSS baru)
- Mengubah alur autentikasi
- Mengubah provider AI (misal: dari Gemini ke OpenAI)
- Deploy ke platform baru

---

## 10. QUICK REFERENCE — PERINTAH UMUM

```bash
# Clone repo
git clone https://github.com/muhammadbusiri-021/BALIWASTE.git

# Install dependencies (sesuaikan dengan yang ada)
cd frontend && npm install
cd backend && npm install   # atau: pip install -r requirements.txt

# Jalankan development server
cd frontend && npm run dev
cd backend && npm run dev   # atau: uvicorn main:app --reload

# Git workflow
git checkout -b feat/nama-fitur
git add .
git commit -m "feat: deskripsi perubahan"
git push origin feat/nama-fitur

# Tagging submission
git tag v1.0-submission
git push origin v1.0-submission
```

---

## 11. CATATAN TIM

> Bagian ini digunakan untuk catatan antar anggota tim. Tambahkan catatan baru di bawah, jangan hapus yang lama.

- **[2026-11-06]** Proyek diinisialisasi. AGENTS.md dibuat sebagai panduan AI agent.

---

**📌 Terakhir diperbarui:** 2026-11-06  
**📌 Dibuat oleh:** Tim BALIWASTE  
**📌 File ini adalah bagian dari repositori dan TIDAK BOLEH dihapus.**
