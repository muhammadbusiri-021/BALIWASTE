// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, CheckCircle, AlertTriangle, Layers, RefreshCw } from "lucide-react";

interface DashboardStats {
  totalReports: number;
  resolvedRate: number;
  statusCounts: {
    reported: number;
    verified: number;
    in_progress: number;
    resolved: number;
  };
  severityCounts: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  categoryCounts: Record<string, number>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/stats");
      const json = await res.json();
      if (res.ok && json.success) {
        setStats(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat statistik dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7f4] pt-28 sm:pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf2e8] px-3.5 py-1 text-xs font-semibold text-[#15370d] border border-[#d6e4d2] mb-3">
              <BarChart3 className="h-3.5 w-3.5 text-[#266210]" />
              Fitur Inti 4: Environmental Impact Analytics
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15370d] tracking-tight">
              Environmental Impact Dashboard
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#52604d] max-w-2xl">
              Agregasi data analitik dan statistik kondisi persampahan di seluruh Bali untuk
              membantu dinas terkait dan pembuat kebijakan mengambil keputusan berbasis data.
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#d6e4d2] bg-white px-4 py-2.5 text-sm font-semibold text-[#15370d] hover:bg-gray-50 transition-colors shadow-sm self-start md:self-auto"
          >
            <RefreshCw className={`h-4 w-4 text-[#266210] ${loading ? "animate-spin" : ""}`} />
            Sinkronkan Data
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1 */}
          <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#52604d]">
              Total Laporan Masuk
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#15370d]">
                {stats?.totalReports ?? 0}
              </span>
              <span className="text-xs text-[#266210] font-semibold">Tercatat</span>
            </div>
            <p className="mt-2 text-xs text-[#52604d]">Terkumpul dari partisipasi publik & AI</p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#52604d]">
              Tingkat Penanganan (Resolved)
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-[#266210]">
                {stats?.resolvedRate ?? 0}%
              </span>
              <span className="text-xs text-[#266210] font-semibold">Rasio Sukses</span>
            </div>
            <p className="mt-2 text-xs text-[#52604d]">Laporan yang telah tuntas dibersihkan</p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#52604d]">
              Status Kritis / Darurat
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-red-600">
                {stats?.severityCounts.critical ?? 0}
              </span>
              <span className="text-xs text-red-600 font-semibold">Titik Urgent</span>
            </div>
            <p className="mt-2 text-xs text-[#52604d]">Menyumbat sungai atau timbulan masif</p>
          </div>

          {/* Card 4 */}
          <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#52604d]">
              Dalam Penanganan
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-600">
                {(stats?.statusCounts.in_progress ?? 0) + (stats?.statusCounts.verified ?? 0)}
              </span>
              <span className="text-xs text-amber-600 font-semibold">On Progress</span>
            </div>
            <p className="mt-2 text-xs text-[#52604d]">Sedang ditindaklanjuti tim armada TPS3R</p>
          </div>
        </div>

        {/* Breakdown Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Penanganan */}
          <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-[#15370d] mb-4">
              Status Penanganan Laporan Lapangan
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#52604d] mb-1">
                  <span>Selesai Dibersihkan (Resolved)</span>
                  <span className="text-[#266210]">{stats?.statusCounts.resolved ?? 0} titik</span>
                </div>
                <div className="w-full bg-[#f5f7f4] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#266210] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        stats?.totalReports
                          ? ((stats.statusCounts.resolved / stats.totalReports) * 100).toFixed(0)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#52604d] mb-1">
                  <span>Sedang Ditindaklanjuti (In Progress)</span>
                  <span className="text-amber-600">{stats?.statusCounts.in_progress ?? 0} titik</span>
                </div>
                <div className="w-full bg-[#f5f7f4] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        stats?.totalReports
                          ? ((stats.statusCounts.in_progress / stats.totalReports) * 100).toFixed(0)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#52604d] mb-1">
                  <span>Terverifikasi AI (Verified)</span>
                  <span className="text-blue-600">{stats?.statusCounts.verified ?? 0} titik</span>
                </div>
                <div className="w-full bg-[#f5f7f4] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        stats?.totalReports
                          ? ((stats.statusCounts.verified / stats.totalReports) * 100).toFixed(0)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#52604d] mb-1">
                  <span>Baru Dilaporkan (Reported)</span>
                  <span className="text-gray-600">{stats?.statusCounts.reported ?? 0} titik</span>
                </div>
                <div className="w-full bg-[#f5f7f4] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gray-400 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        stats?.totalReports
                          ? ((stats.statusCounts.reported / stats.totalReports) * 100).toFixed(0)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kategori Sampah AI */}
          <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-base font-bold text-[#15370d] mb-4">
              Komposisi Kategori Sampah Terdeteksi AI
            </h3>
            {stats && Object.keys(stats.categoryCounts).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.categoryCounts).map(([cat, count]) => {
                  const percentage = stats.totalReports > 0 ? Math.round((count / stats.totalReports) * 100) : 0;
                  return (
                    <div key={cat} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#15370d] capitalize">
                        {cat.replace("_", " ")}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#52604d]">{count} laporan</span>
                        <span className="w-12 text-right font-bold text-[#266210]">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#52604d]">Belum ada data komposisi sampah.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
