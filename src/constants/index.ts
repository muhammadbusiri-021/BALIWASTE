// src/constants/index.ts

export const BALI_COORDINATES = {
  latitude: -8.4095,
  longitude: 115.1889,
  zoom: 10,
};

export const BALI_REGIONS = [
  "Kota Denpasar",
  "Badung",
  "Gianyar",
  "Tabanan",
  "Buleleng",
  "Karangasem",
  "Klungkung",
  "Bangli",
  "Jembrana",
] as const;

export const WASTE_CATEGORIES = [
  { id: "organik", label: "Organik (Sisa Makanan, Daun, Ranting)", color: "emerald" },
  { id: "anorganik_plastik", label: "Anorganik — Plastik", color: "blue" },
  { id: "anorganik_kertas", label: "Anorganik — Kertas / Karton", color: "amber" },
  { id: "anorganik_logam", label: "Anorganik — Logam / Kaleng", color: "zinc" },
  { id: "anorganik_kaca", label: "Anorganik — Kaca / Botol", color: "cyan" },
  { id: "b3_berbahaya", label: "B3 / Berbahaya (Baterai, Medis, Kimia)", color: "rose" },
  { id: "campuran_tidak_teridentifikasi", label: "Campuran / Perlu Verifikasi", color: "purple" },
] as const;
