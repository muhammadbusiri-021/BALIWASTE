// src/app/api/ai/classify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { classifyWasteImage } from "@/lib/ai";
import { classifyImageSchema } from "@/lib/validators";
import { ApiResponse, WasteClassificationResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = classifyImageSchema.safeParse(body);

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

    const { imageBase64, mimeType } = parsed.data;
    const result: WasteClassificationResult = await classifyWasteImage(
      imageBase64,
      mimeType
    );

    const response: ApiResponse<WasteClassificationResult> = {
      success: true,
      data: result,
      message: "Klasifikasi sampah berhasil diidentifikasi oleh AI",
      error: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.error("API /api/ai/classify error:", error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan internal AI";

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Gagal menganalisis gambar sampah dengan AI",
      error: {
        code: "AI_CLASSIFICATION_FAILED",
        details: errorMessage,
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
