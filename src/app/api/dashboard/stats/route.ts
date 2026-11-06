// src/app/api/dashboard/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wasteReports } from "@/lib/db/schema";
import { ApiResponse } from "@/types";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const allReports = await db.select().from(wasteReports);

    const totalReports = allReports.length;

    // Status breakdown
    const statusCounts = {
      reported: 0,
      verified: 0,
      in_progress: 0,
      resolved: 0,
    };

    // Severity breakdown
    const severityCounts = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    // Category breakdown
    const categoryCounts: Record<string, number> = {};

    for (const report of allReports) {
      if (report.status in statusCounts) {
        statusCounts[report.status as keyof typeof statusCounts]++;
      }
      if (report.severity in severityCounts) {
        severityCounts[report.severity as keyof typeof severityCounts]++;
      }
      const category = report.aiWasteType || "campuran_tidak_teridentifikasi";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }

    const resolvedRate = totalReports > 0
      ? Math.round((statusCounts.resolved / totalReports) * 100)
      : 0;

    const statsData = {
      totalReports,
      resolvedRate,
      statusCounts,
      severityCounts,
      categoryCounts,
    };

    const response: ApiResponse<typeof statsData> = {
      success: true,
      data: statsData,
      message: "Statistik dashboard berhasil dimuat",
      error: null,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("GET /api/dashboard/stats error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal memuat statistik";

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Gagal memuat statistik environmental dashboard",
      error: {
        code: "STATS_FETCH_FAILED",
        details: errorMessage,
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
