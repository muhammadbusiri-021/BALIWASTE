// src/app/hotspot/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  MapPin,
  AlertTriangle,
  Layers,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Loader2,
  Plus,
  RefreshCw,
  Compass,
  LayoutGrid,
  Map as MapIcon,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { HotspotPoint, ReportSeverity, ReportStatus } from "@/types";
import { BaliRegionItem } from "@/constants/bali-regions";
import RegionSearchBar from "@/components/hotspot/RegionSearchBar";
import HotspotDetailModal from "@/components/hotspot/HotspotDetailModal";
import { WASTE_CATEGORIES } from "@/constants";
import { cn } from "@/lib/utils";

// Dynamic import untuk Leaflet map (client-side only agar aman dari SSR window undefined)
const BaliHotspotMap = dynamic(
  () => import("@/components/maps/BaliHotspotMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[460px] w-full rounded-2xl bg-[#edf1eb] animate-pulse flex flex-col items-center justify-center gap-2 text-xs text-[#52604d] border border-[#d1d8cd]">
        <Loader2 className="h-6 w-6 animate-spin text-[#266210]" />
        <span className="font-medium">Memuat Peta Interaktif Hotspot Madura...</span>
      </div>
    ),
  }
);

const SEVERITY_COLORS: Record<string, { badge: string; text: string; bg: string }> = {
  critical: { badge: "bg-red-100 text-red-800 border-red-300", text: "text-red-700", bg: "bg-red-500" },
  high: { badge: "bg-orange-100 text-orange-800 border-orange-300", text: "text-orange-700", bg: "bg-orange-500" },
  medium: { badge: "bg-amber-100 text-amber-800 border-amber-300", text: "text-amber-700", bg: "bg-amber-500" },
  low: { badge: "bg-emerald-100 text-emerald-800 border-emerald-300", text: "text-emerald-700", bg: "bg-emerald-500" },
};

