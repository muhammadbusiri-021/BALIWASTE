// src/lib/geo.ts

// Batas wilayah Pulau Bali (Bounding Box ketat)
// Barat Daya: Gilimanuk & Uluwatu
// Timur Laut: Singaraja & Karangasem hingga Nusa Penida
export const BALI_BOUNDS: [[number, number], [number, number]] = [
  [-8.95, 114.35], // Southwest (Selatan & Barat Bali)
  [-8.05, 115.85], // Northeast (Utara & Timur Bali)
];

export const BALI_CENTER: [number, number] = [-8.4095, 115.1889];

/**
 * Validasi apakah suatu titik koordinat berada di dalam area Pulau Bali
 */
export function isLocationInBali(lat: number, lng: number): boolean {
  return lat >= -8.95 && lat <= -8.05 && lng >= 114.35 && lng <= 115.85;
}
