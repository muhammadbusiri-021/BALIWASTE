// src/lib/storage.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImageToCloudinary(
  base64OrBuffer: string,
  folder = "baliwaste/reports"
): Promise<{ url: string; publicId: string }> {
  try {
    const uploadResult = await cloudinary.uploader.upload(base64OrBuffer, {
      folder,
      resource_type: "image",
    });

    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Gagal mengunggah foto ke Cloudinary");
  }
}
