// src/constants/bali-regions.ts

export type RegionLevel = "kabupaten" | "kecamatan" | "desa";

export interface BaliRegionItem {
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

/**
 * 9 Kabupaten & Kota di Provinsi Bali
 */
export const BALI_KABUPATEN: BaliRegionItem[] = [
  {
    id: "kab-denpasar",
    name: "Kota Denpasar",
    type: "kabupaten",
    kabupaten: "Kota Denpasar",
    lat: -8.6705,
    lng: 115.2126,
    zoom: 12,
    description: "Ibu kota Provinsi Bali — pusat pemerintahan, perdagangan, dan pemukiman padat.",
  },
  {
    id: "kab-badung",
    name: "Kabupaten Badung",
    type: "kabupaten",
    kabupaten: "Kabupaten Badung",
    lat: -8.5819,
    lng: 115.1772,
    zoom: 11,
    description: "Kawasan pariwisata utama Bali (Kuta, Seminyak, Canggu, Nusa Dua, Uluwatu).",
  },
  {
    id: "kab-gianyar",
    name: "Kabupaten Gianyar",
    type: "kabupaten",
    kabupaten: "Kabupaten Gianyar",
    lat: -8.5399,
    lng: 115.3235,
    zoom: 12,
    description: "Pusat seni, budaya, dan pariwisata alam Bali (Ubud, Sukawati, Tampaksiring).",
  },
  {
    id: "kab-tabanan",
    name: "Kabupaten Tabanan",
    type: "kabupaten",
    kabupaten: "Kabupaten Tabanan",
    lat: -8.4892,
    lng: 115.1235,
    zoom: 11,
    description: "Lumbung pangan Bali dengan kawasan persawahan, Tanah Lot, dan Bedugul.",
  },
  {
    id: "kab-buleleng",
    name: "Kabupaten Buleleng",
    type: "kabupaten",
    kabupaten: "Kabupaten Buleleng",
    lat: -8.112,
    lng: 115.0882,
    zoom: 11,
    description: "Wilayah pesisir Bali Utara dengan pusat di Singaraja dan Pantai Lovina.",
  },
  {
    id: "kab-karangasem",
    name: "Kabupaten Karangasem",
    type: "kabupaten",
    kabupaten: "Kabupaten Karangasem",
    lat: -8.4539,
    lng: 115.612,
    zoom: 11,
    description: "Bali Timur yang mencakup Gunung Agung, Pura Besakih, Candi Dasa, dan Amed.",
  },
  {
    id: "kab-klungkung",
    name: "Kabupaten Klungkung",
    type: "kabupaten",
    kabupaten: "Kabupaten Klungkung",
    lat: -8.5372,
    lng: 115.4042,
    zoom: 12,
    description: "Pusat kerajaan Klungkung kuno (Semarapura) dan Kepulauan Nusa Penida.",
  },
  {
    id: "kab-bangli",
    name: "Kabupaten Bangli",
    type: "kabupaten",
    kabupaten: "Kabupaten Bangli",
    lat: -8.4543,
    lng: 115.3551,
    zoom: 11,
    description: "Satu-satunya kabupaten di Bali tanpa pesisir pantai, berpusat di Kintamani dan Danau Batur.",
  },
  {
    id: "kab-jembrana",
    name: "Kabupaten Jembrana",
    type: "kabupaten",
    kabupaten: "Kabupaten Jembrana",
    lat: -8.3585,
    lng: 114.6295,
    zoom: 11,
    description: "Pintu gerbang barat Bali dari Pulau Jawa, berpusat di Kota Negara dan Pelabuhan Gilimanuk.",
  },
];

/**
 * Daftar Kecamatan Lengkap di Seluruh Bali
 */
export const BALI_KECAMATAN: BaliRegionItem[] = [
  // Kota Denpasar
  { id: "kec-denpasar-selatan", name: "Denpasar Selatan", type: "kecamatan", kabupaten: "Kota Denpasar", lat: -8.6983, lng: 115.2284, zoom: 13 },
  { id: "kec-denpasar-barat", name: "Denpasar Barat", type: "kecamatan", kabupaten: "Kota Denpasar", lat: -8.6652, lng: 115.1956, zoom: 13 },
  { id: "kec-denpasar-utara", name: "Denpasar Utara", type: "kecamatan", kabupaten: "Kota Denpasar", lat: -8.6294, lng: 115.2072, zoom: 13 },
  { id: "kec-denpasar-timur", name: "Denpasar Timur", type: "kecamatan", kabupaten: "Kota Denpasar", lat: -8.6475, lng: 115.2458, zoom: 13 },

  // Kabupaten Badung
  { id: "kec-kuta", name: "Kuta", type: "kecamatan", kabupaten: "Kabupaten Badung", lat: -8.7185, lng: 115.1686, zoom: 14 },
  { id: "kec-kuta-selatan", name: "Kuta Selatan", type: "kecamatan", kabupaten: "Kabupaten Badung", lat: -8.7983, lng: 115.1628, zoom: 13 },
  { id: "kec-kuta-utara", name: "Kuta Utara", type: "kecamatan", kabupaten: "Kabupaten Badung", lat: -8.6481, lng: 115.1504, zoom: 13 },
  { id: "kec-mengwi", name: "Mengwi", type: "kecamatan", kabupaten: "Kabupaten Badung", lat: -8.5392, lng: 115.1742, zoom: 13 },
  { id: "kec-abiansemal", name: "Abiansemal", type: "kecamatan", kabupaten: "Kabupaten Badung", lat: -8.5085, lng: 115.2124, zoom: 13 },
  { id: "kec-petang", name: "Petang", type: "kecamatan", kabupaten: "Kabupaten Badung", lat: -8.3845, lng: 115.2221, zoom: 13 },

  // Kabupaten Gianyar
  { id: "kec-ubud", name: "Ubud", type: "kecamatan", kabupaten: "Kabupaten Gianyar", lat: -8.5069, lng: 115.2625, zoom: 14 },
  { id: "kec-sukawati", name: "Sukawati", type: "kecamatan", kabupaten: "Kabupaten Gianyar", lat: -8.5971, lng: 115.2831, zoom: 13 },
  { id: "kec-gianyar", name: "Gianyar", type: "kecamatan", kabupaten: "Kabupaten Gianyar", lat: -8.5435, lng: 115.3289, zoom: 13 },
  { id: "kec-blahbatuh", name: "Blahbatuh", type: "kecamatan", kabupaten: "Kabupaten Gianyar", lat: -8.5678, lng: 115.3021, zoom: 13 },
  { id: "kec-tegallalang", name: "Tegallalang", type: "kecamatan", kabupaten: "Kabupaten Gianyar", lat: -8.4352, lng: 115.2789, zoom: 13 },
  { id: "kec-tampaksiring", name: "Tampaksiring", type: "kecamatan", kabupaten: "Kabupaten Gianyar", lat: -8.4521, lng: 115.3056, zoom: 13 },
  { id: "kec-payangan", name: "Payangan", type: "kecamatan", kabupaten: "Kabupaten Gianyar", lat: -8.3821, lng: 115.2512, zoom: 13 },

  // Kabupaten Tabanan
  { id: "kec-tabanan", name: "Tabanan", type: "kecamatan", kabupaten: "Kabupaten Tabanan", lat: -8.5392, lng: 115.1235, zoom: 13 },
  { id: "kec-kediri", name: "Kediri", type: "kecamatan", kabupaten: "Kabupaten Tabanan", lat: -8.5589, lng: 115.1512, zoom: 13 },
  { id: "kec-baturiti", name: "Baturiti", type: "kecamatan", kabupaten: "Kabupaten Tabanan", lat: -8.3245, lng: 115.1834, zoom: 13 },
  { id: "kec-penebel", name: "Penebel", type: "kecamatan", kabupaten: "Kabupaten Tabanan", lat: -8.4521, lng: 115.1432, zoom: 13 },
  { id: "kec-kerambitan", name: "Kerambitan", type: "kecamatan", kabupaten: "Kabupaten Tabanan", lat: -8.5621, lng: 115.0845, zoom: 13 },

  // Kabupaten Buleleng
  { id: "kec-buleleng", name: "Buleleng (Singaraja)", type: "kecamatan", kabupaten: "Kabupaten Buleleng", lat: -8.112, lng: 115.0882, zoom: 13 },
  { id: "kec-sukasada", name: "Sukasada", type: "kecamatan", kabupaten: "Kabupaten Buleleng", lat: -8.1678, lng: 115.1123, zoom: 13 },
  { id: "kec-banjar", name: "Banjar", type: "kecamatan", kabupaten: "Kabupaten Buleleng", lat: -8.1892, lng: 114.9821, zoom: 13 },
  { id: "kec-seririt", name: "Seririt", type: "kecamatan", kabupaten: "Kabupaten Buleleng", lat: -8.1921, lng: 114.9312, zoom: 13 },
  { id: "kec-gerokgak", name: "Gerokgak", type: "kecamatan", kabupaten: "Kabupaten Buleleng", lat: -8.2123, lng: 114.6543, zoom: 12 },
  { id: "kec-tejakula", name: "Tejakula", type: "kecamatan", kabupaten: "Kabupaten Buleleng", lat: -8.1456, lng: 115.3521, zoom: 13 },

  // Kabupaten Karangasem
  { id: "kec-karangasem", name: "Karangasem (Amlapura)", type: "kecamatan", kabupaten: "Kabupaten Karangasem", lat: -8.4539, lng: 115.612, zoom: 13 },
  { id: "kec-manggis", name: "Manggis", type: "kecamatan", kabupaten: "Kabupaten Karangasem", lat: -8.5021, lng: 115.5213, zoom: 13 },
  { id: "kec-bebandem", name: "Bebandem", type: "kecamatan", kabupaten: "Kabupaten Karangasem", lat: -8.4321, lng: 115.5643, zoom: 13 },
  { id: "kec-abang", name: "Abang (Amed)", type: "kecamatan", kabupaten: "Kabupaten Karangasem", lat: -8.3845, lng: 115.6321, zoom: 13 },
  { id: "kec-kubu", name: "Kubu (Tulamben)", type: "kecamatan", kabupaten: "Kabupaten Karangasem", lat: -8.2543, lng: 115.5532, zoom: 12 },
  { id: "kec-rendang", name: "Rendang (Besakih)", type: "kecamatan", kabupaten: "Kabupaten Karangasem", lat: -8.4123, lng: 115.4213, zoom: 13 },

  // Kabupaten Klungkung
  { id: "kec-klungkung", name: "Klungkung (Semarapura)", type: "kecamatan", kabupaten: "Kabupaten Klungkung", lat: -8.5372, lng: 115.4042, zoom: 14 },
  { id: "kec-nusa-penida", name: "Nusa Penida", type: "kecamatan", kabupaten: "Kabupaten Klungkung", lat: -8.7234, lng: 115.5456, zoom: 12 },
  { id: "kec-dawan", name: "Dawan (Kusamba)", type: "kecamatan", kabupaten: "Kabupaten Klungkung", lat: -8.5412, lng: 115.4523, zoom: 13 },

  // Kabupaten Bangli
  { id: "kec-bangli", name: "Bangli", type: "kecamatan", kabupaten: "Kabupaten Bangli", lat: -8.4543, lng: 115.3551, zoom: 13 },
  { id: "kec-kintamani", name: "Kintamani", type: "kecamatan", kabupaten: "Kabupaten Bangli", lat: -8.2435, lng: 115.3321, zoom: 13 },
  { id: "kec-susut", name: "Susut", type: "kecamatan", kabupaten: "Kabupaten Bangli", lat: -8.4892, lng: 115.3421, zoom: 13 },

  // Kabupaten Jembrana
  { id: "kec-negara", name: "Negara", type: "kecamatan", kabupaten: "Kabupaten Jembrana", lat: -8.3585, lng: 114.6295, zoom: 13 },
  { id: "kec-jembrana", name: "Jembrana", type: "kecamatan", kabupaten: "Kabupaten Jembrana", lat: -8.3612, lng: 114.6432, zoom: 13 },
  { id: "kec-mendoyo", name: "Mendoyo", type: "kecamatan", kabupaten: "Kabupaten Jembrana", lat: -8.3845, lng: 114.7521, zoom: 13 },
  { id: "kec-pekutatan", name: "Pekutatan (Medewi)", type: "kecamatan", kabupaten: "Kabupaten Jembrana", lat: -8.4213, lng: 114.8823, zoom: 13 },
  { id: "kec-melaya", name: "Melaya (Gilimanuk)", type: "kecamatan", kabupaten: "Kabupaten Jembrana", lat: -8.2643, lng: 114.5123, zoom: 12 },
];

/**
 * Daftar Desa / Kelurahan / Kawasan Populer di Bali
 */
export const BALI_DESA: BaliRegionItem[] = [
  // Badung - Kuta
  { id: "desa-kuta", name: "Kuta", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta", lat: -8.7241, lng: 115.1726, zoom: 15 },
  { id: "desa-legian", name: "Legian", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta", lat: -8.7051, lng: 115.1712, zoom: 15 },
  { id: "desa-seminyak", name: "Seminyak", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta", lat: -8.6892, lng: 115.1614, zoom: 15 },
  { id: "desa-tuban", name: "Tuban", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta", lat: -8.7451, lng: 115.1752, zoom: 15 },
  { id: "desa-kedonganan", name: "Kedonganan", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta", lat: -8.7612, lng: 115.1689, zoom: 15 },

  // Badung - Kuta Selatan
  { id: "desa-jimbaran", name: "Jimbaran", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta Selatan", lat: -8.7758, lng: 115.1664, zoom: 15 },
  { id: "desa-nusa-dua", name: "Benoa / Nusa Dua", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta Selatan", lat: -8.7983, lng: 115.2212, zoom: 15 },
  { id: "desa-tanjung-benoa", name: "Tanjung Benoa", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta Selatan", lat: -8.7562, lng: 115.2215, zoom: 15 },
  { id: "desa-ungasan", name: "Ungasan", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta Selatan", lat: -8.8234, lng: 115.1582, zoom: 15 },
  { id: "desa-pecatu", name: "Pecatu (Uluwatu)", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta Selatan", lat: -8.8356, lng: 115.1214, zoom: 15 },

  // Badung - Kuta Utara
  { id: "desa-canggu", name: "Canggu", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta Utara", lat: -8.6515, lng: 115.1322, zoom: 15 },
  { id: "desa-tibubeneng", name: "Tibubeneng (Berawa)", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta Utara", lat: -8.6624, lng: 115.1456, zoom: 15 },
  { id: "desa-kerobokan", name: "Kerobokan", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta Utara", lat: -8.6612, lng: 115.1721, zoom: 15 },
  { id: "desa-dalung", name: "Dalung", type: "desa", kabupaten: "Kabupaten Badung", kecamatan: "Kuta Utara", lat: -8.6254, lng: 115.1743, zoom: 15 },

  // Kota Denpasar
  { id: "desa-sanur", name: "Sanur", type: "desa", kabupaten: "Kota Denpasar", kecamatan: "Denpasar Selatan", lat: -8.6882, lng: 115.2632, zoom: 15 },
  { id: "desa-renon", name: "Renon", type: "desa", kabupaten: "Kota Denpasar", kecamatan: "Denpasar Selatan", lat: -8.6754, lng: 115.2341, zoom: 15 },
  { id: "desa-sidakarya", name: "Sidakarya", type: "desa", kabupaten: "Kota Denpasar", kecamatan: "Denpasar Selatan", lat: -8.7042, lng: 115.2291, zoom: 15 },
  { id: "desa-sesetan", name: "Sesetan", type: "desa", kabupaten: "Kota Denpasar", kecamatan: "Denpasar Selatan", lat: -8.6945, lng: 115.2163, zoom: 15 },
  { id: "desa-pemecutan", name: "Pemecutan", type: "desa", kabupaten: "Kota Denpasar", kecamatan: "Denpasar Barat", lat: -8.6582, lng: 115.2014, zoom: 15 },
  { id: "desa-padangsambian", name: "Padangsambian", type: "desa", kabupaten: "Kota Denpasar", kecamatan: "Denpasar Barat", lat: -8.6612, lng: 115.1834, zoom: 15 },
  { id: "desa-ubung", name: "Ubung", type: "desa", kabupaten: "Kota Denpasar", kecamatan: "Denpasar Utara", lat: -8.6312, lng: 115.2012, zoom: 15 },
  { id: "desa-kesiman", name: "Kesiman", type: "desa", kabupaten: "Kota Denpasar", kecamatan: "Denpasar Timur", lat: -8.6492, lng: 115.2415, zoom: 15 },

  // Gianyar
  { id: "desa-ubud", name: "Ubud", type: "desa", kabupaten: "Kabupaten Gianyar", kecamatan: "Ubud", lat: -8.5069, lng: 115.2625, zoom: 15 },
  { id: "desa-sayan", name: "Sayan", type: "desa", kabupaten: "Kabupaten Gianyar", kecamatan: "Ubud", lat: -8.5082, lng: 115.2451, zoom: 15 },
  { id: "desa-campuhan", name: "Campuhan", type: "desa", kabupaten: "Kabupaten Gianyar", kecamatan: "Ubud", lat: -8.5041, lng: 115.2532, zoom: 15 },
  { id: "desa-peliatan", name: "Peliatan", type: "desa", kabupaten: "Kabupaten Gianyar", kecamatan: "Ubud", lat: -8.5175, lng: 115.2712, zoom: 15 },
  { id: "desa-batubulan", name: "Batubulan", type: "desa", kabupaten: "Kabupaten Gianyar", kecamatan: "Sukawati", lat: -8.6124, lng: 115.2763, zoom: 15 },
  { id: "desa-sukawati", name: "Sukawati", type: "desa", kabupaten: "Kabupaten Gianyar", kecamatan: "Sukawati", lat: -8.5971, lng: 115.2831, zoom: 15 },
  { id: "desa-celuk", name: "Celuk", type: "desa", kabupaten: "Kabupaten Gianyar", kecamatan: "Sukawati", lat: -8.5912, lng: 115.2741, zoom: 15 },
  { id: "desa-tegallalang", name: "Tegallalang (Ceking Rice Terrace)", type: "desa", kabupaten: "Kabupaten Gianyar", kecamatan: "Tegallalang", lat: -8.4352, lng: 115.2789, zoom: 15 },
  { id: "desa-tampaksiring", name: "Tampaksiring (Tirta Empul)", type: "desa", kabupaten: "Kabupaten Gianyar", kecamatan: "Tampaksiring", lat: -8.4521, lng: 115.3056, zoom: 15 },

  // Tabanan
  { id: "desa-candikuning", name: "Candikuning (Bedugul / Danau Beratan)", type: "desa", kabupaten: "Kabupaten Tabanan", kecamatan: "Baturiti", lat: -8.2872, lng: 115.1634, zoom: 15 },
  { id: "desa-baturiti", name: "Baturiti", type: "desa", kabupaten: "Kabupaten Tabanan", kecamatan: "Baturiti", lat: -8.3245, lng: 115.1834, zoom: 15 },
  { id: "desa-beraban", name: "Beraban (Tanah Lot)", type: "desa", kabupaten: "Kabupaten Tabanan", kecamatan: "Kediri", lat: -8.6212, lng: 115.0864, zoom: 15 },
  { id: "desa-jatiluwih", name: "Jatiluwih (UNESCO Rice Terraces)", type: "desa", kabupaten: "Kabupaten Tabanan", kecamatan: "Penebel", lat: -8.3685, lng: 115.1312, zoom: 15 },

  // Buleleng
  { id: "desa-kaliasem", name: "Kaliasem / Kalibukbuk (Pantai Lovina)", type: "desa", kabupaten: "Kabupaten Buleleng", kecamatan: "Banjar", lat: -8.1582, lng: 115.0245, zoom: 15 },
  { id: "desa-banyuasri", name: "Banyuasri (Singaraja)", type: "desa", kabupaten: "Kabupaten Buleleng", kecamatan: "Buleleng (Singaraja)", lat: -8.1182, lng: 115.0812, zoom: 15 },
  { id: "desa-gitgit", name: "Gitgit (Air Terjun Gitgit)", type: "desa", kabupaten: "Kabupaten Buleleng", kecamatan: "Sukasada", lat: -8.1923, lng: 115.1384, zoom: 15 },
  { id: "desa-pemuteran", name: "Pemuteran (Terumbu Karang)", type: "desa", kabupaten: "Kabupaten Buleleng", kecamatan: "Gerokgak", lat: -8.1452, lng: 114.6541, zoom: 14 },

  // Karangasem
  { id: "desa-candidasa", name: "Candi Dasa", type: "desa", kabupaten: "Kabupaten Karangasem", kecamatan: "Manggis", lat: -8.5123, lng: 115.5684, zoom: 15 },
  { id: "desa-padangbai", name: "Padangbai (Pelabuhan Padangbai)", type: "desa", kabupaten: "Kabupaten Karangasem", kecamatan: "Manggis", lat: -8.5312, lng: 115.5082, zoom: 15 },
  { id: "desa-amed", name: "Amed (Pantai Amed)", type: "desa", kabupaten: "Kabupaten Karangasem", kecamatan: "Abang (Amed)", lat: -8.3412, lng: 115.6543, zoom: 15 },
  { id: "desa-tulamben", name: "Tulamben (USAT Liberty Shipwreck)", type: "desa", kabupaten: "Kabupaten Karangasem", kecamatan: "Kubu (Tulamben)", lat: -8.2754, lng: 115.5921, zoom: 15 },
  { id: "desa-besakih", name: "Besakih (Pura Agung Besakih)", type: "desa", kabupaten: "Kabupaten Karangasem", kecamatan: "Rendang (Besakih)", lat: -8.3742, lng: 115.4512, zoom: 15 },

  // Klungkung
  { id: "desa-toya-pakeh", name: "Toyapakeh (Nusa Penida)", type: "desa", kabupaten: "Kabupaten Klungkung", kecamatan: "Nusa Penida", lat: -8.6782, lng: 115.4892, zoom: 14 },
  { id: "desa-jungutbatu", name: "Jungutbatu (Nusa Lembongan)", type: "desa", kabupaten: "Kabupaten Klungkung", kecamatan: "Nusa Penida", lat: -8.6743, lng: 115.4482, zoom: 15 },
  { id: "desa-kusamba", name: "Kusamba (Garam Tradisional)", type: "desa", kabupaten: "Kabupaten Klungkung", kecamatan: "Dawan (Kusamba)", lat: -8.5582, lng: 115.4412, zoom: 15 },

  // Bangli
  { id: "desa-penelokan", name: "Penelokan (Gardu Pandang Batur)", type: "desa", kabupaten: "Kabupaten Bangli", kecamatan: "Kintamani", lat: -8.2782, lng: 115.3412, zoom: 15 },
  { id: "desa-toya-bungkah", name: "Toya Bungkah (Air Panas Batur)", type: "desa", kabupaten: "Kabupaten Bangli", kecamatan: "Kintamani", lat: -8.2456, lng: 115.3942, zoom: 15 },

  // Jembrana
  { id: "desa-gilimanuk", name: "Gilimanuk (Pelabuhan Gilimanuk)", type: "desa", kabupaten: "Kabupaten Jembrana", kecamatan: "Melaya (Gilimanuk)", lat: -8.1654, lng: 114.4392, zoom: 14 },
  { id: "desa-medewi", name: "Medewi (Pantai Surfing Medewi)", type: "desa", kabupaten: "Kabupaten Jembrana", kecamatan: "Pekutatan (Medewi)", lat: -8.4182, lng: 114.8682, zoom: 15 },
];

/**
 * Gabungan seluruh hierarki wilayah Bali untuk pencarian instan (Desa, Kecamatan, Kabupaten)
 */
export const ALL_BALI_REGIONS: BaliRegionItem[] = [
  ...BALI_KABUPATEN,
  ...BALI_KECAMATAN,
  ...BALI_DESA,
];

/**
 * Helper fungsi pencarian cepat hierarki daerah Bali
 */
export function searchBaliRegions(query: string, level?: RegionLevel): BaliRegionItem[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  return ALL_BALI_REGIONS.filter((item) => {
    if (level && item.type !== level) return false;
    const matchName = item.name.toLowerCase().includes(clean);
    const matchKab = item.kabupaten.toLowerCase().includes(clean);
    const matchKec = item.kecamatan ? item.kecamatan.toLowerCase().includes(clean) : false;
    return matchName || matchKab || matchKec;
  }).slice(0, 10);
}
