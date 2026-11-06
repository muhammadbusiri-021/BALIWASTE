// src/app/api/ai/recommend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateWasteRecommendation } from "@/lib/ai";
import { recommendationSchema } from "@/lib/validators";
import { ApiResponse, WasteHandlingRecommendationResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = recommendationSchema.safeParse(body);

    if (!parsed.success) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: "Data input tidak valid",
        error: {
          code: "VALIDATION_ERROR",
          details: parsed.error.issues.map((i) => i.message).join(", "),
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { wasteType, severity, address, locationDescription } = parsed.data;
    const recommendation = await generateWasteRecommendation({
      wasteType,
      severity,
      address,
      notes: locationDescription,
    });

    const response: ApiResponse<WasteHandlingRecommendationResult> = {
      success: true,
      data: recommendation,
      message: "Rekomendasi penanganan cerdas berhasil dibuat oleh AI",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("API /api/ai/recommend error:", error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan internal AI";

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Gagal membuat rekomendasi penanganan AI",
      error: {
        code: "AI_RECOMMENDATION_FAILED",
        details: errorMessage,
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
