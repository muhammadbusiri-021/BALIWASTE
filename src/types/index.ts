// src/types/index.ts

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  message: string;
  error: {
    code: string;
    details: string;
  } | null;
};

export type UserRole = "citizen" | "officer" | "admin";

export type ReportSeverity = "low" | "medium" | "high" | "critical";

export type ReportStatus = "reported" | "verified" | "in_progress" | "resolved";

export type WasteCategory =
  | "organik"
  | "anorganik_plastik"
  | "anorganik_kertas"
  | "anorganik_logam"
  | "anorganik_kaca"
  | "b3_berbahaya"
  | "campuran_tidak_teridentifikasi";

export interface WasteClassificationResult {
  category: WasteCategory;
  categoryLabel: string;
  confidence: number;
  detectedItems: string[];
  estimatedVolume?: string;
  severity: ReportSeverity;
  notes: string;
  needsVerification: boolean;
}

export interface WasteHandlingRecommendationResult {
  priority: "Tinggi" | "Sedang" | "Rendah";
  handlingMethod: string;
  resourcesNeeded: string;
  assignedAgency: string;
  actionSteps: string[];
  safetyNotes?: string;
}

export interface HotspotPoint {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  severity: ReportSeverity;
  status: ReportStatus;
  aiWasteType: string | null;
  imageUrl: string;
  address?: string | null;
  description?: string | null;
  aiConfidence?: number | null;
  kabupaten?: string | null;
  kecamatan?: string | null;
  desa?: string | null;
  recommendation?: WasteHandlingRecommendationResult | null;
  createdAt: string;
}

export type {
  WasteReport,
  NewWasteReport,
  User,
  NewUser,
  AiRecommendation,
  NewAiRecommendation,
} from "@/lib/db/schema";

