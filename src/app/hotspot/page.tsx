// src/app/hotspot/page.tsx
"use client";

import { useEffect, useState } from "react";
import { MapPin, AlertTriangle, Layers, Filter, RefreshCw, ExternalLink } from "lucide-react";
import { HotspotPoint } from "@/types";
import { BALI_REGIONS } from "@/constants";

export default function HotspotPage() {
  const [hotspots, setHotspots] = useState<HotspotPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const fetchHotspots = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hotspot");
      const json = await res.json();
      if (res.ok && json.success) {
        setHotspots(json.data);
      }
    } catch (err) {
      console.error("Gagal mengambil data hotspot:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotspots();
  }, []);

  const filteredHotspots = hotspots.filter((h) => {
    if (selectedSeverity !== "all" && h.severity !== selectedSeverity) return false;
    if (selectedRegion !== "all" && !h.address?.includes(selectedRegion)) return false;
    return true;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">Kritis</span>;
      case "high":
        return <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">Tinggi</span>;
      case "medium":
        return <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-800">Sedang</span>;
      default:
        return <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">Rendah</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] pt-28 sm:pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf2e8] px-3.5 py-1 text-xs font-semibold text-[#15370d] border border-[#d6e4d2] mb-3">
              <MapPin className="h-3.5 w-3.5 text-[#266210]" />
              Fitur Inti 2: Waste Hotspot Mapping
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#15370d] tracking-tight">
              Peta Persebaran Hotspot Sampah Bali
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#52604d] max-w-2xl">
              Visualisasi titik-titik timbulan sampah liar yang dilaporkan masyarakat dan dianalisis
              oleh AI di seluruh 9 kabupaten/kota se-Pulau Dewata.
            </p>
          </div>

          <button
            onClick={fetchHotspots}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-[#d6e4d2] bg-white px-4 py-2.5 text-sm font-semibold text-[#15370d] hover:bg-gray-50 transition-colors shadow-sm self-start md:self-auto"
          >
            <RefreshCw className={`h-4 w-4 text-[#266210] ${loading ? "animate-spin" : ""}`} />
            Perbarui Data
          </button>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl border border-[#e2e7df] bg-white p-4 sm:p-5 mb-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#15370d]">
              <Filter className="h-4 w-4 text-[#266210]" />
              Filter:
            </div>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="rounded-lg border border-[#e2e7df] bg-[#f5f7f4] px-3 py-1.5 text-xs font-semibold text-[#141b12] focus:outline-none focus:ring-1 focus:ring-[#266210]"
            >
              <option value="all">Semua Tingkat Keparahan</option>
              <option value="critical">Kritis (Critical)</option>
              <option value="high">Tinggi (High)</option>
              <option value="medium">Sedang (Medium)</option>
              <option value="low">Rendah (Low)</option>
            </select>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="rounded-lg border border-[#e2e7df] bg-[#f5f7f4] px-3 py-1.5 text-xs font-semibold text-[#141b12] focus:outline-none focus:ring-1 focus:ring-[#266210]"
            >
              <option value="all">Semua Kabupaten/Kota</option>
              {BALI_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-[#52604d]">
            Menampilkan <strong>{filteredHotspots.length}</strong> titik timbulan
          </div>
        </div>

        {/* Hotspots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotspots.length === 0 ? (
            <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-[#d6e4d2] bg-white p-8">
              <MapPin className="mx-auto h-12 w-12 text-[#52604d]/40 mb-3" />
              <h3 className="text-base font-bold text-[#15370d]">Tidak ada data hotspot ditemukan</h3>
              <p className="mt-1 text-xs text-[#52604d]">
                Coba sesuaikan filter pencarian atau buat laporan sampah baru.
              </p>
            </div>
          ) : (
            filteredHotspots.map((point) => (
              <div
                key={point.id}
                className="overflow-hidden rounded-2xl border border-[#e2e7df] bg-white shadow-sm hover:border-[#266210] transition-colors flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={point.imageUrl}
                    alt={point.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">{getSeverityBadge(point.severity)}</div>
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
                      {point.aiWasteType?.replace("_", " ").toUpperCase() || "TERIDENTIFIKASI"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#15370d] text-base line-clamp-2">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#52604d] flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#266210] shrink-0" />
                      <span className="line-clamp-1">{point.address || "Wilayah Bali"}</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e2e7df] flex items-center justify-between text-[11px] text-[#52604d]">
                    <span>Status: <strong className="text-[#15370d] uppercase">{point.status}</strong></span>
                    <span>
                      {new Date(point.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
