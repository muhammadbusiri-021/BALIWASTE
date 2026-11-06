// src/app/page.tsx
import Link from "next/link";
import {
  Camera,
  MapPin,
  Sparkles,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7f4] overflow-x-hidden">
      {/* Hero Section with Full-Width Video Background */}
      <section className="relative w-full min-h-[92vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Ambient Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src="/videos/bali-hero.mp4" type="video/mp4" />
        </video>

        {/* Sophisticated Dark Emerald Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#15370d]/80 via-[#15370d]/80 to-[#15370d]/95 backdrop-blur-[1px]" />

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 sm:px-8 lg:px-12 w-full">
          <div className="text-left sm:text-center max-w-3xl sm:mx-auto">
            {/* Tagline Badge */}
            <div
              data-aos="fade-down"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-white/90 border border-white/15 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#48bb22] animate-pulse" />
              Bali Waste Intelligence System
            </div>

            {/* Main Headline - Left on mobile, center on desktop */}
            <h1
              data-aos="fade-up"
              data-aos-delay="100"
              className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.18]"
            >
              Pemantauan & Penanganan Sampah Bali Berbasis{" "}
              <span className="text-[#65da3c]">
                Artificial Intelligence
              </span>
            </h1>

            {/* Refined, Clean Description */}
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="mt-5 text-sm sm:text-base md:text-lg leading-relaxed text-gray-200/90 font-normal"
            >
              Sistem kecerdasan buatan terpadu untuk mengidentifikasi jenis sampah dari foto,
              memetakan sebaran titik hotspot secara geospasial, dan mengotomasi rekomendasi
              penanganan taktis demi menjaga kelestarian alam Pulau Dewata.
            </p>

            {/* CTA Buttons */}
            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-start sm:justify-center gap-3.5"
            >
              <Link
                href="/lapor"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#266210] hover:bg-[#347f18] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all border border-[#48bb22]/30"
              >
                <Camera className="h-4 w-4" />
                Lapor Sampah Sekarang
              </Link>
              <Link
                href="/hotspot"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white transition-all border border-white/20"
              >
                <MapPin className="h-4 w-4 text-[#65da3c]" />
                Peta Hotspot Sebaran
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white transition-all border border-white/20"
              >
                <BarChart3 className="h-4 w-4 text-[#65da3c]" />
                Dashboard Lingkungan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Features Section - Normal Background */}
      <section className="py-16 sm:py-24 bg-[#f5f7f4] border-b border-[#e2e7df]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div data-aos="fade-up" className="text-left sm:text-center max-w-2xl sm:mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#266210]">
              Empat Fitur Inti Berbasis AI
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#15370d]">
              Solusi Cerdas Menjawab Tantangan Sampah di Bali
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="relative rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm hover:border-[#266210] transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2e8] text-[#15370d]">
                <Camera className="h-6 w-6 text-[#266210]" />
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-[#15370d]">
                Pelaporan & AI Vision
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#52604d] leading-relaxed">
                Masyarakat mengunggah foto sampah. Gemini Vision AI otomatis mendeteksi kategori (organik,
                plastik, B3, dsb), tingkat keparahan, dan estimasi volume secara real-time.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-[#266210]">
                AI Image Classification →
              </div>
            </div>

            {/* Feature 2 */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="relative rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm hover:border-[#266210] transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2e8] text-[#15370d]">
                <MapPin className="h-6 w-6 text-[#266210]" />
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-[#15370d]">
                Waste Hotspot Mapping
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#52604d] leading-relaxed">
                Visualisasi titik persebaran timbulan sampah di seluruh 9 kabupaten/kota se-Bali secara
                geospasial dengan indikator warna tingkat urgensi.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-[#266210]">
                Geo-clustering & Spatial Map →
              </div>
            </div>

            {/* Feature 3 */}
            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="relative rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm hover:border-[#266210] transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2e8] text-[#15370d]">
                <Sparkles className="h-6 w-6 text-[#266210]" />
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-[#15370d]">
                Smart Handling AI
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#52604d] leading-relaxed">
                Rekomendasi metode penanganan sampah yang disesuaikan dengan jenis limbah, estimasi
                kebutuhan armada, serta instansi/satgas yang berwenang menindaklanjuti.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-[#266210]">
                LLM Decision Support →
              </div>
            </div>

            {/* Feature 4 */}
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="relative rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm hover:border-[#266210] transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2e8] text-[#15370d]">
                <BarChart3 className="h-6 w-6 text-[#266210]" />
              </div>
              <h3 className="mt-4 text-base sm:text-lg font-bold text-[#15370d]">
                Impact Dashboard
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#52604d] leading-relaxed">
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

      {/* How it works Section - Centered numbers on Mobile & Desktop */}
      <section className="py-16 sm:py-24 bg-white border-b border-[#e2e7df]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div data-aos="fade-up" className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#266210]">
              Alur Kerja Terintegrasi
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#15370d]">
              Dari Laporan Warga Hingga Penanganan Nyata di Lapangan
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Step 1 - Strictly Centered on mobile & desktop */}
            <div
              data-aos="zoom-in"
              data-aos-delay="100"
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15370d] text-white font-bold text-base shadow-sm ring-4 ring-[#eaf2e8]">
                1
              </div>
              <h4 className="mt-5 font-bold text-[#15370d] text-base">Warga Mengambil Foto</h4>
              <p className="mt-2 text-xs sm:text-sm text-[#52604d] max-w-xs">
                Warga memotret timbulan sampah liar dan menetapkan titik koordinat lokasi di peta.
              </p>
            </div>

            {/* Step 2 - Strictly Centered on mobile & desktop */}
            <div
              data-aos="zoom-in"
              data-aos-delay="200"
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15370d] text-white font-bold text-base shadow-sm ring-4 ring-[#eaf2e8]">
                2
              </div>
              <h4 className="mt-5 font-bold text-[#15370d] text-base">AI Menganalisis Citra</h4>
              <p className="mt-2 text-xs sm:text-sm text-[#52604d] max-w-xs">
                Gemini Vision mengklasifikasi kategori sampah, confidence score, dan tingkat keparahan.
              </p>
            </div>

            {/* Step 3 - Strictly Centered on mobile & desktop */}
            <div
              data-aos="zoom-in"
              data-aos-delay="300"
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15370d] text-white font-bold text-base shadow-sm ring-4 ring-[#eaf2e8]">
                3
              </div>
              <h4 className="mt-5 font-bold text-[#15370d] text-base">Rekomendasi Cerdas</h4>
              <p className="mt-2 text-xs sm:text-sm text-[#52604d] max-w-xs">
                AI merumuskan instruksi penanganan taktis, kebutuhan armada, dan instansi pelaksana.
              </p>
            </div>

            {/* Step 4 - Strictly Centered on mobile & desktop */}
            <div
              data-aos="zoom-in"
              data-aos-delay="400"
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15370d] text-white font-bold text-base shadow-sm ring-4 ring-[#eaf2e8]">
                4
              </div>
              <h4 className="mt-5 font-bold text-[#15370d] text-base">Tindakan Cepat Berbasis Data</h4>
              <p className="mt-2 text-xs sm:text-sm text-[#52604d] max-w-xs">
                Petugas kebersihan membersihkan lokasi dan memverifikasi status laporan hingga tuntas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Balanced CTA Banner */}
      <section data-aos="fade-up" className="bg-[#15370d] py-12 sm:py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl text-left">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Wujudkan Bali Bersih dari Sampah
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#d6e4d2] leading-relaxed">
                Implementasi terpadu Pergub Bali No. 97/2018 dan 47/2019 melalui inovasi teknologi kecerdasan buatan.
              </p>
            </div>
            <div className="pt-2 md:pt-0 shrink-0">
              <Link
                href="/lapor"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#266210] hover:bg-[#347f18] px-5 py-2.5 text-sm font-semibold text-white shadow-sm border border-[#48bb22]/30 transition-all"
              >
                Mulai Buat Laporan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
