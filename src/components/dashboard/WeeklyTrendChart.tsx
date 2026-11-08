// src/components/dashboard/WeeklyTrendChart.tsx
"use client";

import { TrendingUp, Calendar, ArrowUpRight, BarChart2 } from "lucide-react";
import { WeeklyTrendItem } from "@/types";

interface WeeklyTrendChartProps {
  weeklyTrends: WeeklyTrendItem[];
}

export default function WeeklyTrendChart({
  weeklyTrends,
}: WeeklyTrendChartProps) {
  const maxVal = Math.max(
    ...weeklyTrends.map((d) => Math.max(d.incoming, d.resolved)),
    100
  );

  return (
    <div className="rounded-2xl border border-[#e2e7df] bg-white p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#edf1eb]">
        <div>
          <h3 className="text-base font-bold text-[#15370d] flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#266210]" />
            <span>Tren Timbulan vs Penyelesaian Sampah Mingguan</span>
          </h3>
          <p className="text-xs text-[#52604d] mt-0.5">
            Dinamika volume laporan harian masyarakat berbanding aksi penanganan dinas &amp; TPS3R
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#52604d]">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-[#ea580c]" />
            <span>Laporan Masuk</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-[#266210]" />
            <span>Diselesaikan</span>
          </span>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-[#e2e7df]">
        {weeklyTrends.map((item) => {
          const incomingHeight = Math.round((item.incoming / maxVal) * 100);
          const resolvedHeight = Math.round((item.resolved / maxVal) * 100);

          return (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
            >
              {/* Value Tooltip on hover */}
              <div className="flex items-end justify-center gap-1.5 w-full h-full">
                {/* Incoming Bar */}
                <div
                  style={{ height: `${incomingHeight}%` }}
                  className="w-full max-w-[16px] sm:max-w-[22px] bg-[#ea580c] rounded-t-md hover:bg-[#c2410c] transition-all relative group cursor-pointer"
                  title={`${item.day} (${item.date}): ${item.incoming} Laporan Masuk`}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[#141b12] text-white px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap z-10">
                    {item.incoming}
                  </span>
                </div>

                {/* Resolved Bar */}
                <div
                  style={{ height: `${resolvedHeight}%` }}
                  className="w-full max-w-[16px] sm:max-w-[22px] bg-[#266210] rounded-t-md hover:bg-[#15370d] transition-all relative group cursor-pointer"
                  title={`${item.day} (${item.date}): ${item.resolved} Terselesaikan`}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[#141b12] text-white px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap z-10">
                    {item.resolved}
                  </span>
                </div>
              </div>

              {/* Day Label */}
              <div className="text-center">
                <p className="text-[11px] font-bold text-[#141b12]">{item.day}</p>
                <p className="text-[10px] text-[#52604d] hidden sm:block">{item.date}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend Insights */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#52604d] pt-1">
        <p className="flex items-center gap-1.5">
          <ArrowUpRight className="h-4 w-4 text-[#ea580c] flex-shrink-0" />
          <span>
            Lonjakan laporan tertinggi terjadi pada hari <strong>Sabtu (88 laporan)</strong> seiring peningkatan aktivitas akhir pekan di destinasi pariwisata Badung &amp; Denpasar.
          </span>
        </p>
      </div>
    </div>
  );
}
