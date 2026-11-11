// src/app/rekomendasi/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  Truck,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Scale,
  MapPin,
  Plus,
  ShieldCheck,
  Layers,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { HandlingTaskItem } from "@/types";
import AiRecommendationSimulator from "@/components/recommendation/AiRecommendationSimulator";
import TaskDispatchMatrix from "@/components/recommendation/TaskDispatchMatrix";
import DispatchModal from "@/components/recommendation/DispatchModal";
import BaliRegulationsGuide from "@/components/recommendation/BaliRegulationsGuide";
import { cn } from "@/lib/utils";

export default function RekomendasiPage() {
  const [tasks, setTasks] = useState<HandlingTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab: 'tasks' | 'simulator' | 'regulations'
  const [activeTab, setActiveTab] = useState<"tasks" | "simulator" | "regulations">("tasks");

  // Selected task for dispatch modal
  const [selectedTask, setSelectedTask] = useState<HandlingTaskItem | null>(null);

  // Fetch all tasks from /api/hotspot
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hotspot");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTasks(json.data);
      } else {
        throw new Error(json.message || "Gagal memuat daftar tugas");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handler saat tugas berhasil di-update dari modal disposisi
  const handleSuccessUpdate = (updatedTask: HandlingTaskItem) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const criticalCount = tasks.filter(
      (t) => t.severity === "critical" || t.severity === "high"
    ).length;
    const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
    const resolvedCount = tasks.filter((t) => t.status === "resolved").length;

    return {
      total,
      criticalCount,
      inProgressCount,
      resolvedCount,
    };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-[#f5f7f4] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ─── Hero Header ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[#e2e7df]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf1eb] border border-[#d1d8cd] text-xs font-bold text-[#15370d] mb-2.5">
              <Sparkles className="h-3.5 w-3.5 text-[#266210]" />
              <span>Smart Waste Handling Recommendation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#15370d] tracking-tight">
              Rekomendasi Penanganan Cerdas &amp; Disposisi Lapangan
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#52604d] max-w-2xl leading-relaxed">
              Sistem rekomendasi berbasis Artificial Intelligence untuk menentukan skala prioritas,
              metode penanganan taktis, alokasi armada kebersihan, dan pemantauan tindak lanjut lapangan di seluruh Pulau Madura.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={fetchTasks}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#d1d8cd] bg-white hover:bg-[#edf1eb] text-xs font-semibold text-[#15370d] shadow-sm transition-colors"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading ? "animate-spin text-[#266210]" : "")} />
              <span className="hidden sm:inline">Segarkan Data</span>
            </button>

            <Link
              href="/lapor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#266210] hover:bg-[#15370d] text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Laporan</span>
            </Link>
          </div>
        </div>

        {/* ─── KPI Stats Strip ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#52604d] mb-1 font-medium">
              <span>Total Antrean Tugas</span>
              <ClipboardList className="h-4 w-4 text-[#266210]" />
            </div>
            <p className="text-2xl font-black text-[#15370d]">{stats.total}</p>
            <p className="text-[11px] text-[#52604d] mt-0.5">
              Tersebar di 4 Kabupaten (Bangkalan, Sampang, Pamekasan, Sumenep)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm">
            <div className="flex items-center justify-between text-xs text-red-700 mb-1 font-semibold">
              <span>Prioritas Darurat / Tinggi</span>
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-red-700">{stats.criticalCount}</p>
            <p className="text-[11px] text-[#52604d] mt-0.5">
              Butuh disposisi armada segera
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-700 mb-1 font-semibold">
              <span>Sedang Ditangani</span>
              <Truck className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-600">{stats.inProgressCount}</p>
            <p className="text-[11px] text-[#52604d] mt-0.5">
              Armada aktif di lapangan
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm">
            <div className="flex items-center justify-between text-xs text-emerald-800 mb-1 font-semibold">
              <span>Selesai Dibersihkan</span>
              <CheckCircle2 className="h-4 w-4 text-[#266210]" />
            </div>
            <p className="text-2xl font-black text-[#266210]">{stats.resolvedCount}</p>
            <p className="text-[11px] text-[#52604d] mt-0.5">
              Target penanganan terpenuhi
            </p>
          </div>
        </div>

        {/* ─── Navigation Tabs ─── */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-[#e2e7df] shadow-sm text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={cn(
              "px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0",
              activeTab === "tasks"
                ? "bg-[#266210] text-white shadow-sm"
                : "text-[#52604d] hover:bg-[#edf1eb] hover:text-[#15370d]"
            )}
          >
            <Truck className="h-4 w-4" />
            <span>Matriks Disposisi Tugas ({tasks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            className={cn(
              "px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0",
              activeTab === "simulator"
                ? "bg-[#266210] text-white shadow-sm"
                : "text-[#52604d] hover:bg-[#edf1eb] hover:text-[#15370d]"
            )}
          >
            <Sparkles className="h-4 w-4" />
            <span>Simulator AI Rekomendasi Cerdas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("regulations")}
            className={cn(
              "px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 flex-shrink-0",
              activeTab === "regulations"
                ? "bg-[#266210] text-white shadow-sm"
                : "text-[#52604d] hover:bg-[#edf1eb] hover:text-[#15370d]"
            )}
          >
            <Scale className="h-4 w-4" />
            <span>Landasan Regulasi Persampahan Bali</span>
          </button>
        </div>

        {/* ─── Tab Content ─── */}
        {activeTab === "tasks" && (
          <TaskDispatchMatrix
            tasks={tasks}
            onOpenDispatchModal={(task) => setSelectedTask(task)}
          />
        )}

        {activeTab === "simulator" && <AiRecommendationSimulator />}

        {activeTab === "regulations" && <BaliRegulationsGuide />}
      </div>

      {/* ─── Dispatch Modal ─── */}
      <DispatchModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onSuccessUpdate={handleSuccessUpdate}
      />
    </div>
  );
}
