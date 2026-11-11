// src/components/dashboard/WasteCompositionChart.tsx
"use client";

import { PieChart, Layers, Info, CheckCircle2 } from "lucide-react";
import { WasteCompositionItem } from "@/types";

interface WasteCompositionChartProps {
  composition: WasteCompositionItem[];
}

export default function WasteCompositionChart({
  composition,
}: WasteCompositionChartProps) {
  const totalCount = composition.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="rounded-2xl border border-[#e2e7df] bg-white p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#edf1eb]">
        <div>
          <h3 className="text-base font-bold text-[#15370d] flex items-center gap-2">
            <PieChart className="h-4 w-4 text-[#266210]" />
            <span>Komposisi Jenis Sampah Terdeteksi di Madura</span>
          </h3>
          <p className="text-xs text-[#52604d] mt-0.5">
            Hasil identifikasi visual AI Gemini Vision di seluruh titik timbulan
          </p>
        </div>
        <span className="text-xs font-semibold text-[#52604d] bg-[#f5f7f4] px-2.5 py-1 rounded-lg border border-[#e2e7df]">
          Total: {totalCount.toLocaleString("id-ID")} Sampel
        </span>
      </div>

      {/* Multi-segment Stacked Bar */}
      <div className="space-y-2">
        <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner bg-[#edf1eb]">
          {composition.map((item) => (
            <div
              key={item.category}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
              className="h-full transition-all duration-500 hover:opacity-85 relative group cursor-pointer"
              title={`${item.label}: ${item.percentage}% (${item.count} laporan)`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-[#52604d]">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Category List with Detail Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {composition.map((item) => (
          <div
            key={item.category}
            className="p-3 rounded-xl bg-[#f5f7f4] border border-[#e2e7df] space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2 text-[#141b12]">
                <span
                  className="h-3 w-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold">{item.label}</span>
              </span>
              <span className="text-[#15370d] font-black">
                {item.percentage}%
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#52604d]">
              <div className="w-3/4 bg-[#e2e7df] h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.percentage * 2}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
              <span>{item.count} Laporan</span>
            </div>
          </div>
        ))}
      </div>

      {/* Policy Insight Box */}
      <div className="p-3.5 rounded-xl bg-[#eaf2e8] border border-[#cbe0c6] text-xs text-[#15370d] flex items-start gap-2.5">
        <Info className="h-4 w-4 text-[#266210] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <span className="font-bold">Analisis Regulasi Daerah: </span>
          <span>
            Dominasi sampah plastik sekali pakai (38%) menjadi target intervensi utama Peraturan Daerah di 4 Kabupaten se-Madura. Disposisi terpilah limbah organik (32%) dialihkan ke fasilitas komposting TPS3R desa/kelurahan.
          </span>
        </div>
      </div>
    </div>
  );
}
