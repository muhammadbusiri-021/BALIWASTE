// src/app/api/reports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wasteReports, aiRecommendations } from "@/lib/db/schema";
import { reportCreateSchema } from "@/lib/validators";
import { generateWasteRecommendation } from "@/lib/ai";
import { ApiResponse, WasteReport } from "@/types";
import { desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const reports = await db
      .select()
      .from(wasteReports)
      .orderBy(desc(wasteReports.createdAt))
      .limit(limit);

    const response: ApiResponse<typeof reports> = {
      success: true,
      data: reports,
      message: "Daftar laporan berhasil diambil",
      error: null,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("GET /api/reports error:", error);
    const errorMessage = error instanceof Error ? error.message : "Database query error";

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Gagal mengambil data laporan sampah",
      error: {
        code: "DATABASE_ERROR",
        details: errorMessage,
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reportCreateSchema.safeParse(body);

    if (!parsed.success) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: "Validasi laporan gagal",
        error: {
          code: "VALIDATION_ERROR",
          details: parsed.error.issues.map((i) => i.message).join(", "),
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const {
      title,
      description,
      latitude,
      longitude,
      address,
      imageUrl,
      aiWasteType,
      aiConfidence,
      severity,
    } = parsed.data;

    // 1. Simpan laporan sampah ke database
    const [newReport] = await db
      .insert(wasteReports)
      .values({
        title,
        description,
        latitude,
        longitude,
        address,
        imageUrl,
        aiWasteType,
        aiConfidence,
        severity,
        status: "reported",
      })
      .returning();

    // 2. Buat rekomendasi penanganan berbasis AI secara otomatis jika ada API key
    if (process.env.GEMINI_API_KEY && aiWasteType) {
      try {
        const rec = await generateWasteRecommendation({
          wasteType: aiWasteType,
          severity,
          address,
          notes: description,
        });

        await db.insert(aiRecommendations).values({
          reportId: newReport.id,
          priority: rec.priority,
          handlingMethod: rec.handlingMethod,
          resourcesNeeded: rec.resourcesNeeded,
          assignedAgency: rec.assignedAgency,
          aiRawResponse: rec,
        });
      } catch (aiErr) {
        console.warn("Gagal membuat rekomendasi AI otomatis saat insert:", aiErr);
      }
    }

    const response: ApiResponse<typeof newReport> = {
      success: true,
      data: newReport,
      message: "Laporan sampah berhasil dibuat",
      error: null,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/reports error:", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan laporan";

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Terjadi kesalahan saat memproses laporan sampah",
      error: {
        code: "REPORT_CREATION_FAILED",
        details: errorMessage,
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
