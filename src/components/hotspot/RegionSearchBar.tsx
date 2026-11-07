// src/components/hotspot/RegionSearchBar.tsx
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  X,
  ChevronDown,
  Building,
  Compass,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  BALI_KABUPATEN,
  BALI_KECAMATAN,
  BALI_DESA,
  BaliRegionItem,
  searchBaliRegions,
  RegionLevel,
} from "@/constants/bali-regions";
import { cn } from "@/lib/utils";

interface RegionSearchBarProps {
  onSelectRegion: (region: BaliRegionItem | null) => void;
  activeRegion: BaliRegionItem | null;
  totalHotspotsInView: number;
}

export default function RegionSearchBar({
  onSelectRegion,
  activeRegion,
  totalHotspotsInView,
}: RegionSearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<BaliRegionItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showCascading, setShowCascading] = useState(false);

  // Cascading selections
  const [selectedKab, setSelectedKab] = useState<string>("");
  const [selectedKec, setSelectedKec] = useState<string>("");
  const [selectedDesa, setSelectedDesa] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter autocomplete suggestions saat query diketik
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const results = searchBaliRegions(query);
    setSuggestions(results);
  }, [query]);

  // Handle klik di luar autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter daftar kecamatan sesuai kabupaten yang dipilih
  const availableKecamatan = useMemo(() => {
    if (!selectedKab) return BALI_KECAMATAN;
    return BALI_KECAMATAN.filter((k) => k.kabupaten === selectedKab);
  }, [selectedKab]);

  // Filter daftar desa sesuai kecamatan yang dipilih
  const availableDesa = useMemo(() => {
    if (!selectedKec) {
      if (!selectedKab) return BALI_DESA;
      return BALI_DESA.filter((d) => d.kabupaten === selectedKab);
    }
    return BALI_DESA.filter((d) => d.kecamatan === selectedKec);
  }, [selectedKab, selectedKec]);

  // Trigger pemilihan daerah dari autocomplete atau cascading
  const handleSelect = (item: BaliRegionItem) => {
    onSelectRegion(item);
    setQuery(item.name);
    setIsFocused(false);
    setShowCascading(false);
  };

  const handleReset = () => {
    onSelectRegion(null);
    setQuery("");
    setSelectedKab("");
    setSelectedKec("");
    setSelectedDesa("");
    setSuggestions([]);
  };

  const handleApplyCascading = () => {
    if (selectedDesa) {
      const desaObj = BALI_DESA.find((d) => d.name === selectedDesa);
      if (desaObj) {
        handleSelect(desaObj);
        return;
      }
    }
    if (selectedKec) {
      const kecObj = BALI_KECAMATAN.find((k) => k.name === selectedKec);
      if (kecObj) {
        handleSelect(kecObj);
        return;
      }
    }
    if (selectedKab) {
      const kabObj = BALI_KABUPATEN.find((k) => k.name === selectedKab);
      if (kabObj) {
        handleSelect(kabObj);
        return;
      }
    }
  };

  const getLevelBadge = (type: RegionLevel) => {
    switch (type) {
      case "kabupaten":
        return { label: "Kabupaten / Kota", bg: "bg-emerald-100 text-emerald-800" };
      case "kecamatan":
        return { label: "Kecamatan", bg: "bg-blue-100 text-blue-800" };
      case "desa":
        return { label: "Desa / Kelurahan", bg: "bg-amber-100 text-amber-800" };
    }
  };

  return (
    <div className="space-y-3">
      {/* ── Main Search Bar ── */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#52604d]">
            <Search className="h-4 w-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Cari daerah di Bali (contoh: Desa Canggu, Sanur, Kec. Ubud, Kab. Badung...)"
            className="w-full pl-10 pr-28 py-3 rounded-xl border border-[#d1d8cd] bg-white text-xs sm:text-sm text-[#141b12] placeholder:text-[#9ca896] focus:border-[#266210] focus:ring-2 focus:ring-[#266210]/20 outline-none transition-all shadow-sm"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
                className="p-1.5 text-[#52604d] hover:text-[#15370d] rounded-lg transition-colors"
                title="Hapus pencarian"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowCascading(!showCascading)}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                showCascading
                  ? "bg-[#266210] text-white border-[#266210]"
                  : "bg-[#edf1eb] text-[#15370d] border-[#d1d8cd] hover:bg-[#dce3d8]"
              )}
              title="Filter bertingkat: Kabupaten / Kecamatan / Desa"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tingkat Daerah</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform",
                  showCascading ? "rotate-180" : ""
                )}
              />
            </button>
          </div>
        </div>

        {/* ── Autocomplete Dropdown ── */}
        {isFocused && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-[#d1d8cd] shadow-xl overflow-hidden z-40 max-h-80 overflow-y-auto animate-in fade-in duration-150"
          >
            <div className="p-2 border-b border-[#edf1eb] text-[11px] font-semibold text-[#52604d] flex items-center justify-between">
              <span>Hasil Pencarian Wilayah Bali ({suggestions.length})</span>
              <span className="text-[10px] text-[#9ca896]">Klik untuk menuju lokasi</span>
            </div>
            <div className="divide-y divide-[#edf1eb]">
              {suggestions.map((item) => {
                const badge = getLevelBadge(item.type);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full text-left p-3 hover:bg-[#edf1eb] transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5 p-1 rounded-md bg-[#f5f7f4] text-[#266210] group-hover:bg-[#266210] group-hover:text-white transition-colors">
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#15370d] group-hover:text-[#266210] truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#52604d] truncate">
                          {item.type === "desa" && `${item.kecamatan}, `}
                          {item.kabupaten}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0",
                        badge.bg
                      )}
                    >
                      {badge.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Cascading Dropdown: Kabupaten → Kecamatan → Desa ── */}
      {showCascading && (
        <div className="p-4 rounded-xl border border-[#d1d8cd] bg-white shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#15370d] flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-[#266210]" />
              <span>Navigasi Berjenjang: Kabupaten &gt; Kecamatan &gt; Desa</span>
            </p>
            <button
              type="button"
              onClick={() => setShowCascading(false)}
              className="text-[11px] text-[#52604d] hover:underline"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* 1. Pilih Kabupaten */}
            <div>
              <label className="block text-[11px] font-semibold text-[#52604d] mb-1">
                1. Kabupaten / Kota
              </label>
              <select
                value={selectedKab}
                onChange={(e) => {
                  setSelectedKab(e.target.value);
                  setSelectedKec("");
                  setSelectedDesa("");
                }}
                className="w-full rounded-lg border border-[#d1d8cd] bg-[#f5f7f4] px-2.5 py-2 text-xs font-medium text-[#141b12] focus:border-[#266210] outline-none"
              >
                <option value="">-- Pilih Kabupaten / Kota --</option>
                {BALI_KABUPATEN.map((kab) => (
                  <option key={kab.id} value={kab.name}>
                    {kab.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Pilih Kecamatan */}
            <div>
              <label className="block text-[11px] font-semibold text-[#52604d] mb-1">
                2. Kecamatan
              </label>
              <select
                value={selectedKec}
                onChange={(e) => {
                  setSelectedKec(e.target.value);
                  setSelectedDesa("");
                }}
                disabled={!selectedKab && availableKecamatan.length === 0}
                className="w-full rounded-lg border border-[#d1d8cd] bg-[#f5f7f4] px-2.5 py-2 text-xs font-medium text-[#141b12] focus:border-[#266210] outline-none disabled:opacity-50"
              >
                <option value="">-- Semua Kecamatan --</option>
                {availableKecamatan.map((kec) => (
                  <option key={kec.id} value={kec.name}>
                    {kec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Pilih Desa / Kelurahan */}
            <div>
              <label className="block text-[11px] font-semibold text-[#52604d] mb-1">
                3. Desa / Kelurahan
              </label>
              <select
                value={selectedDesa}
                onChange={(e) => setSelectedDesa(e.target.value)}
                disabled={availableDesa.length === 0}
                className="w-full rounded-lg border border-[#d1d8cd] bg-[#f5f7f4] px-2.5 py-2 text-xs font-medium text-[#141b12] focus:border-[#266210] outline-none disabled:opacity-50"
              >
                <option value="">-- Semua Desa / Kelurahan --</option>
                {availableDesa.map((desa) => (
                  <option key={desa.id} value={desa.name}>
                    {desa.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#edf1eb]">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-[#d1d8cd] text-xs font-medium text-[#52604d] hover:bg-[#edf1eb] transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApplyCascading}
              disabled={!selectedKab && !selectedKec && !selectedDesa}
              className="px-4 py-1.5 rounded-lg bg-[#266210] hover:bg-[#347f18] text-white text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm"
            >
              Tuju ke Daerah Terpilih →
            </button>
          </div>
        </div>
      )}

      {/* ── Active Selection Feedback Bar ── */}
      {activeRegion && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#edf1eb] border border-[#d1d8cd] text-xs text-[#15370d] animate-in fade-in duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-6 w-6 rounded-full bg-[#266210] text-white items-center justify-center flex-shrink-0">
              <Check className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="font-bold truncate">
                Sedang Memantau: {activeRegion.name}
              </p>
              <p className="text-[11px] text-[#52604d] truncate">
                {activeRegion.type === "desa" && `${activeRegion.kecamatan}, `}
                {activeRegion.kabupaten} — {totalHotspotsInView} Titik Hotspot
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#d1d8cd] text-[11px] font-semibold text-[#52604d] hover:text-[#15370d] hover:bg-[#f5f7f4] transition-colors flex-shrink-0"
            title="Kembali ke tampilan seluruh Pulau Bali"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Seluruh Bali</span>
          </button>
        </div>
      )}

      {/* ── Quick Regencies Pills (9 Kabupaten) ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          type="button"
          onClick={handleReset}
          className={cn(
            "px-3 py-1.5 rounded-lg font-semibold flex-shrink-0 transition-colors",
            !activeRegion
              ? "bg-[#266210] text-white shadow-sm"
              : "bg-white border border-[#d1d8cd] text-[#52604d] hover:bg-[#edf1eb]"
          )}
        >
          Semua Bali
        </button>
        {BALI_KABUPATEN.map((kab) => {
          const isActive = activeRegion?.id === kab.id || activeRegion?.kabupaten === kab.name;
          return (
            <button
              key={kab.id}
              type="button"
              onClick={() => handleSelect(kab)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium flex-shrink-0 border transition-colors",
                isActive
                  ? "bg-[#266210] text-white border-[#266210] shadow-sm font-semibold"
                  : "bg-white border-[#d1d8cd] text-[#52604d] hover:border-[#266210] hover:text-[#15370d]"
              )}
            >
              {kab.name.replace("Kabupaten ", "")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
