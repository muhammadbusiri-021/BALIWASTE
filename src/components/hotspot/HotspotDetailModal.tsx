// src/components/hotspot/HotspotDetailModal.tsx
"use client";

import { HotspotPoint } from "@/types";
import {
  X,
  MapPin,
  AlertTriangle,
  Sparkles,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Calendar,
  Layers,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HotspotDetailModalProps {
  hotspot: HotspotPoint | null;
  onClose: () => void;
}

const SEVERITY_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  critical: { label: "Kritis", bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
  high: { label: "Tinggi", bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
  medium: { label: "Sedang", bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  low: { label: "Rendah", bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
};

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  reported: { label: "Dilaporkan", bg: "bg-blue-100", text: "text-blue-800" },
  verified: { label: "Terverifikasi", bg: "bg-indigo-100", text: "text-indigo-800" },
  in_progress: { label: "Sedang Ditangani", bg: "bg-amber-100", text: "text-amber-800" },
  resolved: { label: "Selesai Ditangani", bg: "bg-emerald-100", text: "text-emerald-800" },
};

export default function HotspotDetailModal({ hotspot, onClose }: HotspotDetailModalProps) {
  const [showFullImage, setShowFullImage] = useState(false);

  if (!hotspot) return null;

  const sev = SEVERITY_BADGES[hotspot.severity] || SEVERITY_BADGES.low;
  const stat = STATUS_BADGES[hotspot.status] || STATUS_BADGES.reported;
  const rec = hotspot.recommendation;

  const openGoogleMapsRoute = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hotspot.latitude},${hotspot.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#e2e7df] overflow-hidden flex flex-col my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Image with Badges */}
          <div className="relative h-56 sm:h-64 w-full bg-[#141b12]/10 overflow-hidden flex-shrink-0">
            {hotspot.imageUrl ? (
              <img
                src={hotspot.imageUrl}
                alt={hotspot.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#edf1eb] text-[#52604d]">
                <span>Foto tidak tersedia</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors shadow-md"
              title="Tutup dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Expand Photo Button */}
            {hotspot.imageUrl && (
              <button
                onClick={() => setShowFullImage(true)}
                className="absolute top-3 left-3 h-9 px-3 rounded-full bg-black/50 hover:bg-black/70 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm transition-colors shadow-md"
                title="Perbesar foto"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Foto Penuh</span>
              </button>
            )}

            {/* Overlay Badges */}
            <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold border shadow-sm",
                  sev.bg,
                  sev.text,
                  sev.border
                )}
              >
                Keparahan: {sev.label}
              </span>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold shadow-sm",
                  stat.bg,
                  stat.text
                )}
              >
                Status: {stat.label}
              </span>
              {hotspot.aiWasteType && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-[#15370d] backdrop-blur-sm shadow-sm flex items-center gap-1">
                  <Layers className="h-3 w-3 text-[#266210]" />
                  {hotspot.aiWasteType.replace("anorganik_", "")}
                </span>
              )}
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[#141b12]">
            {/* Title & Address */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#15370d] leading-snug">
                {hotspot.title}
              </h2>
              <div className="mt-2 flex items-start gap-2 text-xs text-[#52604d]">
                <MapPin className="h-4 w-4 text-[#266210] flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {hotspot.address || "Wilayah Pulau Bali"}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-4 text-[11px] text-[#52604d]">
                <span>
                  Koordinat: {hotspot.latitude.toFixed(5)}, {hotspot.longitude.toFixed(5)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(hotspot.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Description */}
            {hotspot.description && (
              <div className="p-3.5 rounded-xl bg-[#f5f7f4] border border-[#e2e7df] text-xs leading-relaxed text-[#52604d]">
                <p className="font-semibold text-[#15370d] mb-1">Kondisi di Lapangan:</p>
                <p>{hotspot.description}</p>
              </div>
            )}

            {/* AI Recommendation Section */}
            {rec && (
              <div className="rounded-xl border border-[#d1d8cd] bg-[#edf1eb]/60 p-4 space-y-3.5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#15370d]">
                  <Sparkles className="h-4 w-4 text-[#266210]" />
                  <span>Rekomendasi Penanganan Cerdas (AI)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-[#e2e7df]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#15370d] mb-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#266210]" />
                      Prioritas Penanganan
                    </div>
                    <p className="text-[#52604d] font-medium">{rec.priority}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-[#e2e7df]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#15370d] mb-1">
                      <Building2 className="h-3.5 w-3.5 text-[#266210]" />
                      Instansi Penanggung Jawab
                    </div>
                    <p className="text-[#52604d] font-medium">{rec.assignedAgency}</p>
                  </div>
                </div>

                {rec.handlingMethod && (
                  <div className="p-3 rounded-lg bg-white border border-[#e2e7df] text-xs">
                    <p className="font-semibold text-[#15370d] mb-1">Metode Penanganan yang Direkomendasikan:</p>
                    <p className="text-[#52604d] leading-relaxed">{rec.handlingMethod}</p>
                  </div>
                )}

                {rec.resourcesNeeded && (
                  <div className="p-3 rounded-lg bg-white border border-[#e2e7df] text-xs">
                    <p className="font-semibold text-[#15370d] mb-1">Kebutuhan Sumber Daya & Personel:</p>
                    <p className="text-[#52604d] leading-relaxed">{rec.resourcesNeeded}</p>
                  </div>
                )}

                {rec.actionSteps && rec.actionSteps.length > 0 && (
                  <div className="p-3 rounded-lg bg-white border border-[#e2e7df] text-xs">
                    <p className="font-semibold text-[#15370d] mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#266210]" />
                      Langkah Tindakan Petugas di Lapangan:
                    </p>
                    <ol className="space-y-1.5 pl-4 list-decimal text-[#52604d]">
                      {rec.actionSteps.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions Footer */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={openGoogleMapsRoute}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#266210] hover:bg-[#347f18] text-white text-xs font-semibold shadow-md transition-colors"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>Petunjuk Rute di Google Maps</span>
              </button>

              <Link
                href="/lapor"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#d1d8cd] bg-white hover:bg-[#edf1eb] text-[#15370d] text-xs font-semibold transition-colors"
              >
                <span>Laporkan Sampah Baru</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Lightbox */}
      {showFullImage && hotspot.imageUrl && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={hotspot.imageUrl}
              alt={hotspot.title}
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-3 right-3 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
