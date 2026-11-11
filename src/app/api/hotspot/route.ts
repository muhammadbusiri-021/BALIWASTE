// src/app/api/hotspot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wasteReports, aiRecommendations } from "@/lib/db/schema";
import { ApiResponse, HotspotPoint } from "@/types";
import { desc, eq } from "drizzle-orm";

// Data titik sebaran hotspot sampah Pulau Madura realistis sebagai fallback jika database offline/kosong
const FALLBACK_MADURA_HOTSPOTS: HotspotPoint[] = [
  {
    id: "hotspot-1",
    title: "Penumpukan Sampah Plastik & Kresek di Pesisir Bawah Jembatan Suramadu",
    latitude: -7.1750,
    longitude: 112.7830,
    severity: "critical",
    status: "in_progress",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    address: "Pesisir Selat Madura, Desa Sukolilo Barat, Kec. Labang, Kabupaten Bangkalan",
    description: "Timbulan botol PET, styrofoam, dan kantong kresek menumpuk di pesisir bawah bentang jembatan Suramadu akibat arus pasang surut.",
    aiConfidence: 0.95,
    kabupaten: "Kabupaten Bangkalan",
    kecamatan: "Labang",
    desa: "Sukolilo Barat",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Pembersihan pesisir darurat bersama Satgas DLH Bangkalan dan pengalihan residu plastik ke Bank Sampah Induk Bangkalan.",
      resourcesNeeded: "1 Tim Satgas Kebersihan (6 personel), 1 unit truk sampah armroll, kantong pemilah plastik.",
      assignedAgency: "Dinas Lingkungan Hidup Kabupaten Bangkalan & Komunitas Pesisir Labang",
      actionSteps: [
        "Penyisiran manual di sepanjang garis pantai 1 km kaki Suramadu",
        "Pemisahan botol PET dan kresek untuk dikirim ke unit daur ulang",
        "Pengangkutan residu ke TPA Buluh Socah Bangkalan",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: "hotspot-2",
    title: "Sampah Kemasan Logistik & Botol Minuman di Pelabuhan Kamal",
    latitude: -7.1705,
    longitude: 112.7210,
    severity: "medium",
    status: "reported",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    address: "Kawasan Dermaga Penyeberangan Kamal, Kec. Kamal, Kabupaten Bangkalan",
    description: "Sampah botol plastik kemasan, cup kopi, dan kardus bekas berserakan di kantong tunggu penumpang dan area dermaga.",
    aiConfidence: 0.92,
    kabupaten: "Kabupaten Bangkalan",
    kecamatan: "Kamal",
    desa: "Kamal",
    recommendation: {
      priority: "Sedang",
      handlingMethod: "Penyisiran berkala area pelabuhan dan penyediaan kontainer pilah sampah terpilah di ruang tunggu ASDP.",
      resourcesNeeded: "2 petugas kebersihan, 1 armada motor roda tiga TPS3R Kamal.",
      assignedAgency: "Pengelola Pelabuhan Kamal & DLH Kabupaten Bangkalan",
      actionSteps: [
        "Pembersihan rutin pagi dan sore di area dermaga",
        "Pemasangan tong sampah terpilah di titik strategis",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
  },
  {
    id: "hotspot-3",
    title: "Sumbatan Sampah di Sekat Trash Barrier Kali Kemuning Sampang",
    latitude: -7.1865,
    longitude: 113.2420,
    severity: "critical",
    status: "verified",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    address: "Sekat Apung Kali Kemuning, Kelurahan Rongtengah, Kec. Sampang Kota, Kabupaten Sampang",
    description: "Batang kayu, styrofoam, dan kantong kresek menyumbat sekat jaring trash barrier sungai, memicu risiko luapan banjir perkotaan.",
    aiConfidence: 0.97,
    kabupaten: "Kabupaten Sampang",
    kecamatan: "Sampang",
    desa: "Rongtengah",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Pengangkatan trash barrier secara mekanis dan evakuasi material sumbatan sungai menggunakan perahu karet sebelum debit air naik.",
      resourcesNeeded: "Tim Reaksi Cepat BPBD/Dinas PUPR Sampang, 1 perahu pembersih sungai, 1 unit dump truck.",
      assignedAgency: "Dinas PUPR & DLH Kabupaten Sampang",
      actionSteps: [
        "Pengangkatan sumbatan sampah pada jaring penahan air",
        "Pengangkutan ke bak truk pengangkut sampah",
        "Pemeriksaan debit air sungai berkala pasca hujan",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "hotspot-4",
    title: "Sampah Kiriman Jaring & Tali Plastik di Pesisir Pantai Camplong",
    latitude: -7.2015,
    longitude: 113.3325,
    severity: "medium",
    status: "resolved",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    address: "Kawasan Wisata Pantai Camplong, Kec. Camplong, Kabupaten Sampang",
    description: "Sisa tali tampar nelayan dan kemasan sachet terdampar di pasir pantai dekat perahu nelayan tradisional.",
    aiConfidence: 0.91,
    kabupaten: "Kabupaten Sampang",
    kecamatan: "Camplong",
    desa: "Dharma Camplong",
    recommendation: {
      priority: "Sedang",
      handlingMethod: "Penyisiran manual garis pantai bersama kelompok sadar wisata (Pokdarwis) dan warga pesisir.",
      resourcesNeeded: "4 personel tim sapu bersih, karung pengumpul residu, sarung tangan tebal.",
      assignedAgency: "Dinas Lingkungan Hidup Kabupaten Sampang & Pokdarwis Camplong",
      actionSteps: [
        "Penyisiran material tajam dan plastik bibir pantai",
        "Pengumpulan terpilah menuju TPS Camplong",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "hotspot-5",
    title: "Limbah Organik Sayur & Karton Basah di Pasar Kolpajung Pamekasan",
    latitude: -7.1585,
    longitude: 113.4735,
    severity: "high",
    status: "in_progress",
    aiWasteType: "organik",
    imageUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80",
    address: "Sentra Pasar Kolpajung, Kelurahan Kolpajung, Kec. Pamekasan, Kabupaten Pamekasan",
    description: "Timbulan sisa sayuran, kulit buah, dan kardus basah menumpuk di bak penampungan sementara setelah jam grosir pasar.",
    aiConfidence: 0.93,
    kabupaten: "Kabupaten Pamekasan",
    kecamatan: "Pamekasan",
    desa: "Kolpajung",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Pengangkutan terjadwal menuju fasilitas TPS3R Kolpajung untuk pencacahan pakan ternak dan rumah maggot BSF.",
      resourcesNeeded: "1 unit compactor truck DLH Pamekasan, sekop pengumpul, cairan desinfektan penekan bau.",
      assignedAgency: "Dinas Lingkungan Hidup Kabupaten Pamekasan & UPT Pasar Kolpajung",
      actionSteps: [
        "Pengangkutan material organik lapak pasar",
        "Penyemprotan disinfektan untuk meniadakan bau lalat",
        "Penyaluran ke fasilitas komposting TPS3R",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "hotspot-6",
    title: "Ceceran Limbah B3 Oli Pelumas & Jeriken di Pelabuhan Branta Pesisir",
    latitude: -7.2280,
    longitude: 113.5180,
    severity: "critical",
    status: "reported",
    aiWasteType: "b3_berbahaya",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    address: "Dermaga PPI Branta Pesisir, Kec. Tlanakan, Kabupaten Pamekasan",
    description: "Limbah jeriken oli pelumas mesin perahu dan kaleng cat pelapis lambung tergeletak di tepi dermaga rawan tumpah ke laut.",
    aiConfidence: 0.94,
    kabupaten: "Kabupaten Pamekasan",
    kecamatan: "Tlanakan",
    desa: "Branta Pesisir",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Evakuasi segera memakai drum khusus B3 dan bahan penyerap oil absorbent pad agar tidak merembes ke air laut perikanan.",
      resourcesNeeded: "Drum penampung limbah B3 berlisensi, oil spill kit, sarung tangan nitril tebal.",
      assignedAgency: "Dinas Kelautan & Perikanan Pamekasan bersama DLH Pamekasan",
      actionSteps: [
        "Pemberian tanda bahaya dan isolasi tumpahan",
        "Pemindahan jeriken oli ke gudang penampungan sementara B3",
        "Sosialisasi penanganan oli bekas kepada rukun nelayan",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "hotspot-7",
    title: "Akumulasi Plastik & Kemasan Makanan di Pelabuhan Penyeberangan Kalianget",
    latitude: -7.0520,
    longitude: 113.8960,
    severity: "high",
    status: "in_progress",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    address: "Kawasan Dermaga Penyeberangan Kepulauan Kalianget, Kec. Kalianget, Kabupaten Sumenep",
    description: "Timbulan botol kemasan air, pembungkus makanan instan, dan kardus kiriman kargo antarpulau di terminal pelabuhan.",
    aiConfidence: 0.95,
    kabupaten: "Kabupaten Sumenep",
    kecamatan: "Kalianget",
    desa: "Kalianget Timur",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Penyediaan kontainer tertutup di gerbang kapal dan pengangkutan harian menggunakan armada DLH Sumenep.",
      resourcesNeeded: "1 unit dump truck DLH Sumenep, 2 kontainer armroll, tim satgas pelabuhan.",
      assignedAgency: "Dinas Perumahan Rakyat Kawasan Permukiman & Hubungan Lingkungan Hidup Kab. Sumenep",
      actionSteps: [
        "Pembersihan terjadwal sebelum jam keberangkatan kapal ke Kangean/Sapeken",
        "Pemilahan sampah plastik bernilai ekonomis",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "hotspot-8",
    title: "Ranting Cemara & Sampah Plastik di Garis Pantai Lombang Sumenep",
    latitude: -6.9400,
    longitude: 113.9850,
    severity: "medium",
    status: "reported",
    aiWasteType: "organik",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    address: "Pesisir Hutan Cemara Udang Pantai Lombang, Kec. Batang-Batang, Kabupaten Sumenep",
    description: "Guguran ranting kering cemara udang bercampur dengan botol plastik yang dibawa pengunjung di area hamparan pasir putih.",
    aiConfidence: 0.92,
    kabupaten: "Kabupaten Sumenep",
    kecamatan: "Batang-Batang",
    desa: "Lombang",
    recommendation: {
      priority: "Sedang",
      handlingMethod: "Pencacahan ranting organik cemara untuk mulsa tanaman dan pemisahan botol plastik daur ulang.",
      resourcesNeeded: "Mesin pencacah ranting kayu, gerobak dorong, sapu lidi panjang.",
      assignedAgency: "Pengelola Wisata Pantai Lombang & DLH Kabupaten Sumenep",
      actionSteps: [
        "Pembersihan pagi hari di bawah rindang pohon cemara",
        "Pengomposan guguran daun dan ranting di lokasi belakang wisata",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "hotspot-9",
    title: "Tumpukan Sampah Plastik & Sisa Bahan Bangunan di Sekitar Bukit Jaddih",
    latitude: -7.0780,
    longitude: 112.7480,
    severity: "medium",
    status: "resolved",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    address: "Jalan Akses Wisata Bukit Kapur Jaddih, Kec. Socah, Kabupaten Bangkalan",
    description: "Kantong plastik pembungkus makanan ringan dan sisa karung semen tercecer di tepian jalur akses bukit kapur.",
    aiConfidence: 0.89,
    kabupaten: "Kabupaten Bangkalan",
    kecamatan: "Socah",
    desa: "Jaddih",
    recommendation: {
      priority: "Sedang",
      handlingMethod: "Pengangkutan insidentil dan pemasangan papan peringatan larangan membuang sampah di kawasan geo-wisata kapur.",
      resourcesNeeded: "1 mobil pickup DLH, papan larangan perda, 2 petugas.",
      assignedAgency: "DLH Kabupaten Bangkalan & Pemdes Jaddih",
      actionSteps: [
        "Pembersihan sampah liar di bahu jalan",
        "Pemasangan papan perda denda buang sampah liar",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: "hotspot-10",
    title: "Sampah Plastik Kemasan di Muara Wisata Air Terjun Toroan",
    latitude: -6.8920,
    longitude: 113.2680,
    severity: "high",
    status: "reported",
    aiWasteType: "anorganik_plastik",
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    address: "Kawasan Muara Air Terjun Toroan, Kec. Ketapang, Kabupaten Sampang",
    description: "Sampah kemasan botol minuman dan styrofoam mengapung di muara air terjun yang langsung bermuara ke Laut Jawa.",
    aiConfidence: 0.93,
    kabupaten: "Kabupaten Sampang",
    kecamatan: "Ketapang",
    desa: "Ketapang Barat",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Penyisiran kolam muara memakai jaring apung dan penyediaan tempat sampah permanen di dek pandang pengunjung.",
      resourcesNeeded: "Jaring apung, karung sampah, pelampung keselamatan.",
      assignedAgency: "DLH Kabupaten Sampang & Pengelola Wisata Toroan",
      actionSteps: [
        "Penyisiran sampah mengapung di muara",
        "Edukasi pengunjung untuk membawa pulang kemasan plastik",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
  },
  {
    id: "hotspot-11",
    title: "Pecahan Kaca & Botol Minuman di Kawasan Wisata Pantai Jumiang",
    latitude: -7.2150,
    longitude: 113.5700,
    severity: "medium",
    status: "verified",
    aiWasteType: "anorganik_kaca",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    address: "Tebing & Pantai Jumiang, Desa Tanjung, Kec. Pademawu, Kabupaten Pamekasan",
    description: "Pecahan botol kaca membahayakan wisatawan yang berjalan di bibir karang dan tebing pantai.",
    aiConfidence: 0.96,
    kabupaten: "Kabupaten Pamekasan",
    kecamatan: "Pademawu",
    desa: "Tanjung",
    recommendation: {
      priority: "Sedang",
      handlingMethod: "Pembersihan manual menggunakan sarung tangan pelindung anti-gores dan penampungan di tong besi khusus kaca.",
      resourcesNeeded: "Sapu lidi keras, sarung tangan anti-tusuk, wadah pengaman pecahan kaca.",
      assignedAgency: "Dinas Pariwisata & DLH Kabupaten Pamekasan",
      actionSteps: [
        "Penyisiran menyeluruh di area pijakan batu tebing",
        "Pengamanan pecahan kaca agar tidak mengenai pejalan kaki",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: "hotspot-12",
    title: "Limbah Kardus, Sayur, & Plastik di Pasar Anom Baru Sumenep",
    latitude: -7.0120,
    longitude: 113.8610,
    severity: "critical",
    status: "in_progress",
    aiWasteType: "organik",
    imageUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80",
    address: "Blok Basah Pasar Anom Baru, Kec. Kota Sumenep, Kabupaten Sumenep",
    description: "Timbulan sisa sayuran hijau, buah busuk, dan karton basah menumpuk melebihi kapasitas bak penampung sementara di belakang pasar.",
    aiConfidence: 0.94,
    kabupaten: "Kabupaten Sumenep",
    kecamatan: "Kota Sumenep",
    desa: "Karangduak",
    recommendation: {
      priority: "Tinggi",
      handlingMethod: "Pengerahan armada truk compactor DLH Sumenep dan pengangkutan intensif sebelum jam sibuk warga.",
      resourcesNeeded: "1 truk compactor, 4 petugas oranye, sekop besar, semprotan disinfektan.",
      assignedAgency: "Dinas Lingkungan Hidup Kabupaten Sumenep & Pengelola Pasar Anom",
      actionSteps: [
        "Pembersihan dan pengerukan material organik menumpuk",
        "Penyemprotan disinfektan untuk meniadakan bau",
        "Pengangkutan ke TPA Torbang Sumenep",
      ],
    },
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

// Alias untuk kompatibilitas ke belakang
const FALLBACK_BALI_HOTSPOTS = FALLBACK_MADURA_HOTSPOTS;

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
      console.warn("Database tidak tersedia, beralih ke dataset hotspot bawaan Madura:", dbErr);
    }

    // 2. Jika database kosong atau belum terhubung, gunakan dataset sampel Madura
    if (hotspots.length === 0) {
      hotspots = [...FALLBACK_MADURA_HOTSPOTS];
    } else {
      // Gabungkan laporan riil baru dengan data hotspot sampel jika data database sedikit
      if (hotspots.length < 6) {
        hotspots = [...hotspots, ...FALLBACK_MADURA_HOTSPOTS];
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
      data: FALLBACK_MADURA_HOTSPOTS,
      message: "Menggunakan data titik sebaran cadangan wilayah Pulau Madura",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  }
}
