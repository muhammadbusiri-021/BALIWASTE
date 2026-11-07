// src/components/recommendation/DispatchModal.tsx
"use client";

import { useState } from "react";
import {
  X,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Navigation,
  Loader2,
  Layers,
  Building2,
  ArrowRight,
} from "lucide-react";
import { HandlingTaskItem, ReportStatus } from "@/types";
import { cn } from "@/lib/utils";

interface DispatchModalProps {
  task: HandlingTaskItem | null;
  onClose: () => void;
  onSuccessUpdate: (updatedTask: HandlingTaskItem) => void;
}

const FLEET_OPTIONS = [
  "1 Unit Truk Armroll DLHK & 6 Personel",
  "1 Unit Motor Roda Tiga TPS3R Desa Adat",
  "1 Unit Dump Truck Dinas PUPR & Trash Barrier Boat",
  "1 Tim Satgas Kebersihan Pantai & Beach Cleaner",
  "1 Tim Vertical Rescue & Kantong Sampah Jurang",
  "1 Tim Penanganan Khusus Limbah B3",
  "1 Unit Mesin Pencacah Kompos & Petugas TPS3R",
  "Alat Sapu Magnetik Logistik & Armada Kontainer",
];

const STATUS_OPTIONS: { id: ReportStatus; label: string; desc: string }[] = [
  {
    id: "reported",
    label: "Dilaporkan",
    desc: "Menunggu peninjauan & verifikasi tim pengawas",
  },
  {
    id: "verified",
    label: "Terverifikasi",
    desc: "Lokasi & jenis sampah telah divalidasi, siap disposisi",
  },
  {
    id: "in_progress",
    label: "Sedang Ditangani",
    desc: "Armada & personel sedang beroperasi di lapangan",
  },
  {
    id: "resolved",
    label: "Selesai Ditangani",
    desc: "Timbulan sampah telah diangkut & area telah dibersihkan",
  },
];

export default function DispatchModal({
  task,
  onClose,
  onSuccessUpdate,
}: DispatchModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(
    task?.status || "in_progress"
  );
  const [selectedFleet, setSelectedFleet] = useState<string>(
    FLEET_OPTIONS[0]
  );
  const [actionNotes, setActionNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!task) return null;

  const openGoogleMapsRoute = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${task.latitude},${task.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reports/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: task.id,
          status: selectedStatus,
          action: `Perubahan status menjadi ${selectedStatus}`,
          notes: actionNotes || `Penanganan lapangan menggunakan armada: ${selectedFleet}`,
          allocatedFleet: selectedFleet,
        }),
      });

      const json = await res.json();
      if (json.success) {
        const updatedTask: HandlingTaskItem = {
          ...task,
          status: selectedStatus,
          allocatedFleet: selectedFleet,
          activities: [
            ...(task.activities || []),
            {
              id: json.data?.activity?.id || `act-${Date.now()}`,
              reportId: task.id,
              action: `Status diubah ke ${selectedStatus} (Armada: ${selectedFleet})`,
              notes: actionNotes,
              createdAt: new Date().toISOString(),
            },
          ],
        };

        onSuccessUpdate(updatedTask);
        onClose();
      } else {
        throw new Error(json.message || "Gagal memperbarui status");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e2e7df] overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#edf1eb] bg-[#f5f7f4]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#266210] text-white">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#15370d]">
                Disposisi &amp; Tindak Lanjut Penanganan
              </h3>
              <p className="text-xs text-[#52604d]">
                Alokasikan armada dan perbarui status penanganan di lapangan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#52604d] hover:bg-black/5 hover:text-[#141b12] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Target Info Summary */}
          <div className="p-4 rounded-xl bg-[#edf1eb]/60 border border-[#d1d8cd] space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-[#15370d] line-clamp-1">
                  {task.title}
                </p>
                <p className="text-[11px] text-[#52604d] flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-[#266210]" />
                  <span>{task.address || "Pulau Bali"}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={openGoogleMapsRoute}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#266210] hover:bg-[#15370d] text-white text-[11px] font-semibold flex-shrink-0 transition-colors shadow-sm"
              >
                <Navigation className="h-3 w-3" />
                <span>Navigasi Peta</span>
              </button>
            </div>

            {task.recommendation && (
              <div className="pt-2 border-t border-[#d1d8cd] text-xs text-[#141b12]">
                <p className="font-semibold text-[#15370d]">
                  Rekomendasi AI: {task.recommendation.handlingMethod}
                </p>
                <p className="text-[11px] text-[#52604d] mt-0.5">
                  Instansi Terkait: {task.recommendation.assignedAgency}
                </p>
              </div>
            )}
          </div>

          {/* Ubah Status Penanganan */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#15370d] uppercase tracking-wider block">
              Perbarui Status Penanganan Lapangan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STATUS_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedStatus(opt.id)}
                  className={cn(
                    "p-3 rounded-xl border text-xs cursor-pointer transition-all space-y-1",
                    selectedStatus === opt.id
                      ? "border-[#266210] bg-[#eaf2e8] ring-1 ring-[#266210]"
                      : "border-[#e2e7df] bg-white hover:border-[#266210]/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#15370d]">{opt.label}</span>
                    {selectedStatus === opt.id && (
                      <CheckCircle2 className="h-4 w-4 text-[#266210]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#52604d] leading-tight">
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alokasi Armada & Sumber Daya */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#15370d] uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-[#266210]" />
              <span>Alokasi Armada &amp; Personel Lapangan:</span>
            </label>
            <select
              value={selectedFleet}
              onChange={(e) => setSelectedFleet(e.target.value)}
              className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#141b12] focus:border-[#266210] outline-none"
            >
              {FLEET_OPTIONS.map((fleet, idx) => (
                <option key={idx} value={fleet}>
                  {fleet}
                </option>
              ))}
            </select>
          </div>

          {/* Catatan Lapangan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#15370d] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#266210]" />
              <span>Catatan Log Tindakan Petugas:</span>
            </label>
            <textarea
              rows={3}
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Contoh: Tim Satgas Pantai telah menyelesaikan pengangkutan 2 truk residu plastik ke TPA Suwung."
              className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] p-3 text-xs sm:text-sm text-[#141b12] focus:border-[#266210] outline-none resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#edf1eb]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#d1d8cd] bg-white hover:bg-[#edf1eb] text-xs font-bold text-[#52604d] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#266210] hover:bg-[#15370d] text-white text-xs sm:text-sm font-bold shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan Disposisi...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Simpan Perubahan &amp; Disposisi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
