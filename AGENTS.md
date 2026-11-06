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

### Tech Stack (FINAL — Jangan Ganti Tanpa Konfirmasi Tim)

| Layer | Teknologi |
|---|---|
| **Bahasa** | TypeScript (strict mode) |
| **Framework** | Next.js (App Router) — fullstack, 1 folder |
| **Styling** | Tailwind CSS |
| **Database** | PostgreSQL + PostGIS (data geospasial) |
| **ORM** | Prisma / Drizzle (sesuaikan dengan yang sudah ada) |
| **AI Provider** | Gemini API (Vision + Text) |
| **File Storage** | Cloudinary / Supabase Storage |
| **Maps** | Leaflet.js + OpenStreetMap / Mapbox |
| **Hosting** | Vercel (atau platform lain yang disepakati) |

### Arsitektur Fullstack Next.js

```
User (Masyarakat/Petugas)
  │
  ▼
Next.js App (TypeScript)
  ├── Frontend: React (App Router + Server/Client Components)
  ├── Backend:  API Routes (/app/api/...)
  │     │
  │     ├──▶ Database (PostgreSQL + PostGIS)
  │     ├──▶ File Storage (Cloudinary / Supabase Storage)
  │     ├──▶ AI: Image Classification (Gemini Vision API)
  │     ├──▶ AI: Smart Recommendation (Gemini Text API / LLM)
  │     └──▶ AI: Predictive Analytics (aggregasi data + AI)
  │
  ▼
Output → Waste Hotspot Map + Recommendation + Dashboard
```

> ⚠️ **PENTING:** Frontend dan Backend ada dalam SATU project Next.js.
> - Halaman/UI → `src/app/(routes)/...`
> - API endpoint → `src/app/api/...`
> - JANGAN buat folder `backend/` terpisah.

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
3. **SELALU** gunakan **TypeScript** secara konsisten. Jangan campur `.js` dan `.ts` — semua file harus `.ts` atau `.tsx`.
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
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Route group: login, register
│   │   ├── (dashboard)/        # Route group: dashboard, admin
│   │   ├── (main)/             # Route group: landing, about
│   │   ├── api/                # API Routes (backend)
│   │   │   ├── auth/           # POST /api/auth/login, register
│   │   │   ├── reports/        # CRUD /api/reports
│   │   │   ├── ai/             # POST /api/ai/classify, recommend
│   │   │   ├── hotspot/        # GET /api/hotspot
│   │   │   └── dashboard/      # GET /api/dashboard/stats
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles + Tailwind
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Primitif UI (Button, Card, Input, dll)
│   │   ├── forms/              # Form components (ReportForm, LoginForm)
│   │   ├── maps/               # Map components (HotspotMap, LocationPicker)
│   │   └── charts/             # Chart/dashboard components
│   ├── lib/                    # Utilities & shared logic
│   │   ├── db.ts               # Database client (Prisma/Drizzle)
│   │   ├── ai.ts               # Gemini API client & helpers
│   │   ├── auth.ts             # Auth helpers (JWT, session)
│   │   ├── storage.ts          # File upload helpers
│   │   ├── validators.ts       # Zod schemas / validation
│   │   └── utils.ts            # General utilities
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Shared types & interfaces
│   └── constants/              # App constants, enums
├── prisma/                     # Prisma schema & migrations (jika pakai Prisma)
│   ├── schema.prisma
│   └── migrations/
├── public/                     # Static assets (images, icons)
├── docs/                       # Dokumentasi tambahan
├── AGENTS.md                   # FILE INI — JANGAN HAPUS
├── README.md
├── .env.example                # Template env (TANPA secret)
├── .env.local                  # Env lokal (JANGAN commit)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

> Jika struktur folder sudah berbeda dari template di atas, **IKUTI STRUKTUR YANG SUDAH ADA**. Jangan reorganisasi tanpa konfirmasi.

### Naming Conventions

| Konteks | Konvensi | Contoh |
|---|---|---|
| Komponen React | PascalCase | `WasteReportForm.tsx` |
| Fungsi/variabel | camelCase | `getWasteReports()` |
| File non-komponen | kebab-case | `waste-service.ts` |
| API Route handler | `route.ts` di dalam folder | `src/app/api/reports/route.ts` |
| Server Actions | camelCase, prefix `action` | `actionCreateReport()` |
| Environment variable | UPPER_SNAKE_CASE | `GEMINI_API_KEY` |
| Database table (Prisma) | PascalCase model, snake_case di DB | `model WasteReport` → `waste_reports` |
| API endpoint | kebab-case, plural | `/api/waste-reports` |
| TypeScript types/interfaces | PascalCase, prefix `I` opsional | `WasteReport`, `ApiResponse<T>` |
| CSS class (Tailwind) | Gunakan utility class langsung | — |

