// src/lib/db/seed.ts
import { db } from "../db";
import { users, wasteReports, aiRecommendations } from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("[SEED] Menjalankan seeding data awal BALIWASTE...");

  try {
    const passwordHash = await bcrypt.hash("juriBali2026!", 10);

    // 1. Buat Demo User / Juri
    const [demoUser] = await db
      .insert(users)
      .values({
        name: "Dewan Juri Bali DigiFest",
        email: "juri@baliwaste.id",
        passwordHash,
        role: "officer",
        phone: "081234567890",
      })
      .onConflictDoNothing()
      .returning();

    const userId = demoUser?.id;

    // 2. Sample Waste Reports di Wilayah Bali
    const sampleReports = [
      {
        title: "Penumpukan Sampah Plastik & Kresek di Pesisir Pantai Kuta",
        description: "Ditemukan akumulasi sampah plastik kiriman berupa botol kemasan dan kantong kresek di sepanjang bibir pantai.",
        latitude: -8.7185,
        longitude: 115.1686,
        address: "Pantai Kuta, Badung, Bali",
        imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
        aiWasteType: "anorganik_plastik",
        aiConfidence: 0.94,
        severity: "high" as const,
        status: "in_progress" as const,
        priority: "Tinggi",
        handlingMethod: "Pembersihan pantai darurat menggunakan beach cleaner & pengangkutan terpilah ke Bank Sampah Unit Badung.",
        resourcesNeeded: "1 Tim Satgas Kebersihan (6 personel), 1 unit truk sampah, jaring pengumpul.",
        assignedAgency: "DLHK Kabupaten Badung & Komunitas Peduli Pantai Kuta",
      },
      {
        title: "Limbah Organik Upacara & Sisa Pangan di Pasar Ubud",
        description: "Timbulan sisa banten/canang dan sisa sayuran di bak penampungan sementara butuh segera diangkut sebelum membusuk.",
        latitude: -8.5069,
        longitude: 115.2625,
        address: "Kawasan Pasar Seni Ubud, Gianyar, Bali",
        imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
        aiWasteType: "organik",
        aiConfidence: 0.91,
        severity: "medium" as const,
        status: "reported" as const,
        priority: "Sedang",
        handlingMethod: "Pengangkutan terjadwal menuju fasilitas TPS3R Desa Adat Ubud untuk proses komposting / pakan maggot BSF.",
        resourcesNeeded: "1 unit pickup roda tiga TPS3R, 2 petugas pengangkut.",
        assignedAgency: "Pengelola TPS3R Desa Adat Ubud & DLH Gianyar",
      },
      {
        title: "Sampah Menumpuk di Bantaran Tukad Badung Kumbasari",
        description: "Sampah kemasan plastik dan styrofoam tersangkut di sekat apung sungai setelah hujan deras semalam.",
        latitude: -8.6572,
        longitude: 115.2155,
        address: "Tukad Badung, Pasar Kumbasari, Denpasar Barat",
        imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
        aiWasteType: "anorganik_plastik",
        aiConfidence: 0.88,
        severity: "critical" as const,
        status: "verified" as const,
        priority: "Tinggi",
        handlingMethod: "Penyisiran menggunakan perahu karet dan pengangkatan jaring trash barrier sungai secara intensif.",
        resourcesNeeded: "Tim Pasukan Biru (Dinas PUPR Denpasar), perahu karet pembersih sungai, dump truck.",
        assignedAgency: "Dinas PUPR Kota Denpasar & DLHK Kota Denpasar",
      },
      {
        title: "Pecahan Kaca & Botol Minuman di Area Parkir Sanur",
        description: "Pecahan botol kaca berpotensi melukai pejalan kaki dan wisatawan yang melintas.",
        latitude: -8.6882,
        longitude: 115.2632,
        address: "Jl. Danau Tamblingan, Sanur, Denpasar Selatan",
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
        aiWasteType: "anorganik_kaca",
        aiConfidence: 0.96,
        severity: "medium" as const,
        status: "resolved" as const,
        priority: "Sedang",
        handlingMethod: "Pembersihan manual menggunakan sapu ijuk khusus, sarung tangan tebal anti-gores, dan wadah kontainer keras (drum kaca).",
        resourcesNeeded: "2 petugas, APD sarung tangan anti-tusuk, kontainer daur ulang kaca.",
        assignedAgency: "Dinas Lingkungan Hidup dan Kebersihan Kota Denpasar",
      },
    ];

    for (const r of sampleReports) {
      const [insertedReport] = await db
        .insert(wasteReports)
        .values({
          userId: userId || null,
          title: r.title,
          description: r.description,
          latitude: r.latitude,
          longitude: r.longitude,
          address: r.address,
          imageUrl: r.imageUrl,
          aiWasteType: r.aiWasteType,
          aiConfidence: r.aiConfidence,
          severity: r.severity,
          status: r.status,
        })
        .returning();

      if (insertedReport) {
        await db.insert(aiRecommendations).values({
          reportId: insertedReport.id,
          priority: r.priority,
          handlingMethod: r.handlingMethod,
          resourcesNeeded: r.resourcesNeeded,
          assignedAgency: r.assignedAgency,
          aiRawResponse: {
            priority: r.priority,
            handlingMethod: r.handlingMethod,
            resourcesNeeded: r.resourcesNeeded,
            assignedAgency: r.assignedAgency,
          },
        });
      }
    }

    console.log("[SEED] Selesai: Data awal contoh Bali berhasil dimasukkan.");
  } catch (error) {
    console.error("Gagal melakukan seeding:", error);
  }
}

main();
