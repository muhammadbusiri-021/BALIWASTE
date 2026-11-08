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


export interface ReportActivityItem {
  id: string;
  reportId: string;
  action: string;
  notes?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}

export interface HandlingTaskItem extends HotspotPoint {
  allocatedFleet?: string;
  activities?: ReportActivityItem[];
}

export interface RegencyStatsItem {
  kabupaten: string;
  totalReports: number;
  resolvedReports: number;
  criticalReports: number;
  resolutionRate: number;
}

export interface WeeklyTrendItem {
  day: string;
  date: string;
  incoming: number;
  resolved: number;
}

export interface WasteCompositionItem {
  category: WasteCategory;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface EcologicalImpactMetrics {
  co2ReducedTon: number;
  landfillDiversionRate: number;
  oceanPlasticPreventedKg: number;
  compostProducedKg: number;
  meanResolutionTimeHours: number;
}

export interface RecurringHotspotAlert {
  location: string;
  kabupaten: string;
  frequency: string;
  triggerCause: string;
  aiMitigation: string;
}

export interface DashboardStatsData {
  totalReports: number;
  resolvedRate: number;
  statusCounts: {
    reported: number;
    verified: number;
    in_progress: number;
    resolved: number;
  };
  severityCounts: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  categoryCounts: Record<string, number>;
  composition: WasteCompositionItem[];
  regencyStats: RegencyStatsItem[];
  weeklyTrends: WeeklyTrendItem[];
  impactMetrics: EcologicalImpactMetrics;
  recurringHotspots: RecurringHotspotAlert[];
}
