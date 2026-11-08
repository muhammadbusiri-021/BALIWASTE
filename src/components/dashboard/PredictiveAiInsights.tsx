// src/components/dashboard/PredictiveAiInsights.tsx
"use client";

import {
  Sparkles,
  AlertTriangle,
  MapPin,
  Clock,
  ShieldCheck,
  TrendingUp,
  Compass,
  ArrowRight,
} from "lucide-react";
import { RecurringHotspotAlert } from "@/types";

interface PredictiveAiInsightsProps {
  recurringHotspots: RecurringHotspotAlert[];
}

export default function PredictiveAiInsights({
  recurringHotspots,
}: PredictiveAiInsightsProps) {
  return (
    <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#edf1eb]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#266210] text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#15370d]">
              Analitik Prediktif &amp; Peringatan Dini Hotspot Berulang AI
            </h3>
            <p className="text-xs text-[#52604d]">
              Prediksi pola tumpukan berkala dan rekomendasi tindakan pencegahan sebelum terjadi krisis lingkungan
            </p>
          </div>
        </div>
      </div>

      {/* Recurring Hotspots Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recurringHotspots.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-[#e2e7df] bg-[#f5f7f4] space-y-3 hover:border-[#266210] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-[#15370d] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#266210] flex-shrink-0" />
                  <span>{item.location}</span>
                </p>
                <p className="text-[11px] text-[#52604d] mt-0.5">{item.kabupaten}</p>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 whitespace-nowrap">
                {item.frequency}
              </span>
            </div>

            <div className="text-xs space-y-1.5 pt-2 border-t border-[#d1d8cd]">
              <div className="text-[#52604d]">
                <span className="font-semibold text-[#141b12]">Faktor Pemicu: </span>
                <span>{item.triggerCause}</span>
              </div>

              <div className="text-[#15370d] bg-white p-2.5 rounded-lg border border-[#e2e7df]">
                <span className="font-bold flex items-center gap-1 text-[11px] text-[#266210] mb-0.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Rekomendasi Mitigasi Preventif AI:</span>
                </span>
                <span className="text-[11px] leading-relaxed">{item.aiMitigation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 30-Day Horizon Predictive Card */}
      <div className="p-4 rounded-xl bg-[#eaf2e8] border border-[#cbe0c6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <p className="font-bold text-[#15370d] flex items-center gap-1.5 text-sm">
            <TrendingUp className="h-4 w-4 text-[#266210]" />
            <span>Proyeksi Timbulan Sampah 30 Hari Mendatang</span>
          </p>
          <p className="text-[#52604d] leading-relaxed max-w-2xl">
            Model machine learning memproyeksikan potensi peningkatan timbulan sampah sebesar <strong>+18.5%</strong> di area pesisir barat Bali (Kuta, Seminyak, Canggu) akibat peralihan angin muson barat serta peningkatan pergerakan wisatawan domestik akhir tahun.
          </p>
        </div>

        <div className="flex-shrink-0 px-3.5 py-2 rounded-xl bg-white text-[#15370d] font-bold border border-[#d1d8cd] shadow-sm text-center">
          <p className="text-[10px] text-[#52604d]">Status Kesiapan</p>
          <p className="text-sm font-black text-[#266210]">Siaga Musim Barat</p>
        </div>
      </div>
    </div>
  );
}
