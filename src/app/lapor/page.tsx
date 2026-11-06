// src/app/lapor/page.tsx
"use client";

import { useState } from "react";
import { Camera, Sparkles, Upload, AlertCircle, CheckCircle2, MapPin, Loader2, ArrowRight } from "lucide-react";
import { WasteClassificationResult, WasteHandlingRecommendationResult } from "@/types";
import { BALI_REGIONS } from "@/constants";

export default function LaporPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<WasteClassificationResult | null>(null);
  const [recommendation, setRecommendation] = useState<WasteHandlingRecommendationResult | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState<(typeof BALI_REGIONS)[number]>(BALI_REGIONS[0]);
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setImageBase64(base64String);
      setAiResult(null);
      setRecommendation(null);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeWithAI = async () => {
    if (!imageBase64) {
      setErrorMessage("Silakan pilih atau ambil foto sampah terlebih dahulu.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      // 1. Panggil endpoint klasifikasi citra AI
      const res = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mimeType: "image/jpeg",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal menganalisis gambar.");
      }

      const classification: WasteClassificationResult = json.data;
      setAiResult(classification);

      // Otomatis sarankan judul jika belum diisi
      if (!title) {
        setTitle(`Timbulan ${classification.categoryLabel} di ${region}`);
      }

      // 2. Buat rekomendasi penanganan otomatis dari AI
      const recRes = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasteType: classification.category,
          severity: classification.severity,
          address: `${region}, Bali`,
          locationDescription: classification.notes,
        }),
      });

      const recJson = await recRes.json();
      if (recRes.ok && recJson.success) {
        setRecommendation(recJson.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses AI.";
      setErrorMessage(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imagePreview) {
      setErrorMessage("Judul laporan dan foto wajib disertakan.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Default koordinat Denpasar jika tanpa GPS
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          latitude: -8.6705,
          longitude: 115.2126,
          address: `${address ? address + ", " : ""}${region}, Bali`,
          imageUrl: imagePreview,
          aiWasteType: aiResult?.category || "campuran_tidak_teridentifikasi",
          aiConfidence: aiResult?.confidence || 0.85,
          severity: aiResult?.severity || "low",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal menyimpan laporan.");
      }

      setSubmitSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirimkan laporan.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] pt-28 sm:pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf2e8] px-3.5 py-1 text-xs font-semibold text-[#15370d] border border-[#d6e4d2] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#266210]" />
            Fitur Inti 1: Computer Vision & Pelaporan
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15370d] tracking-tight">
            Lapor Timbulan Sampah
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#52604d]">
            Unggah foto sampah liar di wilayah Bali. Gemini Vision AI akan otomatis menganalisis
            kategori sampah, tingkat keparahan, dan merumuskan rekomendasi penanganan taktis.
          </p>
        </div>

        {submitSuccess ? (
          <div className="rounded-2xl border border-[#266210]/30 bg-white p-8 sm:p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf2e8] text-[#266210] mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-[#15370d]">Laporan Berhasil Disimpan</h2>
            <p className="mt-2 text-sm text-[#52604d] max-w-md mx-auto">
              Laporan sampah telah diverifikasi oleh AI dan otomatis dipetakan ke Waste Hotspot Mapping
              serta Environmental Impact Dashboard.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(false);
                  setImagePreview(null);
                  setImageBase64("");
                  setAiResult(null);
                  setRecommendation(null);
                  setTitle("");
                  setDescription("");
                }}
                className="w-full sm:w-auto rounded-xl bg-[#266210] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#15370d] transition-colors"
              >
                Buat Laporan Baru
              </button>
              <a
                href="/hotspot"
                className="w-full sm:w-auto rounded-xl border border-[#d6e4d2] bg-white px-5 py-2.5 text-sm font-semibold text-[#15370d] hover:bg-gray-50 transition-colors"
              >
                Lihat di Peta Hotspot
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Box 1: Unggah Foto & Analisis AI */}
            <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-[#15370d] mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5 text-[#266210]" />
                1. Foto Sampah & Analisis AI
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Upload Area */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#52604d] mb-2">
                    Pilih Foto dari Galeri / Kamera
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-[#d6e4d2] hover:border-[#266210] rounded-xl cursor-pointer bg-[#f5f7f4] hover:bg-[#eaf2e8]/40 transition-colors p-4 text-center">
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-[#266210] mb-2" />
                        <p className="text-sm font-medium text-[#15370d]">
                          Klik untuk mengambil foto sampah
                        </p>
                        <p className="text-xs text-[#52604d] mt-1">PNG, JPG, atau WEBP</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleAnalyzeWithAI}
                      disabled={isAnalyzing}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#266210] hover:bg-[#15370d] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Gemini AI Sedang Menganalisis...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-[#65da3c]" />
                          Jalankan Analisis AI Vision
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* AI Result Card */}
                <div className="rounded-xl border border-[#e2e7df] bg-[#f5f7f4] p-5 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#266210]">
                        Hasil Analisis AI
                      </span>
                      {aiResult && (
                        <span className="rounded bg-[#eaf2e8] px-2 py-0.5 text-xs font-semibold text-[#15370d] border border-[#d6e4d2]">
                          Confidence: {(aiResult.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>

                    {isAnalyzing ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#266210] mb-3" />
                        <p className="text-sm font-medium text-[#15370d]">
                          Menganalisis jenis sampah dan volume...
                        </p>
                        <p className="text-xs text-[#52604d] mt-1">
                          Model Computer Vision Gemini Flash sedang bekerja
                        </p>
                      </div>
                    ) : aiResult ? (
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-xs text-[#52604d]">Kategori Terdeteksi:</span>
                          <p className="font-bold text-[#15370d] text-base">
                            {aiResult.categoryLabel}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white p-2.5 rounded-lg border border-[#e2e7df]">
                            <span className="text-[#52604d]">Keparahan:</span>
                            <p className="font-bold text-[#15370d] uppercase">
                              {aiResult.severity}
                            </p>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-[#e2e7df]">
                            <span className="text-[#52604d]">Estimasi Volume:</span>
                            <p className="font-bold text-[#15370d]">
                              {aiResult.estimatedVolume || "1-2 kantong"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-[#52604d]">Benda Terdeteksi:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {aiResult.detectedItems.map((item, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-[#15370d] border border-[#e2e7df]"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        {aiResult.notes && (
                          <div className="pt-2 border-t border-[#e2e7df] text-xs text-[#52604d]">
                            <span className="font-semibold text-[#15370d]">Catatan AI:</span>{" "}
                            {aiResult.notes}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-xs text-[#52604d]">
                        Unggah foto sampah dan klik tombol &quot;Jalankan Analisis AI Vision&quot;
                        untuk melihat identifikasi otomatis.
                      </div>
                    )}
                  </div>

                  {recommendation && (
                    <div className="mt-4 pt-3 border-t border-[#d6e4d2] bg-[#eaf2e8]/70 p-3 rounded-lg text-xs">
                      <div className="font-bold text-[#15370d] flex items-center gap-1.5 mb-1">
                        <Sparkles className="h-3.5 w-3.5 text-[#266210]" />
                        Rekomendasi Penanganan AI:
                      </div>
                      <p className="text-[#52604d] leading-relaxed">
                        {recommendation.handlingMethod}
                      </p>
                      <div className="mt-1.5 text-[11px] text-[#15370d] font-semibold">
                        Instansi Penanggung Jawab: {recommendation.assignedAgency}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Box 2: Detail Informasi & Lokasi */}
            <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-[#15370d] mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#266210]" />
                2. Detail Informasi & Lokasi Laporan
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#15370d] mb-1">
                  Judul Laporan *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Timbulan Sampah Plastik di Pantai Sanur"
                  className="w-full rounded-xl border border-[#e2e7df] px-4 py-2.5 text-sm text-[#141b12] focus:border-[#266210] focus:outline-none focus:ring-1 focus:ring-[#266210]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#15370d] mb-1">
                    Kabupaten / Kota di Bali *
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as (typeof BALI_REGIONS)[number])}
                    className="w-full rounded-xl border border-[#e2e7df] px-4 py-2.5 text-sm text-[#141b12] focus:border-[#266210] focus:outline-none focus:ring-1 focus:ring-[#266210]"
                  >
                    {BALI_REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#15370d] mb-1">
                    Alamat / Titik Spesifik
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama jalan, patokan pura, banjar, atau pantai"
                    className="w-full rounded-xl border border-[#e2e7df] px-4 py-2.5 text-sm text-[#141b12] focus:border-[#266210] focus:outline-none focus:ring-1 focus:ring-[#266210]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#15370d] mb-1">
                  Keterangan Tambahan
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsikan kondisi lingkungan, apakah menyumbat saluran air, bau menyengat, dsb."
                  className="w-full rounded-xl border border-[#e2e7df] px-4 py-2.5 text-sm text-[#141b12] focus:border-[#266210] focus:outline-none focus:ring-1 focus:ring-[#266210]"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#266210] hover:bg-[#15370d] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan Laporan...
                  </>
                ) : (
                  <>
                    Kirim Laporan Sampah
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