const SEVERITY_LABELS: Record<string, string> = {
  critical: "Kritis",
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

export default function HotspotPage() {
  const [hotspots, setHotspots] = useState<HotspotPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected filters
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Region search selection (Desa, Kecamatan, Kabupaten)
  const [activeRegion, setActiveRegion] = useState<BaliRegionItem | null>(null);
  const [flyToTarget, setFlyToTarget] = useState<{
    lat: number;
    lng: number;
    zoom: number;
    timestamp: number;
  } | null>(null);

  // Detail Modal
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPoint | null>(null);

  // Layout View mode
  const [viewMode, setViewMode] = useState<"split" | "map" | "list">("split");

  // Fetch hotspots data
  const fetchHotspots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hotspot");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setHotspots(json.data);
      } else {
        throw new Error(json.message || "Gagal memuat titik hotspot");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat data hotspot";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotspots();
  }, [fetchHotspots]);

  // Handler pemilihan daerah (Desa, Kecamatan, Kabupaten)
  const handleSelectRegion = (region: BaliRegionItem | null) => {
    setActiveRegion(region);
    if (region) {
      setFlyToTarget({
        lat: region.lat,
        lng: region.lng,
        zoom: region.zoom,
        timestamp: Date.now(),
      });
    } else {
      // Kembali ke seluruh Madura
      setFlyToTarget({
        lat: -7.08,
        lng: 113.35,
        zoom: 9.5,
        timestamp: Date.now(),
      });
    }
  };

  // Filter titik hotspot di client side
  const filteredHotspots = useMemo(() => {
    return hotspots.filter((point) => {
      // Filter keparahan
      if (selectedSeverity !== "all" && point.severity !== selectedSeverity) {
        return false;
      }

      // Filter kategori
      if (selectedCategory !== "all" && point.aiWasteType !== selectedCategory) {
        return false;
      }

      // Filter status
      if (selectedStatus !== "all" && point.status !== selectedStatus) {
        return false;
      }

      // Filter wilayah aktif
      if (activeRegion) {
        const addr = (point.address || "").toLowerCase();
        const title = point.title.toLowerCase();
        const kab = (point.kabupaten || "").toLowerCase();
        const kec = (point.kecamatan || "").toLowerCase();
        const desa = (point.desa || "").toLowerCase();

        const regionName = activeRegion.name.toLowerCase();
        const cleanKab = activeRegion.kabupaten.toLowerCase();

        if (activeRegion.type === "desa") {
          const matchDesa =
            desa.includes(regionName) ||
            addr.includes(regionName) ||
            title.includes(regionName);
          return matchDesa;
        } else if (activeRegion.type === "kecamatan") {
          const matchKec =
            kec.includes(regionName) ||
            addr.includes(regionName) ||
            title.includes(regionName);
          return matchKec;
        } else if (activeRegion.type === "kabupaten") {
          const matchKab =
            kab.includes(cleanKab) ||
            addr.includes(cleanKab) ||
            title.includes(cleanKab);
          return matchKab;
        }
      }

      return true;
    });
  }, [hotspots, selectedSeverity, selectedCategory, selectedStatus, activeRegion]);

  // Statistik ringkas
  const stats = useMemo(() => {
    const total = filteredHotspots.length;
    const criticalCount = filteredHotspots.filter((h) => h.severity === "critical").length;
    const highCount = filteredHotspots.filter((h) => h.severity === "high").length;
    const resolvedCount = filteredHotspots.filter((h) => h.status === "resolved").length;

    return {
      total,
      criticalCount,
      highCount,
      resolvedCount,
    };
  }, [filteredHotspots]);

  return (
    <div className="min-h-screen bg-[#f5f7f4] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* ─── Hero Header ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#e2e7df]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf1eb] border border-[#d1d8cd] text-xs font-bold text-[#15370d] mb-2.5">
              <MapPin className="h-3.5 w-3.5 text-[#266210]" />
              <span>Waste Hotspot Intelligence Mapping</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#15370d] tracking-tight">
              Peta Hotspot Sampah Pulau Madura
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#52604d] max-w-2xl leading-relaxed">
              Pantau persebaran titik timbulan sampah di seluruh desa, kecamatan,
              dan kabupaten di Madura secara real-time dengan analisis keparahan dan rekomendasi tindakan AI.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={fetchHotspots}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#d1d8cd] bg-white hover:bg-[#edf1eb] text-xs font-semibold text-[#15370d] shadow-sm transition-colors"
              title="Perbarui data hotspot"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading ? "animate-spin text-[#266210]" : "")} />
              <span className="hidden sm:inline">Segarkan</span>
            </button>

            <Link
              href="/lapor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#266210] hover:bg-[#347f18] text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Laporkan Sampah</span>
            </Link>
          </div>
        </div>

        {/* ─── Summary Stats Strip ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#52604d] mb-1 font-medium">
              <span>Total Titik Terpetakan</span>
              <MapPin className="h-4 w-4 text-[#266210]" />
            </div>
            <p className="text-2xl font-black text-[#15370d]">{stats.total}</p>
            <p className="text-[11px] text-[#52604d] mt-0.5">
              {activeRegion ? `Di area ${activeRegion.name}` : "Di seluruh 4 Kabupaten Madura"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm">
            <div className="flex items-center justify-between text-xs text-red-700 mb-1 font-semibold">
              <span>Hotspot Kritis</span>
              <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-red-700">{stats.criticalCount}</p>
            <p className="text-[11px] text-[#52604d] mt-0.5">
              Butuh penanganan darurat dinas
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm">
            <div className="flex items-center justify-between text-xs text-orange-700 mb-1 font-semibold">
              <span>Keparahan Tinggi</span>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-black text-orange-600">{stats.highCount}</p>
            <p className="text-[11px] text-[#52604d] mt-0.5">
              Tumpukan volume besar di publik
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e2e7df] shadow-sm">
            <div className="flex items-center justify-between text-xs text-emerald-800 mb-1 font-semibold">
              <span>Selesai Dibersihkan</span>
              <CheckCircle2 className="h-4 w-4 text-[#266210]" />
            </div>
            <p className="text-2xl font-black text-[#266210]">{stats.resolvedCount}</p>
            <p className="text-[11px] text-[#52604d] mt-0.5">
              Tindakan TPS3R / DLH tuntas
            </p>
          </div>
        </div>

        {/* ─── Search & Region Hierarchical Filter Bar ─── */}
        <div className="rounded-2xl border border-[#e2e7df] bg-white p-4 shadow-sm space-y-4">
          <RegionSearchBar
            onSelectRegion={handleSelectRegion}
            activeRegion={activeRegion}
            totalHotspotsInView={filteredHotspots.length}
          />

          {/* Quick Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#edf1eb]">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[#15370d] flex items-center gap-1.5 mr-1">
                <Filter className="h-3.5 w-3.5 text-[#266210]" />
                Filter:
              </span>

              {/* Severity Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="rounded-lg border border-[#d1d8cd] bg-[#f5f7f4] px-2.5 py-1.5 text-xs font-semibold text-[#141b12] focus:border-[#266210] outline-none"
              >
                <option value="all">Semua Keparahan</option>
                <option value="critical">Kritis (Darurat)</option>
                <option value="high">Tinggi</option>
                <option value="medium">Sedang</option>
                <option value="low">Rendah</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-[#d1d8cd] bg-[#f5f7f4] px-2.5 py-1.5 text-xs font-semibold text-[#141b12] focus:border-[#266210] outline-none"
              >
                <option value="all">Semua Jenis Sampah</option>
                {WASTE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-[#d1d8cd] bg-[#f5f7f4] px-2.5 py-1.5 text-xs font-semibold text-[#141b12] focus:border-[#266210] outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="reported">Dilaporkan</option>
                <option value="verified">Terverifikasi</option>
                <option value="in_progress">Sedang Ditangani</option>
                <option value="resolved">Selesai</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#edf1eb] p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
                  viewMode === "split"
                    ? "bg-[#266210] text-white shadow-sm"
                    : "text-[#52604d] hover:text-[#15370d]"
                )}
                title="Tampilan Split: Peta & Daftar"
              >
                <Compass className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Peta &amp; List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
                  viewMode === "map"
                    ? "bg-[#266210] text-white shadow-sm"
                    : "text-[#52604d] hover:text-[#15370d]"
                )}
                title="Tampilan Peta Penuh"
              >
                <MapIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Hanya Peta</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
                  viewMode === "list"
                    ? "bg-[#266210] text-white shadow-sm"
                    : "text-[#52604d] hover:text-[#15370d]"
                )}
                title="Tampilan Daftar Kartu"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Hanya List</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Main Content Area: Map & List ─── */}
        <div className="space-y-6">
          {viewMode === "split" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Map (7 cols) */}
              <div className="lg:col-span-7 h-[560px] min-h-[520px] w-full sticky top-24">
                <BaliHotspotMap
                  hotspots={filteredHotspots}
                  selectedHotspot={selectedHotspot}
                  onSelectHotspot={(point) => setSelectedHotspot(point)}
                  flyToTarget={flyToTarget}
                />
              </div>

              {/* Reports List (5 cols) */}
              <div className="lg:col-span-5 space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <p className="font-bold text-[#15370d]">
                    Daftar Titik Hotspot ({filteredHotspots.length})
                  </p>
                  <span className="text-[11px] text-[#52604d]">
                    Klik kartu untuk memfokuskan peta
                  </span>
                </div>

                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {filteredHotspots.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-[#e2e7df] text-xs text-[#52604d] space-y-2">
                      <MapPin className="h-8 w-8 mx-auto text-[#9ca896]" />
                      <p className="font-bold text-[#15370d]">
                        Tidak ada titik hotspot di filter ini
                      </p>
                      <p>Coba reset filter atau pilih daerah lain di Pulau Bali.</p>
                    </div>
                  ) : (
                    filteredHotspots.map((point) => {
                      const sev = SEVERITY_COLORS[point.severity] || SEVERITY_COLORS.low;
                      const isSelected = selectedHotspot?.id === point.id;

                      return (
                        <div
                          key={point.id}
                          onClick={() => {
                            setSelectedHotspot(point);
                            setFlyToTarget({
                              lat: point.latitude,
                              lng: point.longitude,
                              zoom: 15,
                              timestamp: Date.now(),
                            });
                          }}
                          className={cn(
                            "group p-3.5 rounded-xl border bg-white cursor-pointer transition-all hover:shadow-md",
                            isSelected
                              ? "border-[#266210] ring-2 ring-[#266210]/20 shadow-md bg-[#edf1eb]/30"
                              : "border-[#e2e7df] hover:border-[#266210]"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {point.imageUrl ? (
                              <img
                                src={point.imageUrl}
                                alt={point.title}
                                className="h-16 w-16 rounded-lg object-cover flex-shrink-0 bg-[#edf1eb]"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-[#edf1eb] flex items-center justify-center text-[#9ca896] flex-shrink-0">
                                <Layers className="h-6 w-6" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                    sev.badge
                                  )}
                                >
                                  {SEVERITY_LABELS[point.severity] || point.severity}
                                </span>
                                <span className="text-[10px] font-medium text-[#52604d]">
                                  {point.aiWasteType ? point.aiWasteType.replace("anorganik_", "") : "Sampah"}
                                </span>
                              </div>

                              <p className="text-xs font-bold text-[#15370d] group-hover:text-[#266210] transition-colors line-clamp-1">
                                {point.title}
                              </p>
                              <p className="text-[11px] text-[#52604d] line-clamp-1 mt-0.5 flex items-center gap-1">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                {point.address || "Pulau Bali"}
                              </p>
                            </div>

                            <ChevronRight className="h-4 w-4 text-[#9ca896] group-hover:text-[#266210] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-2" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {viewMode === "map" && (
            <div className="h-[620px] w-full">
              <BaliHotspotMap
                hotspots={filteredHotspots}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={(point) => setSelectedHotspot(point)}
                flyToTarget={flyToTarget}
              />
            </div>
          )}

          {viewMode === "list" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHotspots.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-[#e2e7df] text-xs text-[#52604d] space-y-2">
                  <MapPin className="h-10 w-10 mx-auto text-[#9ca896]" />
                  <p className="font-bold text-[#15370d] text-sm">
                    Tidak ada titik hotspot yang cocok
                  </p>
                  <p>Silakan sesuaikan filter wilayah atau kategori sampah.</p>
                </div>
              ) : (
                filteredHotspots.map((point) => {
                  const sev = SEVERITY_COLORS[point.severity] || SEVERITY_COLORS.low;
                  return (
                    <div
                      key={point.id}
                      onClick={() => setSelectedHotspot(point)}
                      className="group rounded-2xl border border-[#e2e7df] bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-[#266210] transition-all cursor-pointer flex flex-col"
                    >
                      <div className="relative h-44 w-full bg-[#edf1eb] overflow-hidden">
                        {point.imageUrl && (
                          <img
                            src={point.imageUrl}
                            alt={point.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-sm",
                              sev.badge
                            )}
                          >
                            {SEVERITY_LABELS[point.severity] || point.severity}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#15370d] group-hover:text-[#266210] transition-colors line-clamp-1">
                            {point.title}
                          </p>
                          <p className="text-xs text-[#52604d] mt-1 line-clamp-2 leading-relaxed">
                            {point.description || point.address}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-[#edf1eb] flex items-center justify-between text-xs">
                          <span className="text-[#52604d] text-[11px] flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#266210]" />
                            {point.kabupaten || "Bali"}
                          </span>
                          <span className="font-bold text-[#266210] inline-flex items-center gap-1">
                            Detail AI →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Detail Modal ─── */}
      <HotspotDetailModal
        hotspot={selectedHotspot}
        onClose={() => setSelectedHotspot(null)}
      />
    </div>
  );
}

