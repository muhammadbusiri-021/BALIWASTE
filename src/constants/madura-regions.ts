// src/constants/madura-regions.ts

export type RegionLevel = "kabupaten" | "kecamatan" | "desa";

export interface MaduraRegionItem {
  id: string;
  name: string;
  type: RegionLevel;
  kabupaten: string;
  kecamatan?: string;
  lat: number;
  lng: number;
  zoom: number;
  description?: string;
}

// Alias untuk kompatibilitas
export type BaliRegionItem = MaduraRegionItem;

/**
 * 4 Kabupaten di Pulau Madura
 */
export const MADURA_KABUPATEN: MaduraRegionItem[] = [
  {
    id: "kab-bangkalan",
    name: "Kabupaten Bangkalan",
    type: "kabupaten",
    kabupaten: "Kabupaten Bangkalan",
    lat: -7.0315,
    lng: 112.7483,
    zoom: 12,
    description: "Pintu gerbang barat Pulau Madura yang terhubung dengan Jembatan Suramadu dan Pelabuhan Kamal.",
  },
  {
    id: "kab-sampang",
    name: "Kabupaten Sampang",
    type: "kabupaten",
    kabupaten: "Kabupaten Sampang",
    lat: -7.1884,
    lng: 113.2394,
    zoom: 12,
    description: "Wilayah tengah Madura dengan sentra perikanan, Pantai Camplong, dan aliran Kali Kemuning.",
  },
  {
    id: "kab-pamekasan",
    name: "Kabupaten Pamekasan",
    type: "kabupaten",
    kabupaten: "Kabupaten Pamekasan",
    lat: -7.1611,
    lng: 113.4831,
    zoom: 12,
    description: "Kota pendidikan dan budaya Madura dengan sentra batik Klampar dan pelabuhan Branta Pesisir.",
  },
  {
    id: "kab-sumenep",
    name: "Kabupaten Sumenep",
    type: "kabupaten",
    kabupaten: "Kabupaten Sumenep",
    lat: -7.0167,
    lng: 113.8667,
    zoom: 11,
    description: "Wilayah timur Madura kaya sejarah Keraton, sentra garam nasional, dan Pelabuhan Kalianget.",
  },
];

export const BALI_KABUPATEN = MADURA_KABUPATEN;

/**
 * Daftar Kecamatan Lengkap di Seluruh Pulau Madura
 */
