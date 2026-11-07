// src/components/maps/BaliHotspotMap.tsx
"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { BALI_BOUNDS, BALI_CENTER } from "@/lib/geo";
import { HotspotPoint } from "@/types";

interface FlyToTarget {
  lat: number;
  lng: number;
  zoom: number;
  timestamp: number;
}

interface BaliHotspotMapProps {
  hotspots: HotspotPoint[];
  selectedHotspot: HotspotPoint | null;
  onSelectHotspot: (hotspot: HotspotPoint) => void;
  flyToTarget?: FlyToTarget | null;
}

const SEVERITY_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  critical: { bg: "#dc2626", border: "#991b1b", glow: "rgba(220, 38, 38, 0.45)" },
  high: { bg: "#ea580c", border: "#c2410c", glow: "rgba(234, 88, 12, 0.4)" },
  medium: { bg: "#d97706", border: "#b45309", glow: "rgba(217, 119, 6, 0.35)" },
  low: { bg: "#16a34a", border: "#15803d", glow: "rgba(22, 163, 74, 0.3)" },
};

const SEVERITY_LABELS: Record<string, string> = {
  critical: "Kritis",
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

export default function BaliHotspotMap({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  flyToTarget,
}: BaliHotspotMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markerMapRef = useRef<Map<string, any>>(new Map());

  // Buat custom SVG pin icon untuk tiap titik sampah
  const createHotspotIcon = (L: any, point: HotspotPoint, isSelected: boolean) => {
    const color = SEVERITY_COLORS[point.severity] || SEVERITY_COLORS.low;
    const isCritical = point.severity === "critical";

    const pulseHtml = isCritical
      ? `<div style="
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: ${color.glow};
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          pointer-events: none;
        "></div>`
      : "";

    const pinSize = isSelected ? 42 : isCritical ? 38 : 34;

    const html = `
      <div style="
        position: relative;
        width: ${pinSize}px;
        height: ${pinSize}px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        ${pulseHtml}
        <div style="
          position: relative;
          width: ${pinSize}px;
          height: ${pinSize}px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          background: ${color.bg};
          border: 3px solid #ffffff;
          box-shadow: 0 4px 12px ${color.glow}, 0 2px 4px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ffffff;
            transform: rotate(45deg);
          "></div>
        </div>
      </div>
    `;

    return L.divIcon({
      className: "custom-hotspot-pin",
      html,
      iconSize: [pinSize, pinSize],
      iconAnchor: [pinSize / 2, pinSize],
      popupAnchor: [0, -pinSize],
    });
  };

  // Inisialisasi Peta Leaflet secara dinamis (Hanya di Client)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isCancelled = false;

    import("leaflet").then((leafletModule) => {
      if (isCancelled || !mapContainerRef.current) return;
      const L = (leafletModule as any).default || leafletModule;
      leafletRef.current = L;

      if (mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: BALI_CENTER,
        zoom: 10,
        minZoom: 9.5,
        maxZoom: 18,
        maxBounds: BALI_BOUNDS,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
      });

      // Tambahkan zoom control di kanan atas
      L.control.zoom({ position: "topright" }).addTo(map);

      // Tile Layer CartoDB Voyager / OSM yang jernih dan ramah warna hijau
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Layer grup untuk seluruh marker
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapRef.current = map;

      // Render awal marker
      renderMarkers(L, map, markersLayer, hotspots);
    });

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Fungsi Render Ulang Marker saat hotspots berubah
  const renderMarkers = (L: any, map: any, layer: any, points: HotspotPoint[]) => {
    layer.clearLayers();
    markerMapRef.current.clear();

    points.forEach((point) => {
      const isSelected = selectedHotspot?.id === point.id;
      const icon = createHotspotIcon(L, point, isSelected);

      const marker = L.marker([point.latitude, point.longitude], {
        icon,
        title: point.title,
      });

      const color = SEVERITY_COLORS[point.severity] || SEVERITY_COLORS.low;
      const severityLabel = SEVERITY_LABELS[point.severity] || point.severity;

      // Popup mini interaktif
      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; max-width: 230px; padding: 4px 2px;">
          <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px;">
            <span style="
              background: ${color.bg};
              color: #ffffff;
              font-size: 10px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 9999px;
              text-transform: uppercase;
            ">${severityLabel}</span>
            <span style="font-size: 11px; color: #52604d; font-weight: 500;">
              ${point.aiWasteType ? point.aiWasteType.replace("anorganik_", "") : "Sampah"}
            </span>
          </div>
          <p style="font-weight: 700; color: #15370d; font-size: 13px; line-height: 1.3; margin: 0 0 6px 0;">
            ${point.title}
          </p>
          <p style="font-size: 11px; color: #52604d; margin: 0 0 8px 0; line-height: 1.3;">
            ${point.address || "Pulau Bali"}
          </p>
          <button id="btn-detail-${point.id}" style="
            width: 100%;
            background: #266210;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
          ">
            Lihat Rekomendasi AI →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260, className: "bali-popup" });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`btn-detail-${point.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectHotspot(point);
          };
        }
      });

      marker.on("click", () => {
        onSelectHotspot(point);
      });

      marker.addTo(layer);
      markerMapRef.current.set(point.id, marker);
    });
  };

  // Update marker saat daftar hotspots berubah
  useEffect(() => {
    if (!leafletRef.current || !mapRef.current || !markersLayerRef.current) return;
    renderMarkers(leafletRef.current, mapRef.current, markersLayerRef.current, hotspots);
  }, [hotspots]);

  // Sorot marker yang dipilih
  useEffect(() => {
    if (!leafletRef.current || !mapRef.current || !selectedHotspot) return;

    const marker = markerMapRef.current.get(selectedHotspot.id);
    if (marker) {
      marker.openPopup();
      mapRef.current.flyTo([selectedHotspot.latitude, selectedHotspot.longitude], Math.max(mapRef.current.getZoom(), 14), {
        duration: 1.0,
      });
    }
  }, [selectedHotspot]);

  // Terbang ke koordinat wilayah yang dicari (Desa / Kecamatan / Kabupaten)
  useEffect(() => {
    if (!mapRef.current || !flyToTarget) return;

    mapRef.current.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom, {
      duration: 1.2,
    });
  }, [flyToTarget]);

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden border border-[#d1d8cd] shadow-md bg-[#edf1eb]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px] z-0" />

      {/* Floating Legend Badge di Kiri Bawah */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-[#e2e7df] shadow-md text-xs space-y-1.5 hidden sm:block">
        <p className="font-bold text-[#15370d] text-[11px] uppercase tracking-wider">
          Tingkat Keparahan Hotspot
        </p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-medium text-red-700">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
            Kritis
          </span>
          <span className="flex items-center gap-1.5 font-medium text-orange-700">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Tinggi
          </span>
          <span className="flex items-center gap-1.5 font-medium text-amber-700">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Sedang
          </span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            Rendah
          </span>
        </div>
      </div>
    </div>
  );
}
