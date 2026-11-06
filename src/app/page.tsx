// src/app/page.tsx
import Link from "next/link";
import {
  Camera,
  MapPin,
  Sparkles,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Activity,
  FileText,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7f4]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eaf2e8]/60 via-[#f5f7f4] to-[#f5f7f4] py-16 sm:py-24 border-b border-[#e2e7df]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge - Gov-Tech Style, No Emojis */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf2e8] px-3.5 py-1.5 text-xs font-semibold text-[#15370d] border border-[#d6e4d2] shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#266210]" />
              Bali DigiFest 2026 — AI Web Innovation Challenge
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#15370d] sm:text-5xl lg:text-6xl">
              Pemantauan & Penanganan Sampah Bali Berbasis{" "}
              <span className="text-[#266210]">
                Artificial Intelligence
              </span>
            </h1>

            {/* Subtitle / Product Description */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#52604d]">
              <strong>BALIWASTE (Bali Waste Intelligence System)</strong> memadukan partisipasi
              masyarakat, computer vision AI untuk identifikasi sampah dari foto, pemetaan hotspot
              persebaran, dan rekomendasi penanganan otomatis demi mendukung terwujudnya{" "}
              <em>Bali Smart Society</em> yang bersih dan lestari.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/lapor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#266210] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#15370d] transition-all"
              >
                <Camera className="h-4 w-4" />
                Lapor Sampah Sekarang
              </Link>
              <Link
                href="/hotspot"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#d6e4d2] bg-white px-6 py-3.5 text-sm font-semibold text-[#15370d] hover:bg-[#edf1eb] transition-all"
              >
                <MapPin className="h-4 w-4 text-[#266210]" />
                Peta Hotspot Sebaran
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#d6e4d2] bg-white px-6 py-3.5 text-sm font-semibold text-[#15370d] hover:bg-[#edf1eb] transition-all"
              >
                <BarChart3 className="h-4 w-4 text-[#266210]" />
                Dashboard Lingkungan
              </Link>
            </div>

            {/* Demo credential note */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#edf1eb] px-3.5 py-1.5 text-xs text-[#52604d] border border-[#d6e4d2]">
              <ShieldCheck className="h-4 w-4 text-[#266210]" />
              <span>
                Akun Demo Juri: <strong className="text-[#15370d]">juri@baliwaste.id</strong> / Sandi: <strong className="text-[#15370d]">juriBali2026!</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Features Section */}
      <section className="py-16 sm:py-20 bg-[#f5f7f4] border-b border-[#e2e7df]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#266210]">
              Empat Fitur Inti Berbasis AI
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#15370d] sm:text-4xl">
              Solusi Cerdas Menjawab Tantangan Sampah di Bali
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="relative rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm hover:border-[#266210] transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2e8] text-[#15370d]">
                <Camera className="h-6 w-6 text-[#266210]" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#15370d]">
                Pelaporan & AI Vision
              </h3>
              <p className="mt-2 text-sm text-[#52604d] leading-relaxed">
                Masyarakat mengunggah foto sampah. Gemini Vision AI otomatis mendeteksi kategori (organik,
                plastik, B3, dsb), tingkat keparahan, dan estimasi volume.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-[#266210]">
                AI Image Classification →
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm hover:border-[#266210] transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2e8] text-[#15370d]">
                <MapPin className="h-6 w-6 text-[#266210]" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#15370d]">
                Waste Hotspot Mapping
              </h3>
              <p className="mt-2 text-sm text-[#52604d] leading-relaxed">
                Visualisasi titik persebaran timbulan sampah di seluruh 9 kabupaten/kota se-Bali secara
                geospasial dengan indikator warna tingkat urgensi.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-[#266210]">
                Geo-clustering & Spatial Map →
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm hover:border-[#266210] transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2e8] text-[#15370d]">
                <Sparkles className="h-6 w-6 text-[#266210]" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#15370d]">
                Smart Handling AI
              </h3>
              <p className="mt-2 text-sm text-[#52604d] leading-relaxed">
                Rekomendasi metode penanganan sampah yang disesuaikan dengan jenis limbah, estimasi
                kebutuhan armada, serta instansi/satgas yang berwenang menindaklanjuti.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-[#266210]">
                LLM Decision Support →
              </div>
            </div>

            {/* Feature 4 */}
            <div className="relative rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm hover:border-[#266210] transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2e8] text-[#15370d]">
                <BarChart3 className="h-6 w-6 text-[#266210]" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#15370d]">
                Impact Dashboard
              </h3>
              <p className="mt-2 text-sm text-[#52604d] leading-relaxed">
                Statistik analitik kondisi persampahan, persentase penyelesaian, tren komposisi sampah,
                dan metrik dampak lingkungan bagi para pembuat kebijakan.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-[#266210]">
                Predictive Analytics →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (Alur Kerja Terintegrasi) */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#e2e7df]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#266210]">
              Alur Kerja Terintegrasi
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-[#15370d] sm:text-4xl">
              Dari Laporan Warga Hingga Penanganan Nyata di Lapangan
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15370d] text-white font-bold text-lg shadow-sm">
                1
              </div>
              <h4 className="mt-4 font-bold text-[#15370d]">Warga Mengambil Foto</h4>
              <p className="mt-2 text-sm text-[#52604d]">
                Warga memotret timbulan sampah liar dan menetapkan titik koordinat lokasi di peta.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15370d] text-white font-bold text-lg shadow-sm">
                2
              </div>
              <h4 className="mt-4 font-bold text-[#15370d]">AI Menganalisis Citra</h4>
              <p className="mt-2 text-sm text-[#52604d]">
                Gemini Vision mengklasifikasi kategori sampah, confidence score, dan tingkat keparahan.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15370d] text-white font-bold text-lg shadow-sm">
                3
              </div>
              <h4 className="mt-4 font-bold text-[#15370d]">Rekomendasi Cerdas</h4>
              <p className="mt-2 text-sm text-[#52604d]">
                AI merumuskan instruksi penanganan taktis, kebutuhan armada, dan instansi pelaksana.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15370d] text-white font-bold text-lg shadow-sm">
                4
              </div>
              <h4 className="mt-4 font-bold text-[#15370d]">Tindakan Cepat Berbasis Data</h4>
              <p className="mt-2 text-sm text-[#52604d]">
                Petugas kebersihan membersihkan lokasi dan memverifikasi status laporan hingga tuntas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact CTA Banner */}
      <section className="bg-[#15370d] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Wujudkan Bali Bersih dari Sampah</h3>
            <p className="mt-1.5 text-sm text-[#d6e4d2] max-w-xl">
              Bersama wujudkan implementasi Pergub Bali No. 97/2018 dan 47/2019 melalui inovasi teknologi kecerdasan buatan.
            </p>
          </div>
          <Link
            href="/lapor"
            className="inline-flex items-center gap-2 rounded-xl bg-[#266210] border border-[#3b851b] px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#347f18] transition-all shrink-0"
          >
            Mulai Buat Laporan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
