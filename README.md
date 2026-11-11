# MADURAWASTE — Madura Waste Intelligence System

> **Build with AI, Solve for Madura — Smart Society & Environmental Intelligence**  
> Sistem Informasi Terpadu Pemantauan, Klasifikasi Citra Berbasis AI, Pemetaan Titik Hotspot, Rekomendasi Penanganan Cerdas, dan Dashboard Dampak Lingkungan di Seluruh Wilayah Pulau Madura (Bangkalan, Sampang, Pamekasan, dan Sumenep).

---

## 1. Deskripsi Produk

**MADURAWASTE (Madura Waste Intelligence System)** merupakan platform sistem informasi berbasis web yang memanfaatkan teknologi Artificial Intelligence (AI) terkini untuk memantau, menganalisis, dan mempercepat penanganan persoalan timbulan sampah di seluruh kawasan Pulau Madura. 

Masyarakat dapat melaporkan lokasi timbulan sampah liar maupun sampah pesisir melalui foto dan penentuan titik koordinat peta. Model AI Gemini Vision secara otomatis menganalisis citra, mengklasifikasi kategori sampah (organik, anorganik plastik, kertas, logam, kaca, hingga limbah B3/oli nelayan), mengestimasi tingkat keparahan, serta memperkirakan volume. Informasi laporan diolah secara geospasial menjadi peta persebaran titik hotspot interaktif (*Waste Hotspot Mapping*), rekomendasi penanganan taktis lapangan berbasis regulasi daerah (*Smart Waste Handling Recommendation*), serta visualisasi metrik ekologis bagi pengambil kebijakan (*Environmental Impact Dashboard*).

---

## 2. Empat Fitur Inti (Core Features)

| # | Fitur | URL Rute | Peran AI / Algoritma | Status |
|---|---|---|---|---|
| 1 | **Pelaporan Sampah & AI Vision** | `/lapor` | **Gemini 3.5 Flash (Vision)**: Klasifikasi jenis sampah otomatis, confidence score, estimasi volume, dan deteksi keparahan secara real-time dari kamera/foto. | 100% Berfungsi |
| 2 | **Waste Hotspot Mapping** | `/hotspot` | **Geospatial Geo-Clustering & Heatmap**: Pemetaan interaktif Pulau Madura (Leaflet.js) dengan pencarian berjenjang hingga level Desa/Kelurahan, Kecamatan, dan 4 Kabupaten (Bangkalan, Sampang, Pamekasan, Sumenep). | 100% Berfungsi |
| 3 | **Smart Waste Handling AI** | `/rekomendasi` | **Gemini 3.5 Flash (LLM Decision Support)**: Rekomendasi metode penanganan taktis, estimasi kebutuhan armada/petugas, integrasi Perda 4 Kabupaten, dan matriks disposisi status tugas lapangan. | 100% Berfungsi |
| 4 | **Environmental Impact Dashboard** | `/dashboard` | **Predictive Analytics & Environmental Metrics**: Visualisasi KPI penanganan, komposisi sampah, tren mingguan, sebaran 4 kabupaten, estimasi reduksi CO2, pencegahan plastik laut, dan proyeksi muson. | 100% Berfungsi |

---

## 3. Cakupan Wilayah (4 Kabupaten se-Madura)

Sistem telah terkalibrasi khusus untuk memetakan koordinat dan struktur pemerintahan di 4 Kabupaten Pulau Madura:
1. **Kabupaten Bangkalan**: Gerbang barat Madura, koridor Jembatan Suramadu (Labang), Pelabuhan Kamal, kawasan pesisir Tanjungbumi, Bukit Jaddih, hingga sentra niaga Blega & Tanah Merah.
2. **Kabupaten Sampang**: Wilayah rawan banjir Kali Kemuning, kawasan wisata Pantai Camplong, muara & air terjun Toroan Pantura, sentra garam Pangarengan, dan TPA Torjun.
3. **Kabupaten Pamekasan**: Pusat grosir Pasar Kolpajung & Monumen Arek Lancor, dermaga perikanan PPI Branta Pesisir Tlanakan, tebing Pantai Jumiang Pademawu, dan sentra TPS3R.
4. **Kabupaten Sumenep**: Wilayah kepulauan terluas, Dermaga Penyeberangan Kalianget, wisata Pantai Lombang (Cemara Udang Batang-Batang), Pantai Pasir Putih Slopeng, dan sentra niaga Pasar Anom Baru.

