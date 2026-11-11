// src/components/maps/BaliHotspotMap.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import { BALI_BOUNDS, BALI_CENTER } from "@/lib/geo";
import { HotspotPoint } from "@/types";
import { Flame, Layers, MapPin, Eye, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

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

type ConcentrationLevel = "critical" | "high" | "medium" | "low";

interface ClusterNode {
  id: string;
  lat: number;
  lng: number;
  points: HotspotPoint[];
  concentration: ConcentrationLevel;
}

const CONCENTRATION_CONFIG: Record<
  ConcentrationLevel,
  {
    label: string;
    bg: string;
    border: string;
    text: string;
    glow: string;
    pulseClass?: string;
  }
> = {
  critical: {
    label: "Konsentrasi Sangat Tinggi",
    bg: "#dc2626", // Merah
    border: "#ffffff",
    text: "#ffffff",
    glow: "rgba(220, 38, 38, 0.55)",
    pulseClass: "animate-ping",
  },
  high: {
    label: "Konsentrasi Tinggi",
    bg: "#ea580c", // Oranye
    border: "#ffffff",
    text: "#ffffff",
    glow: "rgba(234, 88, 12, 0.45)",
  },
  medium: {
    label: "Konsentrasi Sedang",
    bg: "#eab308", // Kuning
    border: "#ffffff",
    text: "#141b12",
    glow: "rgba(234, 179, 8, 0.4)",
  },
  low: {
    label: "Konsentrasi Rendah",
    bg: "#16a34a", // Hijau
    border: "#ffffff",
    text: "#ffffff",
    glow: "rgba(22, 163, 74, 0.35)",
  },
};

export default function BaliHotspotMap({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  flyToTarget,
}: BaliHotspotMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  // Layer Groups
  const heatmapLayerRef = useRef<any>(null);
  const clusterLayerRef = useRef<any>(null);

  // Active visualization mode
  const [visMode, setVisMode] = useState<"combo" | "heatmap" | "cluster">("combo");

  // REFS untuk mencegah stale closure saat zoom/pan peta
  const hotspotsRef = useRef<HotspotPoint[]>(hotspots);
  const visModeRef = useRef<"combo" | "heatmap" | "cluster">(visMode);

  useEffect(() => {
    hotspotsRef.current = hotspots;
  }, [hotspots]);

  useEffect(() => {
    visModeRef.current = visMode;
  }, [visMode]);

  // Algoritma Geo-Clustering berbasis koordinat matematis dan proyeksi piksel
  const computeClusters = useCallback(
    (L: any, map: any, points: HotspotPoint[]): ClusterNode[] => {
      if (!map || !L || points.length === 0) return [];

      const currentZoom = map.getZoom();
      // Radius pengelompokan yang cerdas: saat zoom in ke tingkat jalan/desa, biarkan pin terurai
      const pixelRadius =
        currentZoom >= 16 ? 25 : currentZoom >= 14 ? 35 : currentZoom >= 12 ? 45 : 55;

      const clusters: ClusterNode[] = [];
      const assigned = new Set<string>();

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        if (assigned.has(p1.id)) continue;

        let p1Pixel: any;
        try {
          p1Pixel = map.project(L.latLng(p1.latitude, p1.longitude), currentZoom);
        } catch {
          continue;
        }

        const clusterPoints: HotspotPoint[] = [p1];
        assigned.add(p1.id);

        let sumLat = p1.latitude;
        let sumLng = p1.longitude;

        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          if (assigned.has(p2.id)) continue;

          let p2Pixel: any;
          try {
            p2Pixel = map.project(L.latLng(p2.latitude, p2.longitude), currentZoom);
          } catch {
            continue;
          }

          const dist = p1Pixel.distanceTo(p2Pixel);

          if (dist <= pixelRadius) {
            clusterPoints.push(p2);
            assigned.add(p2.id);
            sumLat += p2.latitude;
            sumLng += p2.longitude;
          }
        }

        // Tentukan tingkat konsentrasi gradasi warna:
        // - Merah: konsentrasi sangat tinggi (>= 4 titik atau ada titik kritis)
        // - Oranye: konsentrasi tinggi (>= 3 titik atau ada titik tingkat tinggi)
        // - Kuning: konsentrasi sedang (2 titik atau tingkat sedang)
        // - Hijau: konsentrasi rendah (1 titik atau tingkat rendah)
        const count = clusterPoints.length;
        const hasCritical = clusterPoints.some((p) => p.severity === "critical");
        const hasHigh = clusterPoints.some((p) => p.severity === "high");
        const hasMedium = clusterPoints.some((p) => p.severity === "medium");

        let concentration: ConcentrationLevel = "low";
        if (count >= 4 || hasCritical) {
          concentration = "critical"; // Merah: konsentrasi sangat tinggi
        } else if (count >= 3 || hasHigh) {
          concentration = "high"; // Oranye: konsentrasi tinggi
        } else if (count >= 2 || hasMedium) {
          concentration = "medium"; // Kuning: konsentrasi sedang
        } else {
          concentration = "low"; // Hijau: konsentrasi rendah
        }

        clusters.push({
          id: `cluster-${i}-${count}`,
          lat: sumLat / count,
          lng: sumLng / count,
          points: clusterPoints,
          concentration,
        });
      }

      return clusters;
    },
    []
  );

  // Render Lapisan Geospatial Heatmap + Marker Clustering
  const updateMapLayers = useCallback(
    (
      L: any,
      map: any,
      points: HotspotPoint[],
      mode: "combo" | "heatmap" | "cluster"
    ) => {
      if (!map || !L || !heatmapLayerRef.current || !clusterLayerRef.current) return;

      const heatmapLayer = heatmapLayerRef.current;
      const clusterLayer = clusterLayerRef.current;

      heatmapLayer.clearLayers();
      clusterLayer.clearLayers();

      if (!points || points.length === 0) return;

      const currentZoom = map.getZoom();

      // ─── 1. LAPISAN GEOSPATIAL HEATMAP ───
      // Menggambar aura gradasi panas densitas sampah yang konsisten di setiap level zoom
      if (mode === "combo" || mode === "heatmap") {
        let radiusMeter = 4500;
        if (currentZoom >= 16) {
          radiusMeter = 450;
        } else if (currentZoom >= 14) {
          radiusMeter = 900;
        } else if (currentZoom >= 12) {
          radiusMeter = 2000;
        } else if (currentZoom >= 11) {
          radiusMeter = 3200;
        }

        points.forEach((p) => {
          let multiplier = 1.0;
          let coreColor = "#16a34a"; // Hijau
          let midColor = "#eab308"; // Kuning
          let outerColor = "#22c55e"; // Hijau luar

          if (p.severity === "critical") {
            multiplier = 1.6;
            coreColor = "#dc2626"; // Merah
            midColor = "#ea580c"; // Oranye
            outerColor = "#eab308"; // Kuning
          } else if (p.severity === "high") {
            multiplier = 1.3;
            coreColor = "#ea580c"; // Oranye
            midColor = "#eab308"; // Kuning
            outerColor = "#16a34a"; // Hijau
          } else if (p.severity === "medium") {
            multiplier = 1.0;
            coreColor = "#eab308"; // Kuning
            midColor = "#84cc16";
            outerColor = "#22c55e";
          } else {
            multiplier = 0.8;
            coreColor = "#16a34a"; // Hijau
            midColor = "#22c55e";
            outerColor = "#86efac";
          }

          const r = radiusMeter * multiplier;

          // Lingkaran Luar (Aura persebaran gradasi)
          L.circle([p.latitude, p.longitude], {
            radius: r,
            color: "transparent",
            fillColor: outerColor,
            fillOpacity: 0.18,
            interactive: false,
          }).addTo(heatmapLayer);

          // Lingkaran Tengah (Transisi densitas)
          L.circle([p.latitude, p.longitude], {
            radius: r * 0.6,
            color: "transparent",
            fillColor: midColor,
            fillOpacity: 0.32,
            interactive: false,
          }).addTo(heatmapLayer);

          // Lingkaran Inti (Pusat konsentrasi penumpukan sampah)
          L.circle([p.latitude, p.longitude], {
            radius: r * 0.3,
            color: "transparent",
            fillColor: coreColor,
            fillOpacity: 0.52,
            interactive: false,
          }).addTo(heatmapLayer);
        });
      }

      // ─── 2. LAPISAN MARKER CLUSTERING ───
      // Mengelompokkan titik sampah dan menampilkan badge gradasi konsentrasi
      if (mode === "combo" || mode === "cluster") {
        const clusters = computeClusters(L, map, points);

        clusters.forEach((cluster) => {
          const cfg = CONCENTRATION_CONFIG[cluster.concentration];
          const count = cluster.points.length;
          const isSingle = count === 1;
          const singlePoint = cluster.points[0];

          // Buat HTML Icon Marker Cluster
          const iconSize = isSingle ? 36 : count >= 5 ? 46 : 40;

          const pulseRingHtml =
            cluster.concentration === "critical"
              ? `<div style="
                  position: absolute;
                  inset: -6px;
                  border-radius: 50%;
                  background: ${cfg.glow};
                  animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
                  pointer-events: none;
                "></div>`
              : "";

          const clusterHtml = isSingle
            ? `
              <div style="
                position: relative;
                width: ${iconSize}px;
                height: ${iconSize}px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
              ">
                ${pulseRingHtml}
                <div style="
                  width: ${iconSize}px;
                  height: ${iconSize}px;
                  border-radius: 50% 50% 50% 0;
                  transform: rotate(-45deg);
                  background: ${cfg.bg};
                  border: 3px solid #ffffff;
                  box-shadow: 0 4px 10px ${cfg.glow}, 0 2px 4px rgba(0,0,0,0.25);
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
            `
            : `
              <div style="
                position: relative;
                width: ${iconSize}px;
                height: ${iconSize}px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
              ">
                ${pulseRingHtml}
                <div style="
                  width: ${iconSize}px;
                  height: ${iconSize}px;
                  border-radius: 50%;
                  background: ${cfg.bg};
                  color: ${cfg.text};
                  border: 3px solid #ffffff;
                  box-shadow: 0 4px 14px ${cfg.glow}, 0 2px 6px rgba(0,0,0,0.3);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  font-weight: 800;
                  font-size: ${count >= 10 ? "13px" : "15px"};
                  line-height: 1;
                ">
                  <span>${count}</span>
                </div>
              </div>
            `;

          const customIcon = L.divIcon({
            className: "bali-cluster-icon",
            html: clusterHtml,
            iconSize: [iconSize, iconSize],
            iconAnchor: [iconSize / 2, isSingle ? iconSize : iconSize / 2],
            popupAnchor: [0, isSingle ? -iconSize : -iconSize / 2],
          });

          const marker = L.marker([cluster.lat, cluster.lng], {
            icon: customIcon,
            title: isSingle
              ? singlePoint.title
              : `${cfg.label} (${count} titik sampah)`,
          });

          // Interaksi saat marker diklik:
          if (isSingle) {
            // Jika single point, langsung buka popup & trigger modal
            const popupHtml = `
              <div style="font-family: inherit; font-size: 12px; max-width: 230px; padding: 2px;">
                <div style="display: flex; gap: 6px; align-items: center; margin-bottom: 6px;">
                  <span style="
                    background: ${cfg.bg};
                    color: ${cfg.text};
                    font-size: 10px;
                    font-weight: 700;
                    padding: 2px 7px;
                    border-radius: 9999px;
                    text-transform: uppercase;
                  ">${cfg.label.replace("Konsentrasi ", "")}</span>
                </div>
                <p style="font-weight: 700; color: #15370d; font-size: 13px; line-height: 1.3; margin: 0 0 6px 0;">
                  ${singlePoint.title}
                </p>
                <p style="font-size: 11px; color: #52604d; margin: 0 0 8px 0; line-height: 1.3;">
                  ${singlePoint.address || "Pulau Madura"}
                </p>
                <button id="btn-popup-${singlePoint.id}" style="
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
                  Lihat Detail Rekomendasi AI →
                </button>
              </div>
            `;

            marker.bindPopup(popupHtml, { maxWidth: 260, className: "bali-popup" });
            marker.on("popupopen", () => {
              const btn = document.getElementById(`btn-popup-${singlePoint.id}`);
              if (btn) {
                btn.onclick = () => {
                  onSelectHotspot(singlePoint);
                };
              }
            });
            marker.on("click", () => {
              onSelectHotspot(singlePoint);
            });
          } else {
            // Jika cluster multi-titik, klik akan memperbesar (zoom-in) untuk mengurai titik
            marker.on("click", () => {
              map.flyTo([cluster.lat, cluster.lng], Math.min(map.getZoom() + 2, 17), {
                duration: 0.7,
              });
            });

            marker.bindTooltip(
              `<strong>${cfg.label}</strong><br/>${count} Titik Sampah (Klik untuk perbesar)`,
              { direction: "top", offset: [0, -iconSize / 2] }
            );
          }

          marker.addTo(clusterLayer);
        });
      }
    },
    [computeClusters, onSelectHotspot]
  );

  // Inisialisasi Peta Leaflet secara dinamis di sisi klien
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let isCancelled = false;

    import("leaflet").then((leafletModule) => {
      if (isCancelled || !mapContainerRef.current) return;
      const L = (leafletModule as any).default || leafletModule;
      leafletRef.current = L;

      // Cegah inisialisasi ganda
      if (mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: BALI_CENTER,
        zoom: 10,
        minZoom: 9.5,
        maxZoom: 18,
        maxBounds: BALI_BOUNDS,
        maxBoundsViscosity: 1.0,
        zoomControl: false,
        attributionControl: false, // Menghilangkan teks Leaflet | OpenStreetMap | CARTO di pojok kanan bawah
      });

      // Kontrol zoom di kanan atas
      L.control.zoom({ position: "topright" }).addTo(map);

      // Tile Layer OpenStreetMap standar yang stabil dan bebas downtime
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        bounds: BALI_BOUNDS,
      }).addTo(map);

      // Layer groups untuk Heatmap dan Cluster
      const heatmapLayer = L.layerGroup().addTo(map);
      const clusterLayer = L.layerGroup().addTo(map);

      heatmapLayerRef.current = heatmapLayer;
      clusterLayerRef.current = clusterLayer;
      mapRef.current = map;

      // Invalidate size agar peta langsung ter-render proporsional
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
      setTimeout(() => {
        map.invalidateSize();
      }, 500);

      // Render awal lapisan geospatial heatmap & marker clustering
      updateMapLayers(L, map, hotspotsRef.current, visModeRef.current);

      // Listener saat zoom atau move: selalu membaca data terbaru dari ref
      const handleViewChange = () => {
        if (leafletRef.current && mapRef.current) {
          updateMapLayers(
            leafletRef.current,
            mapRef.current,
            hotspotsRef.current,
            visModeRef.current
          );
        }
      };

      map.on("zoomend", handleViewChange);
      map.on("moveend", handleViewChange);
    });

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Perbarui layer saat data hotspots atau visual mode berubah
  useEffect(() => {
    if (!leafletRef.current || !mapRef.current) return;
    updateMapLayers(leafletRef.current, mapRef.current, hotspots, visMode);
  }, [hotspots, visMode, updateMapLayers]);

  // Sorot titik saat user memilih dari daftar
  useEffect(() => {
    if (!leafletRef.current || !mapRef.current || !selectedHotspot) return;

    mapRef.current.flyTo(
      [selectedHotspot.latitude, selectedHotspot.longitude],
      Math.max(mapRef.current.getZoom(), 15),
      { duration: 1.0 }
    );
  }, [selectedHotspot]);

  // Terbang ke koordinat daerah (Desa/Kecamatan/Kabupaten)
  useEffect(() => {
    if (!mapRef.current || !flyToTarget) return;

    mapRef.current.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom, {
      duration: 1.2,
    });
  }, [flyToTarget]);

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-2xl overflow-hidden border border-[#d1d8cd] shadow-md bg-[#edf1eb]">
      {/* Container Leaflet dengan height 100% eksplisit */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[520px] z-0"
        style={{ height: "100%", minHeight: "520px" }}
      />

      {/* Floating Mode Switcher (Heatmap + Cluster) di Kiri Atas */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#d1d8cd] shadow-md text-xs font-semibold">
        <button
          type="button"
          onClick={() => setVisMode("combo")}
          className={cn(
            "px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
            visMode === "combo"
              ? "bg-[#266210] text-white shadow-sm"
              : "text-[#52604d] hover:bg-[#edf1eb] hover:text-[#15370d]"
          )}
          title="Kombinasi Heatmap Geospasial + Marker Clustering"
        >
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <span>Heatmap + Cluster</span>
        </button>

        <button
          type="button"
          onClick={() => setVisMode("heatmap")}
          className={cn(
            "px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
            visMode === "heatmap"
              ? "bg-[#266210] text-white shadow-sm"
              : "text-[#52604d] hover:bg-[#edf1eb] hover:text-[#15370d]"
          )}
          title="Hanya Gradasi Panas Heatmap Geospasial"
        >
          <Flame className="h-3.5 w-3.5" />
          <span>Heatmap</span>
        </button>

        <button
          type="button"
          onClick={() => setVisMode("cluster")}
          className={cn(
            "px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
            visMode === "cluster"
              ? "bg-[#266210] text-white shadow-sm"
              : "text-[#52604d] hover:bg-[#edf1eb] hover:text-[#15370d]"
          )}
          title="Hanya Titik Marker Clustering"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Cluster</span>
        </button>
      </div>

      {/* Floating Legend Gradasi Konsentrasi Penumpukan Sampah di Kiri Bawah */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-[#d1d8cd] shadow-lg text-xs space-y-2">
        <div className="flex items-center justify-between gap-3 border-b border-[#edf1eb] pb-1.5">
          <p className="font-bold text-[#15370d] text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-red-600" />
            <span>Gradasi Konsentrasi Sampah</span>
          </p>
          <span className="text-[10px] text-[#52604d] font-medium">
            Heatmap &amp; Cluster
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-semibold">
          <div className="flex items-center gap-2 text-red-700">
            <span className="h-3 w-3 rounded-full bg-red-600 ring-2 ring-red-300 animate-pulse flex-shrink-0" />
            <span>Merah: Sangat Tinggi</span>
          </div>
          <div className="flex items-center gap-2 text-orange-700">
            <span className="h-3 w-3 rounded-full bg-orange-500 ring-2 ring-orange-300 flex-shrink-0" />
            <span>Oranye: Tinggi</span>
          </div>
          <div className="flex items-center gap-2 text-amber-700">
            <span className="h-3 w-3 rounded-full bg-yellow-400 ring-2 ring-yellow-200 flex-shrink-0" />
            <span>Kuning: Sedang</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="h-3 w-3 rounded-full bg-emerald-600 ring-2 ring-emerald-200 flex-shrink-0" />
            <span>Hijau: Rendah</span>
          </div>
        </div>
      </div>
    </div>
  );
}
