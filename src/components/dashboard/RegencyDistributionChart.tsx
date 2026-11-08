// src/components/dashboard/RegencyDistributionChart.tsx
"use client";

import { MapPin, CheckCircle2, AlertTriangle, Building2, TrendingUp } from "lucide-react";
import { RegencyStatsItem } from "@/types";

interface RegencyDistributionChartProps {
  regencyStats: RegencyStatsItem[];
}

export default function RegencyDistributionChart({
  regencyStats,
}: RegencyDistributionChartProps) {
  const maxReports = Math.max(...regencyStats.map((r) => r.totalReports), 1);

  return (
    <div className="rounded-2xl border border-[#e2e7df] bg-white p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#edf1eb]">
        <div>
          <h3 className="text-base font-bold text-[#15370d] flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#266210]" />
            <span>Sebaran Penanganan Sampah 9 Kabupaten / Kota Bali</span>
          </h3>
          <p className="text-xs text-[#52604d] mt-0.5">
            Komparasi volume timbulan sampah dan efektivitas resolusi lapangan per wilayah
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#52604d]">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#266210]" />
            <span>Terselesaikan</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#d1d8cd]" />
            <span>Sisa Antrean</span>
          </span>
        </div>
      </div>

      {/* Regency List Bars */}
      <div className="space-y-3.5">
        {regencyStats.map((item) => {
          const percentageWidth = Math.round((item.totalReports / maxReports) * 100);
          const resolvedWidth = Math.round((item.resolvedReports / item.totalReports) * 100);

          return (
            <div key={item.kabupaten} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#141b12] flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#266210]" />
                  <span>{item.kabupaten}</span>
                  {item.criticalReports > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800 border border-red-200">
                      {item.criticalReports} Kritis
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2.5 font-semibold text-[11px]">
                  <span className="text-[#52604d]">
                    {item.resolvedReports} / {item.totalReports} Laporan
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#eaf2e8] text-[#15370d] font-bold">
                    {item.resolutionRate}%
                  </span>
                </div>
              </div>

              {/* Stacked Progress Bar */}
              <div className="w-full h-3 rounded-full bg-[#f0f4ef] overflow-hidden flex shadow-inner">
                <div
                  className="bg-[#266210] h-full rounded-l-full transition-all duration-500"
                  style={{ width: `${(percentageWidth * resolvedWidth) / 100}%` }}
                  title={`Terselesaikan: ${item.resolvedReports} titik`}
                />
                <div
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{
                    width: `${
                      (percentageWidth * (item.totalReports - item.resolvedReports)) /
                      item.totalReports
                    }%`,
                  }}
                  title={`Dalam penanganan: ${item.totalReports - item.resolvedReports} titik`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
