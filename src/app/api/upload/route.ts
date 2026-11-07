// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/storage";
import { ApiResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: "Data gambar tidak ditemukan",
        error: {
          code: "MISSING_IMAGE",
          details: "Field 'image' (base64 data URI) harus disertakan.",
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    const { url, publicId } = await uploadImageToCloudinary(image);

    const response: ApiResponse<{ imageUrl: string; publicId: string }> = {
      success: true,
      data: { imageUrl: url, publicId },
      message: "Gambar berhasil diunggah ke Cloudinary",
      error: null,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/upload error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Upload failed";

    const response: ApiResponse<null> = {
      success: false,
      data: null,
      message: "Gagal mengunggah gambar",
      error: {
        code: "UPLOAD_FAILED",
        details: errorMessage,
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
