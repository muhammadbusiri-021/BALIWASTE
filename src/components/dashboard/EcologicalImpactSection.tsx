// src/components/dashboard/EcologicalImpactSection.tsx
"use client";

import { useState } from "react";
import {
  Leaf,
  Waves,
  Sparkles,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  TreePine,
  Fish,
} from "lucide-react";
import { EcologicalImpactMetrics } from "@/types";

interface EcologicalImpactSectionProps {
  metrics: EcologicalImpactMetrics;
}

export default function EcologicalImpactSection({
  metrics,
}: EcologicalImpactSectionProps) {
  // Interactive Calculator State (dalam Kilogram sampah terkelola)
  const [calcVolumeKg, setCalcVolumeKg] = useState<number>(1000);

  // Perhitungan ilmiah estimasi ekologis:
  // - 1 kg sampah plastik ≈ 40 botol plastik kemasan 500ml
  // - 1 kg sampah organik dikomposkan ≈ 0.45 kg pupuk kompos Subak
  // - 1 kg sampah tidak dibakar terbuka/open dumping ≈ 1.25 kg reduksi CO₂eq
  const bottlesSaved = Math.round(calcVolumeKg * 0.38 * 40); // 38% adalah porsi plastik
  const compostProduced = Math.round(calcVolumeKg * 0.32 * 0.45); // 32% adalah porsi organik
  const co2MitigatedKg = Math.round(calcVolumeKg * 1.25);

  return (
    <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 sm:p-8 shadow-sm space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#edf1eb]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf2e8] text-[#15370d] text-xs font-bold mb-2">
            <Leaf className="h-3.5 w-3.5 text-[#266210]" />
            <span>Ecological &amp; Carbon Accounting</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#15370d] tracking-tight">
            Dampak Pemulihan Ekosistem &amp; Lingkungan Madura
          </h3>
          <p className="text-xs sm:text-sm text-[#52604d] mt-1">
            Kuantifikasi kontribusi intervensi sistem cerdas terhadap kebersihan pesisir, perairan, dan reduksi emisi
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ocean Plastic Prevented */}
        <div className="p-4 rounded-xl bg-[#f0f9ff] border border-[#bae6fd] space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#0369a1]">
            <span>Cegah Plastik Masuk Laut</span>
            <Waves className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-[#0369a1]">
            {metrics.oceanPlasticPreventedKg.toLocaleString("id-ID")}{" "}
            <span className="text-sm font-bold">Kg</span>
          </p>
          <p className="text-[11px] text-[#52604d] mt-1">
            Terjaring di sekat sungai &amp; pesisir pantai
          </p>
        </div>

        {/* Compost Produced */}
        <div className="p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#15803d]">
            <span>Kompos Organik Subak</span>
            <Leaf className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-[#15803d]">
            {metrics.compostProducedKg.toLocaleString("id-ID")}{" "}
            <span className="text-sm font-bold">Kg</span>
          </p>
          <p className="text-[11px] text-[#52604d] mt-1">
            Diolah TPS3R dari canang &amp; sisa pasar
          </p>
        </div>

        {/* Carbon Offset */}
        <div className="p-4 rounded-xl bg-[#fefce8] border border-[#fef08a] space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#a16207]">
            <span>Reduksi Emisi Gas Rumah Kaca</span>
            <TreePine className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-[#a16207]">
            {metrics.co2ReducedTon.toLocaleString("id-ID")}{" "}
            <span className="text-sm font-bold">Ton CO₂eq</span>
          </p>
          <p className="text-[11px] text-[#52604d] mt-1">
            Menghindari pembakaran liar terbuka
          </p>
        </div>

        {/* Marine Habitat Protection */}
        <div className="p-4 rounded-xl bg-[#fdf4ff] border border-[#f5d0fe] space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#a21caf]">
            <span>Proteksi Habitat Terumbu Karang</span>
            <Fish className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-[#a21caf]">
            14 Kawasan
          </p>
          <p className="text-[11px] text-[#52604d] mt-1">
            Lovina, Amed, Menjangan, Nusa Penida
          </p>
        </div>
      </div>

      {/* Interactive Ecological Impact Calculator */}
      <div className="rounded-2xl border border-[#d1d8cd] bg-[#f5f7f4] p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#266210] text-white">
              <Sliders className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-base font-bold text-[#15370d]">
                Kalkulator Simulasi Dampak Ekologis Cepat
              </h4>
              <p className="text-xs text-[#52604d]">
                Geser nilai volume sampah yang berhasil ditangani untuk melihat proyeksi dampak lingkungan
              </p>
            </div>
          </div>
          <span className="text-sm font-black text-[#15370d] bg-white px-3 py-1 rounded-xl border border-[#e2e7df]">
            {calcVolumeKg.toLocaleString("id-ID")} Kg Sampah
          </span>
        </div>

        {/* Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={calcVolumeKg}
            onChange={(e) => setCalcVolumeKg(Number(e.target.value))}
            className="w-full accent-[#266210] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#52604d]">
            <span>100 Kg</span>
            <span>5.000 Kg</span>
            <span>10.000 Kg</span>
          </div>
        </div>

        {/* Calculation Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          <div className="p-3.5 rounded-xl bg-white border border-[#e2e7df] shadow-sm text-center">
            <p className="text-xs text-[#52604d] font-medium">
              Botol Plastik Dicegah Masuk Laut
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#0369a1] mt-1">
              ~{bottlesSaved.toLocaleString("id-ID")}
            </p>
            <p className="text-[10px] text-[#52604d] mt-0.5">
              Setara kemasan plastik 500ml
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#e2e7df] shadow-sm text-center">
            <p className="text-xs text-[#52604d] font-medium">
              Kompos Organik untuk Subak
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#15803d] mt-1">
              ~{compostProduced.toLocaleString("id-ID")} Kg
            </p>
            <p className="text-[10px] text-[#52604d] mt-0.5">
              Pupuk alami pertanian ramah lingkungan
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#e2e7df] shadow-sm text-center">
            <p className="text-xs text-[#52604d] font-medium">
              Reduksi Jejak Emisi Karbon
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#15370d] mt-1">
              ~{co2MitigatedKg.toLocaleString("id-ID")} Kg CO₂
            </p>
            <p className="text-[10px] text-[#52604d] mt-0.5">
              Mencegah pembakaran gas beracun
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