export const MADURA_KECAMATAN: MaduraRegionItem[] = [
  // Kabupaten Bangkalan
  { id: "kec-bangkalan", name: "Bangkalan (Kota)", type: "kecamatan", kabupaten: "Kabupaten Bangkalan", lat: -7.0315, lng: 112.7483, zoom: 13 },
  { id: "kec-kamal", name: "Kamal", type: "kecamatan", kabupaten: "Kabupaten Bangkalan", lat: -7.1685, lng: 112.7212, zoom: 14 },
  { id: "kec-labang", name: "Labang (Suramadu)", type: "kecamatan", kabupaten: "Kabupaten Bangkalan", lat: -7.1421, lng: 112.7845, zoom: 14 },
  { id: "kec-burneh", name: "Burneh", type: "kecamatan", kabupaten: "Kabupaten Bangkalan", lat: -7.0612, lng: 112.7712, zoom: 13 },
  { id: "kec-socah", name: "Socah", type: "kecamatan", kabupaten: "Kabupaten Bangkalan", lat: -7.0912, lng: 112.7123, zoom: 13 },
  { id: "kec-tanah-merah", name: "Tanah Merah", type: "kecamatan", kabupaten: "Kabupaten Bangkalan", lat: -7.0812, lng: 112.8712, zoom: 13 },
  { id: "kec-arosbaya", name: "Arosbaya", type: "kecamatan", kabupaten: "Kabupaten Bangkalan", lat: -6.9421, lng: 112.8345, zoom: 13 },
  { id: "kec-tanjungbumi", name: "Tanjungbumi", type: "kecamatan", kabupaten: "Kabupaten Bangkalan", lat: -6.8923, lng: 112.9812, zoom: 13 },
  { id: "kec-blega", name: "Blega", type: "kecamatan", kabupaten: "Kabupaten Bangkalan", lat: -7.1423, lng: 113.0812, zoom: 13 },
  { id: "kec-galis-bangkalan", name: "Galis", type: "kecamatan", kabupaten: "Kabupaten Bangkalan", lat: -7.0912, lng: 112.9612, zoom: 13 },

  // Kabupaten Sampang
  { id: "kec-sampang", name: "Sampang (Kota)", type: "kecamatan", kabupaten: "Kabupaten Sampang", lat: -7.1884, lng: 113.2394, zoom: 14 },
  { id: "kec-camplong", name: "Camplong", type: "kecamatan", kabupaten: "Kabupaten Sampang", lat: -7.2012, lng: 113.3312, zoom: 14 },
  { id: "kec-torjun", name: "Torjun", type: "kecamatan", kabupaten: "Kabupaten Sampang", lat: -7.1723, lng: 113.1912, zoom: 13 },
  { id: "kec-jrengik", name: "Jrengik", type: "kecamatan", kabupaten: "Kabupaten Sampang", lat: -7.1512, lng: 113.1312, zoom: 13 },
  { id: "kec-pangarengan", name: "Pangarengan (Garam)", type: "kecamatan", kabupaten: "Kabupaten Sampang", lat: -7.2112, lng: 113.2112, zoom: 13 },
  { id: "kec-ketapang-sampang", name: "Ketapang", type: "kecamatan", kabupaten: "Kabupaten Sampang", lat: -6.8912, lng: 113.2712, zoom: 13 },
  { id: "kec-banyuates", name: "Banyuates", type: "kecamatan", kabupaten: "Kabupaten Sampang", lat: -6.9123, lng: 113.1512, zoom: 13 },
  { id: "kec-kedungdung", name: "Kedungdung", type: "kecamatan", kabupaten: "Kabupaten Sampang", lat: -7.0912, lng: 113.2412, zoom: 13 },
  { id: "kec-omben", name: "Omben", type: "kecamatan", kabupaten: "Kabupaten Sampang", lat: -7.1123, lng: 113.2912, zoom: 13 },

  // Kabupaten Pamekasan
  { id: "kec-pamekasan", name: "Pamekasan (Kota)", type: "kecamatan", kabupaten: "Kabupaten Pamekasan", lat: -7.1611, lng: 113.4831, zoom: 14 },
  { id: "kec-pademawu", name: "Pademawu", type: "kecamatan", kabupaten: "Kabupaten Pamekasan", lat: -7.1812, lng: 113.5212, zoom: 14 },
  { id: "kec-tlanakan", name: "Tlanakan (Branta)", type: "kecamatan", kabupaten: "Kabupaten Pamekasan", lat: -7.2112, lng: 113.4712, zoom: 14 },
  { id: "kec-proppo", name: "Proppo (Batik Klampar)", type: "kecamatan", kabupaten: "Kabupaten Pamekasan", lat: -7.1312, lng: 113.4112, zoom: 13 },
  { id: "kec-galis-pamekasan", name: "Galis", type: "kecamatan", kabupaten: "Kabupaten Pamekasan", lat: -7.1712, lng: 113.5612, zoom: 13 },
  { id: "kec-larangan", name: "Larangan", type: "kecamatan", kabupaten: "Kabupaten Pamekasan", lat: -7.1423, lng: 113.5812, zoom: 13 },
  { id: "kec-waru", name: "Waru", type: "kecamatan", kabupaten: "Kabupaten Pamekasan", lat: -6.9612, lng: 113.5312, zoom: 13 },
  { id: "kec-pasean", name: "Pasean", type: "kecamatan", kabupaten: "Kabupaten Pamekasan", lat: -6.8812, lng: 113.5412, zoom: 13 },

  // Kabupaten Sumenep
  { id: "kec-sumenep", name: "Kota Sumenep", type: "kecamatan", kabupaten: "Kabupaten Sumenep", lat: -7.0167, lng: 113.8667, zoom: 14 },
  { id: "kec-kalianget", name: "Kalianget (Pelabuhan)", type: "kecamatan", kabupaten: "Kabupaten Sumenep", lat: -7.0512, lng: 113.9212, zoom: 14 },
  { id: "kec-saronggi", name: "Saronggi", type: "kecamatan", kabupaten: "Kabupaten Sumenep", lat: -7.0812, lng: 113.8412, zoom: 13 },
  { id: "kec-bluto", name: "Bluto", type: "kecamatan", kabupaten: "Kabupaten Sumenep", lat: -7.1123, lng: 113.8012, zoom: 13 },
  { id: "kec-pragaan", name: "Pragaan", type: "kecamatan", kabupaten: "Kabupaten Sumenep", lat: -7.1412, lng: 113.7212, zoom: 13 },
  { id: "kec-batang-batang", name: "Batang-Batang (Pantai Lombang)", type: "kecamatan", kabupaten: "Kabupaten Sumenep", lat: -6.9612, lng: 113.9712, zoom: 13 },
  { id: "kec-dasuk", name: "Dasuk (Pantai Slopeng)", type: "kecamatan", kabupaten: "Kabupaten Sumenep", lat: -6.9112, lng: 113.7812, zoom: 13 },
  { id: "kec-dungkek", name: "Dungkek", type: "kecamatan", kabupaten: "Kabupaten Sumenep", lat: -7.0012, lng: 114.0412, zoom: 13 },
  { id: "kec-guluk-guluk", name: "Guluk-Guluk", type: "kecamatan", kabupaten: "Kabupaten Sumenep", lat: -7.0212, lng: 113.6512, zoom: 13 },
];