---

## 4. Tech Stack & Arsitektur

- **Framework**: Next.js 16 (App Router, Server & Client Components, TypeScript strict mode)
- **Styling & UI**: Tailwind CSS (Gov-Tech Design System, Palet Emerald `#15370D` & `#266210`, No Emojis, Lucide Icons)
- **AI Engine**: Google Gemini API (`gemini-3.5-flash` untuk multimodal vision & smart recommendation)
- **Peta Geospasial**: Leaflet.js + OpenStreetMap (geocoding & boundary box khusus Pulau Madura: `[[-7.40, 112.50], [-6.75, 114.35]]`)
- **Database & ORM**: PostgreSQL dengan Drizzle ORM (dilengkapi offline fallback dataset yang tangguh)
- **Autentikasi**: NextAuth.js (Session JWT, RBAC Citizen & Officer/Juri)
- **Storage**: Cloudinary API (dengan fallback penyimpanan base64/lokal)

---

## 5. Pengungkapan Sumber Daya Pihak Ketiga (Disclosure)

Sesuai aturan transparansi kompetisi:
1. **Google Gemini API**: Model `gemini-3.5-flash` untuk pemrosesan visi komputer dan inferensi teks rekomendasi.
2. **Leaflet.js & OpenStreetMap / Nominatim API**: Peta interaktif bebas lisensi dan reverse-geocoding koordinat alamat.
3. **Lucide React**: Ikon grafis vektor open-source pengganti emoji untuk menjaga standar profesionalitas antarmuka.
4. **Unsplash Public CDN**: Aset gambar ilustrasi kondisi sampah dan foto satelit lingkungan.
5. **AOS (Animate On Scroll)**: Transisi halus antarmuka pengguna berbasis scroll.

---

## 6. Petunjuk Instalasi & Menjalankan Lokal

### Prasyarat
- Node.js versi 18.x atau yang lebih baru
- npm / yarn / pnpm

### Langkah Setup

1. **Clone repositori:**
   ```bash
   git clone https://github.com/muhammadbusiri-021/BALIWASTE.git
   cd BALIWASTE
   ```

2. **Instal dependencies:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Isi `GEMINI_API_KEY` Anda:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXTAUTH_SECRET=your_random_secret_key_here
   NEXTAUTH_URL=http://localhost:3000
   ```
   *(Catatan: Jika database PostgreSQL lokal belum aktif, sistem secara otomatis beralih ke dataset fallback Madura yang realistis dan komprehensif tanpa crash).*

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

5. **Uji Build Produksi:**
   ```bash
   npm run build
   ```

---

## 7. Rute Navigasi Aplikasi

- `/` : Halaman Beranda (Hero interaktif, 4 fitur inti, alur kerja)
- `/lapor` : Pelaporan Sampah Interaktif (Ambil/Unggah Foto, AI Vision, Pinpoint Peta Madura)
- `/hotspot` : Peta Sebaran Hotspot Madura (Filter 4 Kabupaten, Kecamatan, Desa, Mode Heatmap & Cluster)
- `/rekomendasi` : Simulator Rekomendasi Cerdas AI & Matriks Disposisi Tugas Lapangan
- `/dashboard` : Environmental Impact Dashboard (KPI, Komposisi, Sebaran Wilayah, Dampak Ekologis)
- `/login` : Portal Akses Petugas & Penilai Sistem

---

## 8. Hak Cipta & Tim Pengembang

Dikembangkan dengan dedikasi untuk mendukung kelestarian lingkungan dan transformasi digital persampahan di Pulau Madura.  
© 2026 Tim MADURAWASTE. Seluruh hak cipta dilindungi.
