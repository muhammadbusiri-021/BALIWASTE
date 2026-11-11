// src/lib/geo.ts

// Batas wilayah Pulau Madura (Bounding Box mencakup 4 Kabupaten: Bangkalan, Sampang, Pamekasan, Sumenep)
// Barat Daya: Pesisir Kamal & Selat Madura
// Timur Laut: Pesisir Dungkek & Kepulauan Sumenep
export const MADURA_BOUNDS: [[number, number], [number, number]] = [
  [-7.40, 112.50], // Southwest (Selatan & Barat Madura)
  [-6.75, 114.35], // Northeast (Utara & Timur Madura)
];

// Titik tengah Pulau Madura (antara Sampang dan Pamekasan)
export const MADURA_CENTER: [number, number] = [-7.08, 113.35];

/**
 * Validasi apakah suatu titik koordinat berada di dalam area Pulau Madura
 */
export function isLocationInMadura(lat: number, lng: number): boolean {
  return lat >= -7.40 && lat <= -6.75 && lng >= 112.50 && lng <= 114.35;
}

// Backward-compatibility aliases agar komponen existing tetap berjalan lancar
export const BALI_BOUNDS = MADURA_BOUNDS;
export const BALI_CENTER = MADURA_CENTER;
export const isLocationInBali = isLocationInMadura;