export const BALI_KECAMATAN = MADURA_KECAMATAN;

/**
 * Daftar Desa / Kawasan Strategis di Pulau Madura
 */
export const MADURA_DESA: MaduraRegionItem[] = [
  // Bangkalan
  { id: "desa-labang", name: "Pesisir Suramadu (Labang)", type: "desa", kabupaten: "Kabupaten Bangkalan", kecamatan: "Labang (Suramadu)", lat: -7.1512, lng: 112.7845, zoom: 15 },
  { id: "desa-kamal", name: "Pelabuhan Kamal", type: "desa", kabupaten: "Kabupaten Bangkalan", kecamatan: "Kamal", lat: -7.1685, lng: 112.7212, zoom: 15 },
  { id: "desa-demangan", name: "Demangan (Kota Bangkalan)", type: "desa", kabupaten: "Kabupaten Bangkalan", kecamatan: "Bangkalan (Kota)", lat: -7.0345, lng: 112.7412, zoom: 15 },
  { id: "desa-tanahmerah", name: "Pasar Hewan & Sentra Tanah Merah", type: "desa", kabupaten: "Kabupaten Bangkalan", kecamatan: "Tanah Merah", lat: -7.0812, lng: 112.8712, zoom: 15 },
  { id: "desa-jaddih", name: "Bukit & Gua Jaddih", type: "desa", kabupaten: "Kabupaten Bangkalan", kecamatan: "Socah", lat: -7.0982, lng: 112.7312, zoom: 15 },
  { id: "desa-tanjungbumi", name: "Pesisir Pantai Siring Kemuning", type: "desa", kabupaten: "Kabupaten Bangkalan", kecamatan: "Tanjungbumi", lat: -6.8892, lng: 112.9845, zoom: 15 },

  // Sampang
  { id: "desa-kemuning", name: "Sekat Kali Kemuning (Pasar Srimangunan)", type: "desa", kabupaten: "Kabupaten Sampang", kecamatan: "Sampang (Kota)", lat: -7.1884, lng: 113.2394, zoom: 15 },
  { id: "desa-camplong", name: "Pesisir Wisata Pantai Camplong", type: "desa", kabupaten: "Kabupaten Sampang", kecamatan: "Camplong", lat: -7.2012, lng: 113.3312, zoom: 15 },
  { id: "desa-toroan", name: "Muara & Air Terjun Toroan", type: "desa", kabupaten: "Kabupaten Sampang", kecamatan: "Ketapang", lat: -6.8912, lng: 113.2712, zoom: 15 },
  { id: "desa-pangarengan", name: "Sentra Tambak Garam Pangarengan", type: "desa", kabupaten: "Kabupaten Sampang", kecamatan: "Pangarengan (Garam)", lat: -7.2112, lng: 113.2112, zoom: 15 },
  { id: "desa-torjun", name: "Kawasan TPA Torjun", type: "desa", kabupaten: "Kabupaten Sampang", kecamatan: "Torjun", lat: -7.1723, lng: 113.1912, zoom: 15 },

  // Pamekasan
  { id: "desa-kolpajung", name: "Pasar Kolpajung & Arek Lancor", type: "desa", kabupaten: "Kabupaten Pamekasan", kecamatan: "Pamekasan (Kota)", lat: -7.1611, lng: 113.4831, zoom: 15 },
  { id: "desa-branta", name: "Pelabuhan Pesisir Branta", type: "desa", kabupaten: "Kabupaten Pamekasan", kecamatan: "Tlanakan (Branta)", lat: -7.2185, lng: 113.4752, zoom: 15 },
  { id: "desa-jumiang", name: "Tebing Pantai Jumiang", type: "desa", kabupaten: "Kabupaten Pamekasan", kecamatan: "Pademawu", lat: -7.2212, lng: 113.5412, zoom: 15 },
  { id: "desa-klampar", name: "Sentra Kerajinan Batik Klampar", type: "desa", kabupaten: "Kabupaten Pamekasan", kecamatan: "Proppo (Batik Klampar)", lat: -7.1312, lng: 113.4112, zoom: 15 },
  { id: "desa-angsana", name: "Kawasan Pengolahan Sampah Angsana", type: "desa", kabupaten: "Kabupaten Pamekasan", kecamatan: "Pademawu", lat: -7.1912, lng: 113.5112, zoom: 15 },

  // Sumenep
  { id: "desa-kalianget", name: "Dermaga Pelabuhan Kalianget", type: "desa", kabupaten: "Kabupaten Sumenep", kecamatan: "Kalianget (Pelabuhan)", lat: -7.0512, lng: 113.9212, zoom: 15 },
  { id: "desa-keraton", name: "Kawasan Budaya Keraton & Masjid Jamik", type: "desa", kabupaten: "Kabupaten Sumenep", kecamatan: "Kota Sumenep", lat: -7.0167, lng: 113.8667, zoom: 15 },
  { id: "desa-lombang", name: "Hutan Cemara Udang Pantai Lombang", type: "desa", kabupaten: "Kabupaten Sumenep", kecamatan: "Batang-Batang (Pantai Lombang)", lat: -6.9582, lng: 113.9785, zoom: 15 },
  { id: "desa-slopeng", name: "Pantai Pasir Putih Slopeng", type: "desa", kabupaten: "Kabupaten Sumenep", kecamatan: "Dasuk (Pantai Slopeng)", lat: -6.9082, lng: 113.7845, zoom: 15 },
  { id: "desa-poteran", name: "Penyeberangan Talango - Pulau Poteran", type: "desa", kabupaten: "Kabupaten Sumenep", kecamatan: "Kalianget (Pelabuhan)", lat: -7.0612, lng: 113.9412, zoom: 15 },
];

export const BALI_DESA = MADURA_DESA;

/**
 * Gabungan seluruh hierarki wilayah Pulau Madura (Desa, Kecamatan, Kabupaten)
 */
export const ALL_MADURA_REGIONS: MaduraRegionItem[] = [
  ...MADURA_KABUPATEN,
  ...MADURA_KECAMATAN,
  ...MADURA_DESA,
];

export const ALL_BALI_REGIONS = ALL_MADURA_REGIONS;

/**
 * Helper fungsi pencarian cepat hierarki daerah Madura
 */
export function searchMaduraRegions(query: string, level?: RegionLevel): MaduraRegionItem[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  return ALL_MADURA_REGIONS.filter((item) => {
    if (level && item.type !== level) return false;
    const matchName = item.name.toLowerCase().includes(clean);
    const matchKab = item.kabupaten.toLowerCase().includes(clean);
    const matchKec = item.kecamatan ? item.kecamatan.toLowerCase().includes(clean) : false;
    return matchName || matchKab || matchKec;
  }).slice(0, 10);
}

export const searchBaliRegions = searchMaduraRegions;
