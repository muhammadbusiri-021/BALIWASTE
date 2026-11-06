// src/app/api/hotspot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wasteReports } from "@/lib/db/schema";
import { ApiResponse, HotspotPoint } from "@/types";
import { desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const rawReports = await db
      .select({
        id: wasteReports.id,
        title: wasteReports.title,
        latitude: wasteReports.latitude,
        longitude: wasteReports.longitude,
        severity: wasteReports.severity,
        status: wasteReports.status,
        aiWasteType: wasteReports.aiWasteType,
        imageUrl: wasteReports.imageUrl,
        address: wasteReports.address,
        createdAt: wasteReports.createdAt,
      })
      .from(wasteReports)
      .orderBy(desc(wasteReports.createdAt));

    const hotspots: HotspotPoint[] = rawReports.map((r) => ({
      id: r.id,
      title: r.title,
      latitude: r.latitude,
      longitude: r.longitude,
      severity: r.severity as HotspotPoint["severity"],
      status: r.status as HotspotPoint["status"],
      aiWasteType: r.aiWasteType,
      imageUrl: r.imageUrl,
      address: r.address,
      createdAt: r.createdAt.toISOString(),
    }));

    const response: ApiResponse<HotspotPoint[]> = {
      success: true,
      data: hotspots,
      message: "Data titik sebaran hotspot sampah berhasil dimuat",
      error: null,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("GET /api/hotspot error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal mengambil data hotspot";

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Gagal memuat titik sebaran hotspot sampah",
      error: {
        code: "HOTSPOT_FETCH_FAILED",
        details: errorMessage,
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
