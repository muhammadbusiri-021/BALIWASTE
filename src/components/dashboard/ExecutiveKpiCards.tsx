// src/components/dashboard/ExecutiveKpiCards.tsx
"use client";

import {
  BarChart3,
  CheckCircle2,
  Leaf,
  Recycle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { DashboardStatsData } from "@/types";

interface ExecutiveKpiCardsProps {
  stats: DashboardStatsData;
}

export default function ExecutiveKpiCards({ stats }: ExecutiveKpiCardsProps) {
  const { impactMetrics } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Laporan Terpetakan */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-xs text-[#52604d] mb-1 font-semibold">
          <span>Total Timbulan Terpetakan</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eaf2e8] text-[#15370d]">
            <Layers className="h-4 w-4 text-[#266210]" />
          </span>
        </div>
        <p className="text-2xl font-black text-[#15370d] tracking-tight">
          {stats.totalReports.toLocaleString("id-ID")}
        </p>
        <p className="text-[11px] text-[#52604d] mt-1 flex items-center gap-1">
          <span className="text-[#266210] font-bold">100% Real-time</span>
          <span>dari 4 Kabupaten se-Madura</span>
        </p>
      </div>

      {/* 2. Tingkat Penyelesaian Penanganan */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-xs text-[#52604d] mb-1 font-semibold">
          <span>Tingkat Penyelesaian</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eaf2e8] text-[#266210]">
            <CheckCircle2 className="h-4 w-4" />
          </span>
        </div>
        <p className="text-2xl font-black text-[#266210] tracking-tight">
          {stats.resolvedRate}%
        </p>
        <div className="w-full bg-[#edf1eb] h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className="bg-[#266210] h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.resolvedRate}%` }}
          />
        </div>
      </div>

      {/* 3. Estimasi Reduksi Emisi Karbon */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-xs text-[#52604d] mb-1 font-semibold">
          <span>Reduksi Emisi CO₂eq</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eaf2e8] text-[#15370d]">
            <Leaf className="h-4 w-4 text-[#266210]" />
          </span>
        </div>
        <p className="text-2xl font-black text-[#15370d] tracking-tight">
          {impactMetrics.co2ReducedTon} <span className="text-sm font-bold text-[#52604d]">Ton</span>
        </p>
        <p className="text-[11px] text-[#52604d] mt-1">
          Dari pengomposan organik &amp; daur ulang
        </p>
      </div>

      {/* 4. Sampah Terpilah dari TPA */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-xs text-[#52604d] mb-1 font-semibold">
          <span>Diversi dari TPA Suwung</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eaf2e8] text-[#266210]">
            <Recycle className="h-4 w-4" />
          </span>
        </div>
        <p className="text-2xl font-black text-[#266210] tracking-tight">
          {impactMetrics.landfillDiversionRate}%
        </p>
        <p className="text-[11px] text-[#52604d] mt-1">
          Kepatuhan Regulasi Persampahan Madura
        </p>
      </div>

      {/* 5. Rata-rata Waktu Penanganan */}
      <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between text-xs text-[#52604d] mb-1 font-semibold">
          <span>Rerata Waktu Respons</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eaf2e8] text-[#15370d]">
            <Clock className="h-4 w-4 text-[#266210]" />
          </span>
        </div>
        <p className="text-2xl font-black text-[#15370d] tracking-tight">
          {impactMetrics.meanResolutionTimeHours} <span className="text-sm font-bold text-[#52604d]">Jam</span>
        </p>
        <p className="text-[11px] text-[#52604d] mt-1">
          Dari laporan terverifikasi hingga bersih
        </p>
      </div>
    </div>
  );
}
