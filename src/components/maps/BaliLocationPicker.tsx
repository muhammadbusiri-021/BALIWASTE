// src/components/maps/BaliLocationPicker.tsx
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Batas wilayah Pulau Bali (Bounding Box ketat)
export const BALI_BOUNDS: L.LatLngBoundsLiteral = [
  [-8.95, 114.35], // Ujung Barat Daya (Selatan & Barat Bali)
  [-8.05, 115.85], // Ujung Timur Laut (Utara & Timur Bali)
];

export const BALI_CENTER: [number, number] = [-8.4095, 115.1889];

export function isLocationInBali(lat: number, lng: number): boolean {
  return lat >= -8.95 && lat <= -8.05 && lng >= 114.35 && lng <= 115.85;
}

interface BaliLocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function BaliLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: BaliLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Buat custom SVG pin icon untuk tema BALIWASTE
  const createPinIcon = () => {
    return L.divIcon({
      className: "custom-bali-pin",
      html: `
        <div style="
          position: relative;
          width: 32px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
          cursor: pointer;
        ">
          <svg width="32" height="42" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.372 0 0 5.372 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.372 18.628 0 12 0Z" fill="#15370D"/>
            <circle cx="12" cy="12" r="5" fill="#65DA3C"/>
          </svg>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
    });
  };

  // Inisialisasi Map terkunci HANYA di Bali
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const initialCenter =
      latitude !== null && longitude !== null && isLocationInBali(latitude, longitude)
        ? [latitude, longitude]
        : BALI_CENTER;

    const initialZoom = latitude !== null && longitude !== null ? 14 : 10;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter as [number, number],
      zoom: initialZoom,
      minZoom: 9.5, // Dibatasi agar tidak bisa zoom out ke luar Bali / Indonesia
      maxZoom: 18,
      maxBounds: BALI_BOUNDS, // KUNCI HANYA DI PULAU BALI
      maxBoundsViscosity: 1.0, // 100% kaku, dilarang geser keluar Bali
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      bounds: BALI_BOUNDS,
    }).addTo(map);

    // Event Klik di peta Pulau Bali
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (isLocationInBali(lat, lng)) {
        onLocationChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update posisi Marker ketika latitude / longitude berubah
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (latitude !== null && longitude !== null && isLocationInBali(latitude, longitude)) {
      const latlng: [number, number] = [latitude, longitude];

      if (markerRef.current) {
        markerRef.current.setLatLng(latlng);
      } else {
        const marker = L.marker(latlng, {
          icon: createPinIcon(),
          draggable: true,
        }).addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          if (isLocationInBali(pos.lat, pos.lng)) {
            onLocationChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
          } else {
            // Kembalikan ke koordinat sebelumnya jika di-drag ke luar Bali
            marker.setLatLng([latitude, longitude]);
          }
        });

        markerRef.current = marker;
      }

      // Fly to the new location smoothly
      map.flyTo(latlng, Math.max(map.getZoom(), 13), { duration: 1 });
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [latitude, longitude, onLocationChange]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-[#d1d8cd] bg-[#edf1eb]">
      {/* Top Banner Hint */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-[1000] flex items-center justify-between gap-2 rounded-lg bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-md border border-[#e2e7df] text-[11px] text-[#15370d]">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="flex h-2 w-2 rounded-full bg-[#266210] animate-pulse" />
          Peta Terkunci Khusus Pulau Bali
        </div>
        <span className="text-[#52604d] hidden sm:inline">
          Klik atau geser pin di pulau Bali
        </span>
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="h-64 sm:h-72 w-full z-0" />

      {/* Footer Info */}
      <div className="bg-[#f5f7f4] px-3 py-1.5 border-t border-[#e2e7df] flex items-center justify-between text-[11px] text-[#52604d]">
        <span>Batas Area: Seluruh 9 Kabupaten/Kota di Bali</span>
        {latitude !== null && longitude !== null && (
          <span className="font-semibold text-[#15370d]">
            Titik: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
}
