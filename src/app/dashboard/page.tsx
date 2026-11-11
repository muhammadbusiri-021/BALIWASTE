// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BarChart3,
  RefreshCw,
  Printer,
  Calendar,
  Filter,
  MapPin,
  Sparkles,
  Download,
  AlertTriangle,
  Layers,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { DashboardStatsData } from "@/types";
import ExecutiveKpiCards from "@/components/dashboard/ExecutiveKpiCards";
import WasteCompositionChart from "@/components/dashboard/WasteCompositionChart";
import RegencyDistributionChart from "@/components/dashboard/RegencyDistributionChart";
import WeeklyTrendChart from "@/components/dashboard/WeeklyTrendChart";
import EcologicalImpactSection from "@/components/dashboard/EcologicalImpactSection";
import PredictiveAiInsights from "@/components/dashboard/PredictiveAiInsights";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Time Range Filter
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "quarter" | "year">("30d");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/stats");
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data);
      } else {
        throw new Error(json.message || "Gagal memuat statistik");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-7">
        {/* ─── Header Section ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[#e2e7df]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf1eb] border border-[#d1d8cd] text-xs font-bold text-[#15370d] mb-2.5">
              <BarChart3 className="h-3.5 w-3.5 text-[#266210]" />
              <span>Madura Smart Society Environmental Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#15370d] tracking-tight">
              Environmental Impact Dashboard
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#52604d] max-w-2xl leading-relaxed">
              Statistik kondisi persampahan, efektivitas penanganan dinas, metrik dampak ekologis, dan analitik prediktif berbasis regulasi persampahan 4 Kabupaten Pulau Madura.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#d1d8cd] bg-white hover:bg-[#edf1eb] text-xs font-semibold text-[#15370d] shadow-sm transition-colors"
              title="Cetak Ringkasan Laporan Resmi"
            >
              <Printer className="h-3.5 w-3.5 text-[#266210]" />
              <span className="hidden sm:inline">Cetak Dokumen</span>
            </button>

            <button
              type="button"
              onClick={fetchStats}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#d1d8cd] bg-white hover:bg-[#edf1eb] text-xs font-semibold text-[#15370d] shadow-sm transition-colors"
              title="Segarkan Data Real-time"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading ? "animate-spin text-[#266210]" : "")} />
              <span className="hidden sm:inline">Segarkan</span>
            </button>

            <Link
              href="/hotspot"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#266210] hover:bg-[#15370d] text-white text-xs font-bold shadow-md transition-colors"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Peta Hotspot</span>
            </Link>
          </div>
        </div>

        {/* ─── Filter Bar ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#e2e7df] shadow-sm text-xs font-semibold">
          <div className="flex items-center gap-2 text-[#15370d]">
            <Calendar className="h-4 w-4 text-[#266210]" />
            <span>Rentang Waktu Analitik:</span>
          </div>

          <div className="flex items-center gap-1 bg-[#edf1eb] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTimeRange("7d")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors",
                timeRange === "7d"
                  ? "bg-[#266210] text-white shadow-sm font-bold"
                  : "text-[#52604d] hover:text-[#15370d]"
              )}
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("30d")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors",
                timeRange === "30d"
                  ? "bg-[#266210] text-white shadow-sm font-bold"
                  : "text-[#52604d] hover:text-[#15370d]"
              )}
            >
              30 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("quarter")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors",
                timeRange === "quarter"
                  ? "bg-[#266210] text-white shadow-sm font-bold"
                  : "text-[#52604d] hover:text-[#15370d]"
              )}
            >
              Kuartal Ini
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("year")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-colors",
                timeRange === "year"
                  ? "bg-[#266210] text-white shadow-sm font-bold"
                  : "text-[#52604d] hover:text-[#15370d]"
              )}
            >
              1 Tahun Penuh
            </button>
          </div>
        </div>

        {/* ─── Main Content / Loading ─── */}
        {loading && !stats ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-[#e2e7df] text-xs text-[#52604d] space-y-2">
            <RefreshCw className="h-8 w-8 mx-auto text-[#266210] animate-spin" />
            <p className="font-bold text-[#15370d]">Memuat Data Environmental Dashboard...</p>
            <p>Mengkalkulasi agregasi geospasial persampahan Provinsi Bali.</p>
          </div>
        ) : stats ? (
          <div className="space-y-7">
            {/* KPI Executive Strip */}
            <ExecutiveKpiCards stats={stats} />

            {/* Row 1: Komposisi Jenis Sampah & Tren Mingguan */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6">
                <WasteCompositionChart composition={stats.composition} />
              </div>
              <div className="lg:col-span-6">
                <WeeklyTrendChart weeklyTrends={stats.weeklyTrends} />
              </div>
            </div>

            {/* Row 2: Sebaran 9 Kabupaten / Kota */}
            <RegencyDistributionChart regencyStats={stats.regencyStats} />

            {/* Row 3: Dampak Ekologis & Kalkulator Cepat */}
            <EcologicalImpactSection metrics={stats.impactMetrics} />

            {/* Row 4: Analitik Prediktif AI */}
            <PredictiveAiInsights recurringHotspots={stats.recurringHotspots} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