### API Response Format (Konsisten)

Gunakan generic type untuk response API:

```typescript
// src/types/index.ts
type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
  error: {
    code: string;
    details: string;
  } | null;
};
```

Contoh sukses:
```json
{
  "success": true,
  "data": { "id": "...", "wasteType": "plastik" },
  "message": "Laporan berhasil disimpan",
  "error": null
}
```

Contoh error:
```json
{
  "success": false,
  "data": null,
  "message": "Gagal menganalisis gambar",
  "error": {
    "code": "AI_ANALYSIS_FAILED",
    "details": "Gemini API returned 500"
  }
}
```

### Aturan TypeScript

1. **Strict mode ON** — `"strict": true` di `tsconfig.json`.
2. **JANGAN** pakai `any` kecuali benar-benar terpaksa. Gunakan `unknown` lalu narrowing.
3. **SELALU** definisikan type/interface untuk: props komponen, API request/response, database model.
4. **Gunakan Zod** untuk validasi runtime pada API routes.
5. **Gunakan `"use client"`** hanya pada komponen yang memang butuh client-side interactivity. Default ke Server Component.
6. **Data fetching** di server: gunakan Server Components atau `route.ts` API handlers. Hindari `useEffect` untuk fetch data awal.

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

### Prisma Schema (referensi)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CITIZEN
  OFFICER
  ADMIN
}

enum ReportStatus {
  REPORTED
  VERIFIED
  IN_PROGRESS
  RESOLVED
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String   @map("password_hash")
  role         Role     @default(CITIZEN)
  phone        String?
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  reports    WasteReport[]
  activities ReportActivity[]

  @@map("users")
}

model WasteReport {
  id          String       @id @default(cuid())
  userId      String       @map("user_id")
  title       String
  description String?
  latitude    Float
  longitude   Float
  address     String?
  imageUrl    String       @map("image_url")
  aiWasteType String?      @map("ai_waste_type")
  aiConfidence Float?      @map("ai_confidence")
  aiRawResponse Json?      @map("ai_raw_response")
  severity    Severity     @default(LOW)
  status      ReportStatus @default(REPORTED)
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  user           User              @relation(fields: [userId], references: [id])
  recommendation AiRecommendation?
  activities     ReportActivity[]

  @@map("waste_reports")
}

model AiRecommendation {
  id              String   @id @default(cuid())
  reportId        String   @unique @map("report_id")
  priority        String
  handlingMethod  String   @map("handling_method")
  resourcesNeeded String?  @map("resources_needed")
  assignedAgency  String?  @map("assigned_agency")
  aiRawResponse   Json?    @map("ai_raw_response")
  createdAt       DateTime @default(now()) @map("created_at")

  report WasteReport @relation(fields: [reportId], references: [id])

  @@map("ai_recommendations")
}

model ReportActivity {
  id        String   @id @default(cuid())
  reportId  String   @map("report_id")
  userId    String   @map("user_id")
  action    String
  notes     String?
  imageUrl  String?  @map("image_url")
  createdAt DateTime @default(now()) @map("created_at")

  report WasteReport @relation(fields: [reportId], references: [id])
  user   User        @relation(fields: [userId], references: [id])

  @@map("report_activities")
}
```

---

## 7. ENVIRONMENT VARIABLES

File `.env.example` harus berisi (TANPA nilai asli):

```env
# Database (PostgreSQL)
DATABASE_URL=

# AI / Gemini API
GEMINI_API_KEY=

# File Storage (pilih salah satu)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
# ATAU
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Auth
JWT_SECRET=
# ATAU NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# App
NODE_ENV=
PORT=

# Maps (opsional)
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
cd BALIWASTE

# Install dependencies
npm install

# Setup database (Prisma)
npx prisma generate
npx prisma db push        # atau: npx prisma migrate dev

# Jalankan development server
npm run dev               # http://localhost:3000

# Git workflow
git checkout -b feat/nama-fitur
git add .
git commit -m "feat: deskripsi perubahan"
git push origin feat/nama-fitur

# Tagging submission
git tag v1.0-submission
git push origin v1.0-submission

# Build & check sebelum deploy
npm run build
npm run lint
```

---

## 11. CATATAN TIM

> Bagian ini digunakan untuk catatan antar anggota tim. Tambahkan catatan baru di bawah, jangan hapus yang lama.

- **[2026-11-06]** Proyek diinisialisasi. AGENTS.md dibuat sebagai panduan AI agent.

---

**📌 Terakhir diperbarui:** 2026-11-06  
**📌 Dibuat oleh:** Tim BALIWASTE  
**📌 File ini adalah bagian dari repositori dan TIDAK BOLEH dihapus.**
