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
  AlertTriangle,
  Leaf,
  Layers,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200/60 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Bali DigiFest 2026 — AI Web Innovation Challenge
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Pantau & Kelola Sampah Bali dengan Kekuatan{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h1>

            {/* Subtitle / Product Description */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-gray-600">
              <strong>BALIWASTE (Bali Waste Intelligence System)</strong> memadukan partisipasi
              masyarakat, computer vision AI untuk identifikasi sampah dari foto, pemetaan hotspot
              persebaran, dan rekomendasi penanganan otomatis demi mendukung terwujudnya{" "}
              <em>Bali Smart Society</em> yang bersih dan lestari.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/lapor"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 transition-all"
              >
                <Camera className="h-4 w-4" />
                Lapor Sampah Sekarang
              </Link>
              <Link
                href="/hotspot"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
              >
                <MapPin className="h-4 w-4 text-emerald-600" />
                Peta Hotspot Sebaran
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
              >
                <BarChart3 className="h-4 w-4 text-emerald-600" />
                Dashboard Lingkungan
              </Link>
            </div>

            {/* Demo credential note */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-100/90 px-3.5 py-1.5 text-xs text-gray-600 border border-gray-200">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>
                Akun Demo Juri: <strong>juri@baliwaste.id</strong> / Sandi: <strong>juriBali2026!</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Features Section */}
      <section className="py-16 sm:py-20 bg-gray-50/50 border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Fitur Inti Berbasis AI
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Solusi Cerdas Menjawab Tantangan Sampah di Bali
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Pelaporan & AI Vision
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Masyarakat mengunggah foto sampah. Gemini Vision AI otomatis mendeteksi kategori (organik,
                plastik, B3, dsb), tingkat keparahan, dan estimasi volume.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-emerald-600">
                AI Image Classification →
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Waste Hotspot Mapping
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Visualisasi titik persebaran timbulan sampah di seluruh kabupaten/kota se-Bali secara
                geospasial dengan indikator warna tingkat urgensi.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-teal-600">
                Geo-clustering & Spatial Map →
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Smart Handling AI
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Rekomendasi metode penanganan sampah yang disesuaikan dengan jenis limbah, estimasi
                kebutuhan armada, serta instansi/satgas yang berwenang menindaklanjuti.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-amber-700">
                LLM Decision Support →
              </div>
            </div>

            {/* Feature 4 */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Impact Dashboard
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Statistik analitik kondisi persampahan, persentase penyelesaian, tren komposisi sampah,
                dan metrik dampak lingkungan bagi para pembuat kebijakan.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-blue-700">
                Predictive Analytics →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (Alur Kerja) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Alur Kerja Terintegrasi
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Dari Laporan Warga Hingga Penanganan Nyata di Lapangan
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg shadow-md shadow-emerald-500/20">
                1
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">Warga Mengambil Foto</h4>
              <p className="mt-2 text-sm text-gray-600">
                Warga memotret timbulan sampah liar dan menetapkan titik koordinat lokasi di peta.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg shadow-md shadow-emerald-500/20">
                2
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">AI Menganalisis Citra</h4>
              <p className="mt-2 text-sm text-gray-600">
                Gemini Vision mengklasifikasi kategori sampah, confidence score, dan tingkat keparahan.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg shadow-md shadow-emerald-500/20">
                3
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">Rekomendasi Cerdas</h4>
              <p className="mt-2 text-sm text-gray-600">
                AI merumuskan instruksi penanganan taktis, kebutuhan alat, dan instansi pelaksana.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg shadow-md shadow-emerald-500/20">
                4
              </div>
              <h4 className="mt-4 font-semibold text-gray-900">Tindakan Cepat Berbasis Data</h4>
              <p className="mt-2 text-sm text-gray-600">
                Petugas kebersihan membersihkan lokasi dan memverifikasi status laporan hingga tuntas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact CTA Banner */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Wujudkan Bali Bersih dari Sampah</h3>
            <p className="mt-1 text-sm text-emerald-100 max-w-xl">
              Bersama wujudkan implementasi Pergub Bali No 97/2018 dan 47/2019 melalui inovasi teknologi kecerdasan buatan.
            </p>
          </div>
          <Link
            href="/lapor"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-800 shadow-md hover:bg-emerald-50 transition-all shrink-0"
          >
            Mulai Buat Laporan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
