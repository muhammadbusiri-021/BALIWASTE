// src/components/recommendation/AiRecommendationSimulator.tsx
"use client";

import { useState } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Building2,
  Truck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Check,
  MapPin,
  Layers,
  FileCheck2,
  HelpCircle,
} from "lucide-react";
import { WASTE_CATEGORIES } from "@/constants";
import { WasteHandlingRecommendationResult } from "@/types";
import { cn } from "@/lib/utils";

interface PresetScenario {
  id: string;
  name: string;
  location: string;
  wasteType: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "suramadu-pesisir",
    name: "Akumulasi Plastik Pesisir Jembatan Suramadu",
    location: "Pesisir Selat Madura, Desa Sukolilo Barat, Kec. Labang, Kab. Bangkalan",
    wasteType: "anorganik_plastik",
    severity: "critical",
    description: "Timbulan botol PET dan kresek plastik kiriman arus laut menumpuk sepanjang 1 km bibir pantai kaki Suramadu.",
  },
  {
    id: "kali-kemuning",
    name: "Penyumbatan Trash Barrier Sungai Kali Kemuning",
    location: "Sekat Apung Kali Kemuning, Kec. Sampang Kota, Kab. Sampang",
    wasteType: "anorganik_plastik",
    severity: "critical",
    description: "Batang kayu, styrofoam, dan kantong kresek menyumbat sekat jaring sungai rawan luapan banjir perkotaan Sampang.",
  },
  {
    id: "pasar-kolpajung",
    name: "Limbah Organik Sayur & Karton Pasar Kolpajung",
    location: "Sentra Pasar Kolpajung, Kec. Pamekasan, Kab. Pamekasan",
    wasteType: "organik",
    severity: "high",
    description: "Sisa sayuran lapak basah dan dedaunan menumpuk pasca jam grosir, membutuhkan pencacahan dan komposting TPS3R.",
  },
  {
    id: "pelabuhan-branta",
    name: "Ceceran Jeriken Oli Pelumas di Dermaga PPI Branta",
    location: "Pelabuhan Pendaratan Ikan Branta Pesisir, Kec. Tlanakan, Kab. Pamekasan",
    wasteType: "b3_berbahaya",
    severity: "critical",
    description: "Limbah B3 jeriken oli mesin perahu dan sisa cat tergeletak di dermaga, berisiko mencemari ekosistem laut perikanan.",
  },
  {
    id: "pelabuhan-kalianget",
    name: "Timbulan Plastik & Logistik di Pelabuhan Kalianget",
    location: "Dermaga Penyeberangan Kalianget, Kec. Kalianget, Kab. Sumenep",
    wasteType: "anorganik_plastik",
    severity: "high",
    description: "Botol air kemasan dan kardus kargo kiriman antarpulau menumpuk di area tunggu terminal penyeberangan kepulauan.",
  },
];

