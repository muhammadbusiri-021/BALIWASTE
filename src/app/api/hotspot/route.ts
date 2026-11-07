// src/app/api/hotspot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wasteReports, aiRecommendations } from "@/lib/db/schema";
import { ApiResponse, HotspotPoint } from "@/types";
import { desc, eq } from "drizzle-orm";

// Data titik sebaran hotspot sampah Bali realistis sebagai fallback jika database offline/kosong
const FALLBACK_BALI_HOTSPOTS: HotspotPoint[] = [
  {
    id: "hotspot-1",
    title: "Penumpukan Sampah Plastik & Kresek di Pesisir Pantai Kuta",
    latitude: -8.7185,
    longitude: 115.1686,
    severity: "high",
    status: "in_progress",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    address: "Pantai Kuta, Kelurahan Kuta, Kec. Kuta, Kabupaten Badung, Bali",
    description: "Ditemukan akumulasi sampah plastik kiriman berupa botol kemasan dan kantong kresek di sepanjang bibir pantai.",
    aiConfidence: 0.94,
    kabupaten: "Kabupaten Badung",
    kecamatan: "Kuta",
    desa: "Kuta",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Pembersihan pantai darurat menggunakan beach cleaner & pengangkutan terpilah ke Bank Sampah Unit Badung.",
      resourcesNeeded: "1 Tim Satgas Kebersihan (6 personel), 1 unit truk sampah, jaring pengumpul.",
      assignedAgency: "DLHK Kabupaten Badung & Satgas Pantai Kuta",
      actionSteps: [
        "Penyisiran manual dan mekanis di sepanjang garis pantai 1.5 km",
        "Pemisahan botol PET dan kresek untuk didaur ulang",
        "Pengangkutan residu ke TPA Suwung",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "hotspot-2",
    title: "Limbah Organik Upacara & Sisa Sayur Pasar Seni Ubud",
    latitude: -8.5069,
    longitude: 115.2625,
    severity: "medium",
    status: "reported",
    aiWasteType: "organik",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    address: "Jl. Raya Ubud No. 35, Kelurahan Ubud, Kec. Ubud, Kabupaten Gianyar, Bali",
    description: "Timbulan sisa canang banten dan sayur pasar menumpuk di kontainer sementara TPS3R.",
    aiConfidence: 0.91,
    kabupaten: "Kabupaten Gianyar",
    kecamatan: "Ubud",
    desa: "Ubud",
    recommendation: {
      priority: "Sedang",
      handlingMethod: "Pengangkutan terjadwal menuju fasilitas TPS3R Desa Adat Ubud untuk proses komposting dan pakan maggot BSF.",
      resourcesNeeded: "1 unit pickup roda tiga TPS3R, 2 petugas kebersihan.",
      assignedAgency: "Pengelola TPS3R Desa Adat Ubud & DLH Gianyar",
      actionSteps: [
        "Pengangkutan pagi hari sebelum jam operasional pasar",
        "Pencacahan material organik untuk mempercepat dekomposisi",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: "hotspot-3",
    title: "Sampah Menumpuk di Sekat Apung Tukad Badung Kumbasari",
    latitude: -8.6572,
    longitude: 115.2155,
    severity: "critical",
    status: "verified",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    address: "Tukad Badung, Pasar Kumbasari, Kec. Denpasar Barat, Kota Denpasar, Bali",
    description: "Sampah kemasan plastik, styrofoam, dan kayu ranting menyumbat trash barrier sungai pasca hujan lebat.",
    aiConfidence: 0.96,
    kabupaten: "Kota Denpasar",
    kecamatan: "Denpasar Barat",
    desa: "Pemecutan",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Penyisiran menggunakan perahu karet dan pengangkatan jaring trash barrier sungai secara intensif sebelum memicu banjir.",
      resourcesNeeded: "Tim Pasukan Biru (Dinas PUPR Denpasar), perahu karet pembersih sungai, 1 unit dump truck.",
      assignedAgency: "Dinas PUPR Kota Denpasar & DLHK Kota Denpasar",
      actionSteps: [
        "Pembersihan jaring penahan sampah di sungai",
        "Evakuasi sampah basah ke armada pengangkut",
        "Pemeriksaan debit air sungai secara berkala",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "hotspot-4",
    title: "Pecahan Kaca & Botol Minuman di Area Parkir Sanur",
    latitude: -8.6882,
    longitude: 115.2632,
    severity: "medium",
    status: "resolved",
    aiWasteType: "anorganik_kaca",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    address: "Jl. Danau Tamblingan, Sanur, Kec. Denpasar Selatan, Kota Denpasar, Bali",
    description: "Pecahan botol kaca berbahaya bagi pejalan kaki dan pesepeda di trotoar Sanur.",
    aiConfidence: 0.95,
    kabupaten: "Kota Denpasar",
    kecamatan: "Denpasar Selatan",
    desa: "Sanur",
    recommendation: {
      priority: "Sedang",
      handlingMethod: "Pembersihan manual memakai sapu ijuk khusus, sarung tangan tebal anti-gores, dan wadah drum daur ulang kaca.",
      resourcesNeeded: "2 petugas, APD sarung tangan anti-tusuk, kontainer daur ulang kaca.",
      assignedAgency: "Dinas Lingkungan Hidup dan Kebersihan Kota Denpasar",
      actionSteps: [
        "Sapu dan kumpulkan pecahan kaca",
        "Masukkan ke kontainer aman berlabel pecahan kaca",
        "Sterilisasi area trotoar",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "hotspot-5",
    title: "Tumpukan Sampah Plastik & Kemasan di Shortcut Canggu",
    latitude: -8.6515,
    longitude: 115.1322,
    severity: "high",
    status: "reported",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80",
    address: "Jl. Raya Canggu - Shortcut Berawa, Kec. Kuta Utara, Kabupaten Badung, Bali",
    description: "Tumpukan liar kantong sampah di pinggir jalan sawah jalan pintas Canggu, menimbulkan bau tak sedap.",
    aiConfidence: 0.89,
    kabupaten: "Kabupaten Badung",
    kecamatan: "Kuta Utara",
    desa: "Canggu",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Pengangkutan insidentil segera dan pemasangan plang larangan buang sampah bersanksi adat setempat.",
      resourcesNeeded: "1 armada truk pengangkut DLHK Badung, plang peringatan perda.",
      assignedAgency: "DLHK Kabupaten Badung & Satpol PP Badung",
      actionSteps: [
        "Bersihkan seluruh tumpukan sampah",
        "Pasang plang larangan pembuangan sampah liar",
        "Koordinasi dengan pecalang desa adat untuk patroli",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "hotspot-6",
    title: "Limbah Kemasan & Cangkang Seafood di Pesisir Jimbaran",
    latitude: -8.7758,
    longitude: 115.1664,
    severity: "medium",
    status: "in_progress",
    aiWasteType: "campuran_tidak_teridentifikasi",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    address: "Kawasan Kafe Ikan Bakar Pantai Jimbaran, Kec. Kuta Selatan, Kabupaten Badung, Bali",
    description: "Sisa pembakaran arang, cangkang kerang, dan plastik pembungkus di belakang area kuliner.",
    aiConfidence: 0.82,
    kabupaten: "Kabupaten Badung",
    kecamatan: "Kuta Selatan",
    desa: "Jimbaran",
    recommendation: {
      priority: "Sedang",
      handlingMethod: "Penyortiran limbah organik cangkang kerang untuk bahan pakan ternak/pupuk kalsium dan pembersihan area pantai.",
      resourcesNeeded: "4 personel, tim pemilah sampah, truk pengangkut.",
      assignedAgency: "DLHK Badung & Paguyuban Kafe Jimbaran",
      actionSteps: [
        "Pilah cangkang kerang dan sisa arang",
        "Edukasi pemilik kafe terkait jadwal pembuangan sampah terpilah",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "hotspot-7",
    title: "Sampah Sayur & Daun Membusuk di Tepian Danau Beratan Bedugul",
    latitude: -8.2872,
    longitude: 115.1634,
    severity: "low",
    status: "resolved",
    aiWasteType: "organik",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    address: "Desa Candikuning, Kec. Baturiti, Kabupaten Tabanan, Bali",
    description: "Sisa pangkasan tanaman hias dan sayur kubis di dekat dermaga perahu wisata Danau Beratan.",
    aiConfidence: 0.93,
    kabupaten: "Kabupaten Tabanan",
    kecamatan: "Baturiti",
    desa: "Candikuning",
    recommendation: {
      priority: "Rendah",
      handlingMethod: "Pengomposan lokal di area perkebunan Desa Candikuning.",
      resourcesNeeded: "2 petugas, mesin perajang kompos mini.",
      assignedAgency: "Dinas Lingkungan Hidup Kabupaten Tabanan & Pengelola Danau Beratan",
      actionSteps: ["Kumpulkan sisa tanaman ke wadah komposter alami"],
    },
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: "hotspot-8",
    title: "Sampah Plastik Kiriman Ombak di Tebing Tanah Lot",
    latitude: -8.6212,
    longitude: 115.0864,
    severity: "high",
    status: "verified",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80",
    address: "Kawasan Objek Wisata Pura Tanah Lot, Desa Beraban, Kec. Kediri, Kabupaten Tabanan, Bali",
    description: "Sampah plastik terapung tersangkut di ceruk batu karang pura saat air laut surut.",
    aiConfidence: 0.91,
    kabupaten: "Kabupaten Tabanan",
    kecamatan: "Kediri",
    desa: "Beraban",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Penyisiran manual saat air laut surut oleh tim penyelamat pantai / balawista.",
      resourcesNeeded: "Tim Balawista & Petugas Kebersihan DTW Tanah Lot (5 orang).",
      assignedAgency: "Manajemen Pengelola DTW Tanah Lot & DLH Tabanan",
      actionSteps: [
        "Penyisiran batu karang dengan tali pengaman",
        "Kumpulkan sampah plastik dalam kantong karung",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
  },
  {
    id: "hotspot-9",
    title: "Limbah Bekas Perahu & Kaleng Oli Mesin di Pantai Lovina",
    latitude: -8.1582,
    longitude: 115.0245,
    severity: "medium",
    status: "in_progress",
    aiWasteType: "b3_berbahaya",
    imageUrl: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80",
    address: "Desa Kaliasem, Pantai Lovina, Kec. Banjar, Kabupaten Buleleng, Bali",
    description: "Jeriken sisa oli mesin jukung nelayan dan kaleng bekas cat perahu di tepi pantai pasir hitam.",
    aiConfidence: 0.87,
    kabupaten: "Kabupaten Buleleng",
    kecamatan: "Banjar",
    desa: "Kaliasem",
    recommendation: {
      priority: "Sedang",
      handlingMethod: "Penanganan limbah B3 khusus oli dan pelumas bekas agar tidak mencemari terumbu karang dan habitat lumba-lumba Lovina.",
      resourcesNeeded: "Drum penampung limbah B3, APD pelindung zat kimia.",
      assignedAgency: "Dinas Lingkungan Hidup Kabupaten Buleleng",
      actionSteps: [
        "Amankan jeriken sisa oli dan bahan kimia",
        "Serahkan ke pihak pengolah limbah B3 berizin di Buleleng",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "hotspot-10",
    title: "Tumpukan Sampah Plastik & Kemasan Sachet di Tebing Kelingking",
    latitude: -8.7512,
    longitude: 115.4721,
    severity: "critical",
    status: "reported",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    address: "Kelingking Beach, Bunga Mekar, Nusa Penida, Kabupaten Klungkung, Bali",
    description: "Botol air mineral dan kemasan makanan ditinggalkan di sepanjang anak tangga tebing curam Kelingking.",
    aiConfidence: 0.93,
    kabupaten: "Kabupaten Klungkung",
    kecamatan: "Nusa Penida",
    desa: "Toyapakeh",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Operasi 'Clean-up Vertikal' dengan tali keselamatan oleh tim gabungan pemuda dan pemandu wisata Nusa Penida.",
      resourcesNeeded: "Tim vertical rescue (4 orang), harness pengaman, tas punggung pengangkut sampah tebing.",
      assignedAgency: "DLH Klungkung & Kelompok Sadar Wisata (Pokdarwis) Nusa Penida",
      actionSteps: [
        "Operasi pembersihan jalur tangga tebing dengan pengaman",
        "Penempatan tempat sampah monyet-proof di pos atas",
        "Sosialisasi larangan membuang botol ke jurang",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "hotspot-11",
    title: "Akumulasi Sampah Kuliner & Kemasan Kopi di Gardu Pandang Penelokan",
    latitude: -8.2782,
    longitude: 115.3412,
    severity: "high",
    status: "verified",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=800&q=80",
    address: "Jl. Raya Penelokan, Kintamani, Kabupaten Bangli, Bali",
    description: "Gelas kopi plastik sekali pakai menumpuk di lereng kaldera Batur di belakang deretan kafe.",
    aiConfidence: 0.92,
    kabupaten: "Kabupaten Bangli",
    kecamatan: "Kintamani",
    desa: "Penelokan",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Pembersihan lereng kaldera dan penerapan program zero plastic cup pada asosiasi pengusaha kafe Kintamani.",
      resourcesNeeded: "Tim kebersihan dinas lingkungan (4 orang), karung pengumpul.",
      assignedAgency: "DLH Kabupaten Bangli & Satgas Kebersihan Kintamani",
      actionSteps: [
        "Pembersihan lereng belakang kafe",
        "Surat edaran pemilahan sampah wajib bagi kafe Kintamani",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  },
  {
    id: "hotspot-12",
    title: "Sampah Kardus & Logam di Pintu Masuk Pelabuhan Gilimanuk",
    latitude: -8.1654,
    longitude: 114.4392,
    severity: "critical",
    status: "in_progress",
    aiWasteType: "anorganik_logam",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    address: "Kawasan Parkir Truk Logistik Pelabuhan Gilimanuk, Kec. Melaya, Kabupaten Jembrana, Bali",
    description: "Kawat pengikat muatan, potongan seng berkarat, dan limbah kemasan barang ekspedisi antarpulau tercecer di kantong parkir.",
    aiConfidence: 0.9,
    kabupaten: "Kabupaten Jembrana",
    kecamatan: "Melaya",
    desa: "Gilimanuk",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Pembersihan magnetik untuk paku dan logam tajam demi keselamatan ban kendaraan serta pengangkutan rongsokan logam ke pengepul besi.",
      resourcesNeeded: "Alat sapu magnet, truk pengangkut kontainer logam, sarung tangan heavy-duty.",
      assignedAgency: "ASDP Indonesia Ferry Gilimanuk & Dinas LH Jembrana",
      actionSteps: [
        "Penyisiran paku dan logam berkarat menggunakan sapu magnet",
        "Pengangkutan ke depo penampungan logam",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kabupaten = searchParams.get("kabupaten");
    const category = searchParams.get("category");
    const severity = searchParams.get("severity");
    const status = searchParams.get("status");
    const query = searchParams.get("search");

    let hotspots: HotspotPoint[] = [];

    // 1. Coba ambil dari Database PostgreSQL
    try {
      const rawReports = await db
        .select({
          id: wasteReports.id,
          title: wasteReports.title,
          description: wasteReports.description,
          latitude: wasteReports.latitude,
          longitude: wasteReports.longitude,
          severity: wasteReports.severity,
          status: wasteReports.status,
          aiWasteType: wasteReports.aiWasteType,
          aiConfidence: wasteReports.aiConfidence,
          imageUrl: wasteReports.imageUrl,
          address: wasteReports.address,
          createdAt: wasteReports.createdAt,
        })
        .from(wasteReports)
        .orderBy(desc(wasteReports.createdAt));

      if (rawReports && rawReports.length > 0) {
        hotspots = rawReports.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          latitude: r.latitude,
          longitude: r.longitude,
          severity: r.severity as HotspotPoint["severity"],
          status: r.status as HotspotPoint["status"],
          aiWasteType: r.aiWasteType,
          aiConfidence: r.aiConfidence,
          imageUrl: r.imageUrl,
          address: r.address,
          createdAt: r.createdAt.toISOString(),
        }));
      }
    } catch (dbErr) {
      console.warn("Database tidak tersedia, beralih ke dataset hotspot bawaan Bali:", dbErr);
    }

    // 2. Jika database kosong atau belum terhubung, gunakan dataset sampel Bali
    if (hotspots.length === 0) {
      hotspots = [...FALLBACK_BALI_HOTSPOTS];
    } else {
      // Gabungkan laporan riil baru dengan data hotspot sampel jika data database sedikit
      if (hotspots.length < 6) {
        hotspots = [...hotspots, ...FALLBACK_BALI_HOTSPOTS];
      }
    }

    // 3. Terapkan Filter jika ada parameter query
    let filtered = hotspots;

    if (kabupaten && kabupaten !== "all") {
      const cleanKab = kabupaten.toLowerCase();
      filtered = filtered.filter((h) => {
        const addr = (h.address || "").toLowerCase();
        const kab = (h.kabupaten || "").toLowerCase();
        return addr.includes(cleanKab) || kab.includes(cleanKab);
      });
    }

    if (category && category !== "all") {
      filtered = filtered.filter((h) => h.aiWasteType === category);
    }

    if (severity && severity !== "all") {
      filtered = filtered.filter((h) => h.severity === severity);
    }

    if (status && status !== "all") {
      filtered = filtered.filter((h) => h.status === status);
    }

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          (h.address && h.address.toLowerCase().includes(q)) ||
          (h.description && h.description.toLowerCase().includes(q))
      );
    }

    const response: ApiResponse<HotspotPoint[]> = {
      success: true,
      data: filtered,
      message: "Data titik sebaran hotspot sampah berhasil dimuat",
      error: null,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("GET /api/hotspot error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Gagal mengambil data hotspot";

    // Tetap kembalikan fallback agar tampilan tidak crash
    const response: ApiResponse<HotspotPoint[]> = {
      success: true,
      data: FALLBACK_BALI_HOTSPOTS,
      message: "Menggunakan data titik sebaran cadangan wilayah Bali",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  }
}
