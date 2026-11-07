// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/storage";
import { ApiResponse } from "@/types";
import fs from "fs";
import path from "path";

function isCloudinaryConfigured(): boolean {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;

  if (!name || !key || !secret) return false;
  if (
    name.toLowerCase().includes("your_") ||
    key.toLowerCase().includes("your_") ||
    secret.toLowerCase().includes("your_")
  ) {
    return false;
  }
  return true;
}

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

    // 1. Coba upload ke Cloudinary jika kredensial sudah dikonfigurasi
    if (isCloudinaryConfigured()) {
      try {
        const { url, publicId } = await uploadImageToCloudinary(image);
        const response: ApiResponse<{ imageUrl: string; publicId: string }> = {
          success: true,
          data: { imageUrl: url, publicId },
          message: "Gambar berhasil diunggah ke Cloudinary",
          error: null,
        };
        return NextResponse.json(response, { status: 201 });
      } catch (cloudErr) {
        console.warn("Cloudinary gagal, beralih ke penyimpanan lokal publik:", cloudErr);
      }
    }

    // 2. Fallback: Simpan secara lokal di folder public/uploads agar aplikasi tetap berfungsi
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    let ext = "jpg";
    let base64Data = image;

    if (matches && matches.length === 3) {
      ext = matches[1].replace("+xml", "");
      if (ext === "jpeg") ext = "jpg";
      base64Data = matches[2];
    } else {
      base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    }

    const fileName = `report-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(base64Data, "base64");
    fs.writeFileSync(filePath, buffer);

    // Dapatkan URL absolut agar lolos validasi URL
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const imageUrl = `${protocol}://${host}/uploads/${fileName}`;

    const response: ApiResponse<{ imageUrl: string; publicId: string }> = {
      success: true,
      data: { imageUrl, publicId: fileName },
      message: "Gambar berhasil disimpan di penyimpanan lokal",
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
