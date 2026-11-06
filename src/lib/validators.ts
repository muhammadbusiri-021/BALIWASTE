// src/lib/validators.ts
import { z } from "zod";

export const reportCreateSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(120),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  imageUrl: z.string().url("URL gambar tidak valid"),
  aiWasteType: z.string().optional(),
  aiConfidence: z.number().min(0).max(1).optional(),
  severity: z.enum(["low", "medium", "high", "critical"]).default("low"),
});

export const classifyImageSchema = z.object({
  imageBase64: z.string().min(1, "Gambar Base64 wajib disertakan"),
  mimeType: z.string().default("image/jpeg"),
});

export const recommendationSchema = z.object({
  wasteType: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  locationDescription: z.string().optional(),
  address: z.string().optional(),
});
