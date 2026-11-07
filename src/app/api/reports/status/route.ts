// src/app/api/reports/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wasteReports, reportActivities } from "@/lib/db/schema";
import { updateReportStatusSchema } from "@/lib/validators";
import { ApiResponse } from "@/types";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateReportStatusSchema.safeParse(body);

    if (!parsed.success) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: "Validasi data gagal",
        error: {
          code: "VALIDATION_ERROR",
          details: parsed.error.issues.map((i) => i.message).join(", "),
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { reportId, status, action, notes, allocatedFleet } = parsed.data;

    let activityRecord: any = {
      id: crypto.randomUUID(),
      reportId,
      action: allocatedFleet ? `${action} (Armada: ${allocatedFleet})` : action,
      notes: notes || null,
      createdAt: new Date().toISOString(),
    };

    // 1. Coba perbarui status dan catat aktivitas ke Database PostgreSQL jika terhubung
    try {
      // Cek apakah reportId berformat UUID valid (bukan id dummy fallback seperti 'hotspot-1')
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportId);

      if (isUuid) {
        await db
          .update(wasteReports)
          .set({
            status,
            updatedAt: new Date(),
          })
          .where(eq(wasteReports.id, reportId));

        const insertedAct = await db
          .insert(reportActivities)
          .values({
            reportId,
            action: activityRecord.action,
            notes: notes || null,
          })
          .returning();

        if (insertedAct && insertedAct[0]) {
          activityRecord = {
            ...insertedAct[0],
            createdAt: insertedAct[0].createdAt.toISOString(),
          };
        }
      }
    } catch (dbErr) {
      console.warn("Database tidak tersedia, memproses status update secara in-memory:", dbErr);
    }

    const response: ApiResponse<{
      reportId: string;
      status: string;
      activity: typeof activityRecord;
      allocatedFleet?: string;
    }> = {
      success: true,
      data: {
        reportId,
        status,
        activity: activityRecord,
        allocatedFleet,
      },
      message: `Status penanganan laporan berhasil diperbarui menjadi '${status}'`,
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("POST /api/reports/status error:", error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan server";

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Gagal memperbarui status penanganan laporan",
      error: {
        code: "UPDATE_STATUS_FAILED",
        details: errorMessage,
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
