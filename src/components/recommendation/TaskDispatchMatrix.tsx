// src/components/recommendation/TaskDispatchMatrix.tsx
"use client";

import { useState, useMemo } from "react";
import {
  HandlingTaskItem,
  ReportStatus,
  ReportSeverity,
} from "@/types";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Truck,
  MapPin,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Navigation,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDispatchMatrixProps {
  tasks: HandlingTaskItem[];
  onOpenDispatchModal: (task: HandlingTaskItem) => void;
}

const STATUS_CONFIG: Record<
  ReportStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  reported: {
    label: "Dilaporkan",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Clock,
  },
  verified: {
    label: "Terverifikasi",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "Sedang Ditangani",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: Truck,
  },
  resolved: {
    label: "Selesai Ditangani",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
};

const SEVERITY_CONFIG: Record<
  ReportSeverity,
  { label: string; bg: string; text: string; border: string }
> = {
  critical: {
    label: "Kritis",
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
  },
  high: {
    label: "Tinggi",
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-300",
  },
  medium: {
    label: "Sedang",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
  },
  low: {
    label: "Rendah",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-300",
  },
};

export default function TaskDispatchMatrix({
  tasks,
  onOpenDispatchModal,
}: TaskDispatchMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAgency, setSelectedAgency] = useState<string>("all");

  // Filter agen / instansi unik dari dataset
  const agencyList = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.recommendation?.assignedAgency) {
        set.add(t.recommendation.assignedAgency);
      }
    });
    return Array.from(set);
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedPriority !== "all") {
        if (selectedPriority === "Tinggi" && t.severity !== "critical" && t.severity !== "high") {
          return false;
        }
        if (selectedPriority === "Sedang" && t.severity !== "medium") {
          return false;
        }
        if (selectedPriority === "Rendah" && t.severity !== "low") {
          return false;
        }
      }

      if (selectedStatus !== "all" && t.status !== selectedStatus) {
        return false;
      }

      if (
        selectedAgency !== "all" &&
        t.recommendation?.assignedAgency !== selectedAgency
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchAddr = (t.address || "").toLowerCase().includes(q);
        const matchDesc = (t.description || "").toLowerCase().includes(q);
        const matchAgency = (t.recommendation?.assignedAgency || "")
          .toLowerCase()
          .includes(q);
        return matchTitle || matchAddr || matchDesc || matchAgency;
      }

      return true;
    });
  }, [tasks, selectedPriority, selectedStatus, selectedAgency, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-[#e2e7df] bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52604d]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lokasi, instansi, atau deskripsi penanganan sampah..."
              className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#141b12] focus:border-[#266210] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-[#52604d] font-semibold">
            <span>Ditemukan: </span>
            <span className="px-2.5 py-1 rounded-full bg-[#edf1eb] font-bold text-[#15370d]">
              {filteredTasks.length} Tugas
            </span>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-[#edf1eb] text-xs">
          <span className="font-bold text-[#15370d] flex items-center gap-1.5 mr-1">
            <Filter className="h-3.5 w-3.5 text-[#266210]" />
            <span>Filter Cepat:</span>
          </span>

          {/* Filter Prioritas */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-lg border border-[#d1d8cd] bg-[#f5f7f4] px-2.5 py-1.5 font-semibold text-[#141b12] focus:border-[#266210] outline-none"
          >
            <option value="all">Semua Prioritas AI</option>
            <option value="Tinggi">Prioritas Tinggi / Kritis</option>
            <option value="Sedang">Prioritas Sedang</option>
            <option value="Rendah">Prioritas Rendah</option>
          </select>

          {/* Filter Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-[#d1d8cd] bg-[#f5f7f4] px-2.5 py-1.5 font-semibold text-[#141b12] focus:border-[#266210] outline-none"
          >
            <option value="all">Semua Status Penanganan</option>
            <option value="reported">Dilaporkan</option>
            <option value="verified">Terverifikasi</option>
            <option value="in_progress">Sedang Ditangani</option>
            <option value="resolved">Selesai Ditangani</option>
          </select>

          {/* Filter Instansi */}
          <select
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
            className="rounded-lg border border-[#d1d8cd] bg-[#f5f7f4] px-2.5 py-1.5 font-semibold text-[#141b12] focus:border-[#266210] outline-none max-w-[200px] truncate"
          >
            <option value="all">Semua Instansi Terkait</option>
            {agencyList.map((agency, idx) => (
              <option key={idx} value={agency}>
                {agency}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-[#e2e7df] text-xs text-[#52604d] space-y-2">
            <Truck className="h-10 w-10 mx-auto text-[#9ca896]" />
            <p className="font-bold text-[#15370d] text-sm">
              Tidak ada tugas yang cocok dengan filter
            </p>
            <p>Silakan sesuaikan kriteria pencarian atau pilih instansi lain.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const sev = SEVERITY_CONFIG[task.severity as ReportSeverity] || SEVERITY_CONFIG.low;
            const stat = STATUS_CONFIG[task.status as ReportStatus] || STATUS_CONFIG.reported;
            const StatusIcon = stat.icon;
            const rec = task.recommendation;

            return (
              <div
                key={task.id}
                className="group rounded-2xl border border-[#e2e7df] bg-white p-5 shadow-sm hover:shadow-md hover:border-[#266210] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                          sev.bg,
                          sev.text,
                          sev.border
                        )}
                      >
                        Keparahan: {sev.label}
                      </span>
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1",
                          stat.bg,
                          stat.text,
                          stat.border
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{stat.label}</span>
                      </span>
                    </div>

                    {rec?.priority && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#edf1eb] text-[#15370d] border border-[#d1d8cd]">
                        Prioritas AI: {rec.priority}
                      </span>
                    )}
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h3 className="text-sm font-bold text-[#15370d] group-hover:text-[#266210] transition-colors leading-snug line-clamp-2">
                      {task.title}
                    </h3>
                    <p className="text-[11px] text-[#52604d] mt-1 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#266210] flex-shrink-0" />
                      <span className="line-clamp-1">{task.address || "Pulau Bali"}</span>
                    </p>
                  </div>

                  {/* Recommendation snippet */}
                  {rec && (
                    <div className="p-3 rounded-xl bg-[#f5f7f4] border border-[#edf1eb] text-xs space-y-1.5">
                      <div className="flex items-start gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-[#266210] flex-shrink-0 mt-0.5" />
                        <p className="font-semibold text-[#141b12] line-clamp-2 leading-relaxed">
                          {rec.handlingMethod}
                        </p>
                      </div>

                      <div className="pt-1.5 border-t border-[#e2e7df] flex flex-wrap items-center justify-between text-[11px] text-[#52604d]">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-[#266210]" />
                          <span>{rec.assignedAgency}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Allocated Fleet tag if present */}
                  {task.allocatedFleet && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#266210] bg-[#eaf2e8] px-2.5 py-1 rounded-lg">
                      <Truck className="h-3.5 w-3.5" />
                      <span>Armada: {task.allocatedFleet}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-[#edf1eb] flex items-center justify-between gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#52604d] hover:text-[#15370d] transition-colors"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Rute Maps</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => onOpenDispatchModal(task)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#266210] hover:bg-[#15370d] text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    <span>Disposisi &amp; Update Status</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