export default function AiRecommendationSimulator() {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [wasteType, setWasteType] = useState<string>("anorganik_plastik");
  const [severity, setSeverity] = useState<"critical" | "high" | "medium" | "low">("high");
  const [address, setAddress] = useState<string>("Pesisir Labang, Kabupaten Bangkalan, Madura");
  const [notes, setNotes] = useState<string>(
    "Akumulasi sampah botol plastik dan kresek di pesisir bawah Jembatan Suramadu."
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WasteHandlingRecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyPreset = (presetId: string) => {
    const p = PRESET_SCENARIOS.find((item) => item.id === presetId);
    if (!p) return;
    setSelectedPreset(presetId);
    setWasteType(p.wasteType);
    setSeverity(p.severity);
    setAddress(p.location);
    setNotes(p.description);
    setResult(null);
    setError(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wasteType,
          severity,
          address,
          locationDescription: notes,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      } else {
        throw new Error(json.error?.details || json.message || "Gagal memproses rekomendasi AI");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memanggil AI";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edf1eb]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf2e8] text-[#15370d] text-xs font-bold mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#266210]" />
            <span>Interactive AI Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#15370d] tracking-tight">
            Simulator Rekomendasi Penanganan Cerdas AI
          </h2>
          <p className="text-xs sm:text-sm text-[#52604d] mt-1">
            Uji kapabilitas Gemini AI dalam menghasilkan instruksi penanganan taktis, alokasi armada,
            dan instansi penanggung jawab sesuai regulasi persampahan Bali.
          </p>
        </div>
      </div>

      {/* Preset Scenarios Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#15370d] uppercase tracking-wider block">
          Pilih Skenario Kasus Nyata di Bali (Preset Cepat):
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_SCENARIOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center gap-1.5",
                selectedPreset === preset.id
                  ? "bg-[#266210] text-white border-[#266210] shadow-sm"
                  : "bg-[#f5f7f4] text-[#141b12] border-[#d1d8cd] hover:border-[#266210] hover:bg-[#edf1eb]"
              )}
            >
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Jenis Sampah */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#141b12] flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#266210]" />
            <span>Kategori Sampah</span>
          </label>
          <select
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#141b12] focus:border-[#266210] outline-none"
          >
            {WASTE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tingkat Keparahan */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#141b12] flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />
            <span>Tingkat Keparahan / Urgensi</span>
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as any)}
            className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#141b12] focus:border-[#266210] outline-none"
          >
            <option value="critical">Kritis (Memicu banjir / B3 / wisata utama)</option>
            <option value="high">Tinggi (Tumpukan besar di ruang publik / jalan raya)</option>
            <option value="medium">Sedang (Tumpukan moderat TPS / pasar)</option>
            <option value="low">Rendah (Tumpukan kecil terlokalisir)</option>
          </select>
        </div>

        {/* Lokasi / Alamat */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#141b12] flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#266210]" />
            <span>Lokasi / Area Wilayah Bali</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Contoh: Pantai Kuta, Badung atau TPS3R Ubud, Gianyar"
            required
            className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-3.5 py-2.5 text-xs sm:text-sm text-[#141b12] focus:border-[#266210] outline-none"
          />
        </div>

        {/* Catatan Lingkungan */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#141b12] flex items-center gap-1.5">
            <FileCheck2 className="h-3.5 w-3.5 text-[#266210]" />
            <span>Catatan Kondisi Lapangan</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Deskripsi kondisi tumpukan sampah dan lingkungan..."
            className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-3.5 py-2.5 text-xs sm:text-sm text-[#141b12] focus:border-[#266210] outline-none"
          />
        </div>

        {/* Tombol Eksekusi AI */}
        <div className="md:col-span-2 pt-2 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#266210] hover:bg-[#15370d] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menganalisis Parameter dengan Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Hasilkan Rekomendasi Cerdas AI</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Gagal Membuat Rekomendasi</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* AI Output Card */}
      {result && (
        <div className="rounded-2xl border-2 border-[#266210]/30 bg-[#f5f7f4] p-5 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#d1d8cd]">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#266210] text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#15370d]">
                  Hasil Analisis &amp; Rekomendasi Tindakan AI
                </h3>
                <p className="text-[11px] text-[#52604d]">
                  Berdasarkan Pergub Bali No 97/2018 &amp; No 47/2019
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border",
                  result.priority === "Tinggi"
                    ? "bg-red-100 text-red-800 border-red-300"
                    : result.priority === "Sedang"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-emerald-100 text-emerald-800 border-emerald-300"
                )}
              >
                Prioritas Penanganan: {result.priority}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Metode Penanganan */}
            <div className="rounded-xl bg-white p-4 border border-[#e2e7df] shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#15370d] uppercase">
                <FileCheck2 className="h-4 w-4 text-[#266210]" />
                <span>Metode Penanganan Utama</span>
              </div>
              <p className="text-[#141b12] font-semibold leading-relaxed">
                {result.handlingMethod}
              </p>
            </div>

            {/* Instansi Penanggung Jawab */}
            <div className="rounded-xl bg-white p-4 border border-[#e2e7df] shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#15370d] uppercase">
                <Building2 className="h-4 w-4 text-[#266210]" />
                <span>Instansi / Pihak Berwenang</span>
              </div>
              <p className="text-[#141b12] font-semibold leading-relaxed">
                {result.assignedAgency}
              </p>
            </div>

            {/* Sumber Daya & Armada */}
            <div className="rounded-xl bg-white p-4 border border-[#e2e7df] shadow-sm space-y-1.5 md:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#15370d] uppercase">
                <Truck className="h-4 w-4 text-[#266210]" />
                <span>Estimasi Kebutuhan Armada &amp; Personel</span>
              </div>
              <p className="text-[#141b12] font-semibold leading-relaxed">
                {result.resourcesNeeded}
              </p>
            </div>
          </div>

          {/* Action Checklist */}
          {result.actionSteps && result.actionSteps.length > 0 && (
            <div className="rounded-xl bg-white p-4 border border-[#e2e7df] shadow-sm space-y-2.5">
              <p className="text-xs font-bold text-[#15370d] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#266210]" />
                <span>Checklist Langkah Tindakan Taktis di Lapangan:</span>
              </p>
              <div className="space-y-2">
                {result.actionSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#141b12]">
                    <span className="flex h-5 w-5 rounded-full bg-[#eaf2e8] text-[#15370d] font-bold text-[11px] items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Notes */}
          {result.safetyNotes && (
            <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Protokol Keselamatan Kerja (K3): </span>
                <span>{result.safetyNotes}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
