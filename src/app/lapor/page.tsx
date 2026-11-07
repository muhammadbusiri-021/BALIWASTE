// src/app/lapor/page.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera,
  Upload,
  X,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Send,
  RotateCcw,
  SwitchCamera,
  ImageIcon,
  ShieldCheck,
  Clock,
  Building2,
  Lightbulb,
  Leaf,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WASTE_CATEGORIES } from "@/constants";

/* ────────────────────────────────── types (client-side mirrors) ────────────────────────────────── */

type ClassificationResult = {
  category: string;
  categoryLabel: string;
  confidence: number;
  detectedItems: string[];
  estimatedVolume?: string;
  severity: string;
  notes: string;
  needsVerification: boolean;
};

type RecommendationResult = {
  priority: string;
  handlingMethod: string;
  resourcesNeeded: string;
  assignedAgency: string;
  actionSteps: string[];
  safetyNotes?: string;
};

type Step = "capture" | "analyze" | "form" | "success";

/* ──────────────────── label helpers ──────────────────── */

const SEVERITY_LABELS: Record<string, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
  critical: "Kritis",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-800 border-emerald-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
};

const CATEGORY_COLORS: Record<string, string> = {
  organik: "bg-green-100 text-green-800 border-green-200",
  anorganik_plastik: "bg-blue-100 text-blue-800 border-blue-200",
  anorganik_kertas: "bg-yellow-100 text-yellow-800 border-yellow-200",
  anorganik_logam: "bg-slate-100 text-slate-800 border-slate-200",
  anorganik_kaca: "bg-cyan-100 text-cyan-800 border-cyan-200",
  b3_berbahaya: "bg-red-100 text-red-800 border-red-200",
  campuran_tidak_teridentifikasi: "bg-gray-100 text-gray-800 border-gray-200",
};

function getCategoryLabel(id: string): string {
  const found = WASTE_CATEGORIES.find((c) => c.id === id);
  return found ? found.label : id;
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function LaporPage() {
  /* ─── step wizard ─── */
  const [step, setStep] = useState<Step>("capture");

  /* ─── image capture ─── */
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /* ─── AI analysis ─── */
  const [analyzing, setAnalyzing] = useState(false);
  const [classification, setClassification] =
    useState<ClassificationResult | null>(null);
  const [recommendation, setRecommendation] =
    useState<RecommendationResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  /* ─── form fields ─── */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  /* ─── submit ─── */
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* ─── UI extras ─── */
  const [showRecommendation, setShowRecommendation] = useState(false);

  /* ════════════════════════ CAMERA HELPERS ════════════════════════ */

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(
    async (facing: "user" | "environment" = facingMode) => {
      stopCamera();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facing,
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraActive(true);
        setFacingMode(facing);
      } catch {
        setCameraActive(false);
        alert(
          "Tidak dapat mengakses kamera. Pastikan Anda mengizinkan akses kamera pada browser."
        );
      }
    },
    [facingMode, stopCamera]
  );

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setImagePreview(dataUrl);
    setImageBase64(dataUrl);
    setImageMimeType("image/jpeg");
    stopCamera();
  }, [stopCamera]);

  const switchCamera = useCallback(() => {
    const next = facingMode === "environment" ? "user" : "environment";
    startCamera(next);
  }, [facingMode, startCamera]);

  /* cleanup camera on unmount */
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  /* ════════════════════════ FILE UPLOAD ════════════════════════ */

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        alert("Hanya file gambar yang diperbolehkan.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("Ukuran file maksimal 10 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageBase64(result);
        setImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
      stopCamera();
    },
    [stopCamera]
  );

  /* ════════════════════════ RESET IMAGE ════════════════════════ */

  const resetImage = useCallback(() => {
    setImagePreview(null);
    setImageBase64(null);
    setClassification(null);
    setRecommendation(null);
    setAiError(null);
    setShowRecommendation(false);
    setStep("capture");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  /* ════════════════════════ AI ANALYSIS ════════════════════════ */

  const runAnalysis = useCallback(async () => {
    if (!imageBase64) return;
    setStep("analyze");
    setAnalyzing(true);
    setAiError(null);
    setClassification(null);
    setRecommendation(null);

    try {
      /* ── 1. Classify image via Gemini Vision ── */
      const classifyRes = await fetch("/api/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imageBase64,
          mimeType: imageMimeType,
        }),
      });
      const classifyJson = await classifyRes.json();

      if (!classifyJson.success) {
        throw new Error(
          classifyJson.error?.details || classifyJson.message || "Gagal menganalisis gambar"
        );
      }

      const cls: ClassificationResult = classifyJson.data;
      setClassification(cls);

      /* auto-fill title from AI result */
      const label = getCategoryLabel(cls.category);
      setTitle(`Laporan Sampah ${label}`);

      /* ── 2. Get recommendation (non-blocking, UX continues) ── */
      try {
        const recRes = await fetch("/api/ai/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wasteType: cls.category,
            severity: cls.severity,
            address: address || undefined,
            locationDescription: description || undefined,
          }),
        });
        const recJson = await recRes.json();
        if (recJson.success) {
          setRecommendation(recJson.data);
        }
      } catch {
        /* recommendation is non-critical */
      }

      setStep("form");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Terjadi kesalahan analisis AI";
      setAiError(msg);
      setStep("capture");
    } finally {
      setAnalyzing(false);
    }
  }, [imageBase64, imageMimeType, address, description]);

  /* ════════════════════════ GEOLOCATION ════════════════════════ */

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation tidak didukung oleh browser Anda.");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationLoading(false);

        /* reverse geocode via Nominatim (free, no API key) */
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=id`
        )
          .then((r) => r.json())
          .then((data) => {
            if (data.display_name) {
              setAddress(data.display_name);
            }
          })
          .catch(() => {
            /* silent — address is optional */
          });
      },
      (err) => {
        setLocationLoading(false);
        setLocationError(
          err.code === 1
            ? "Akses lokasi ditolak. Silakan izinkan akses lokasi pada browser."
            : "Gagal mendapatkan lokasi saat ini."
        );
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  /* ════════════════════════ SUBMIT REPORT ════════════════════════ */

  const handleSubmit = useCallback(async () => {
    if (!imageBase64 || !classification) return;
    if (!title || title.length < 3) {
      setSubmitError("Judul laporan minimal 3 karakter.");
      return;
    }
    if (latitude === null || longitude === null) {
      setSubmitError(
        "Lokasi belum ditentukan. Klik tombol deteksi lokasi terlebih dahulu."
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      /* ── 1. Upload image to Cloudinary ── */
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const uploadJson = await uploadRes.json();

      if (!uploadJson.success) {
        throw new Error(
          uploadJson.error?.details || uploadJson.message || "Gagal mengunggah gambar"
        );
      }

      const imageUrl: string = uploadJson.data.imageUrl;

      /* ── 2. Submit report to database ── */
      const reportRes = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          latitude,
          longitude,
          address: address || undefined,
          imageUrl,
          aiWasteType: classification.category,
          aiConfidence: classification.confidence,
          severity: classification.severity,
        }),
      });
      const reportJson = await reportRes.json();

      if (!reportJson.success) {
        throw new Error(
          reportJson.error?.details || reportJson.message || "Gagal menyimpan laporan"
        );
      }

      setStep("success");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal mengirim laporan";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [imageBase64, classification, title, description, address, latitude, longitude]);

  /* ════════════════════════ NEW REPORT ════════════════════════ */

  const startNewReport = useCallback(() => {
    resetImage();
    setTitle("");
    setDescription("");
    setAddress("");
    setLatitude(null);
    setLongitude(null);
    setLocationError(null);
    setSubmitError(null);
    setShowRecommendation(false);
    setStep("capture");
  }, [resetImage]);

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-[#f5f7f4] pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* ─── Page Header ─── */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15370d] tracking-tight">
            Pelaporan Sampah
          </h1>
          <p className="mt-2 text-sm text-[#52604d] max-w-xl mx-auto leading-relaxed">
            Ambil atau unggah foto tumpukan sampah. AI akan mengidentifikasi
            jenis sampah secara otomatis dan memberikan rekomendasi penanganan.
          </p>
        </div>

        {/* ─── Step Indicator ─── */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            {(
              [
                { key: "capture", label: "Foto", icon: Camera },
                { key: "analyze", label: "Analisis AI", icon: Sparkles },
                { key: "form", label: "Detail", icon: MapPin },
                { key: "success", label: "Selesai", icon: CheckCircle2 },
              ] as const
            ).map((s, i, arr) => {
              const isActive = step === s.key;
              const isPast =
                arr.findIndex((x) => x.key === step) >
                arr.findIndex((x) => x.key === s.key);
              const Icon = s.icon;

              return (
                <div key={s.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
                        isActive
                          ? "border-[#266210] bg-[#266210] text-white"
                          : isPast
                            ? "border-[#266210] bg-[#edf1eb] text-[#266210]"
                            : "border-[#d1d8cd] bg-white text-[#9ca896]"
                      )}
                    >
                      {isPast ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "mt-1 text-[10px] sm:text-xs font-medium",
                        isActive
                          ? "text-[#15370d]"
                          : isPast
                            ? "text-[#266210]"
                            : "text-[#9ca896]"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className={cn(
                        "mx-1 sm:mx-3 mt-[-14px] h-0.5 w-6 sm:w-12 rounded-full",
                        isPast ? "bg-[#266210]" : "bg-[#d1d8cd]"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════ STEP 1: CAPTURE ═══════════════ */}
        {step === "capture" && (
          <div className="space-y-5">
            {imagePreview ? (
              /* ── Preview captured / uploaded image ── */
              <div className="relative overflow-hidden rounded-2xl border border-[#e2e7df] bg-white shadow-sm">
                <img
                  src={imagePreview}
                  alt="Preview foto sampah"
                  className="w-full max-h-[420px] object-contain bg-[#141b12]/5"
                />
                <button
                  onClick={resetImage}
                  className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#52604d] shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Hapus foto"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : cameraActive ? (
              /* ── Live camera feed ── */
              <div className="relative overflow-hidden rounded-2xl border border-[#e2e7df] bg-black shadow-sm">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-[420px] object-cover"
                />
                {/* Camera controls overlay */}
                <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-5 p-5 bg-gradient-to-t from-black/60 to-transparent">
                  <button
                    onClick={switchCamera}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
                    title="Ganti kamera depan/belakang"
                  >
                    <SwitchCamera className="h-5 w-5" />
                  </button>
                  <button
                    onClick={capturePhoto}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-white/30 hover:scale-105 active:scale-95 transition-transform"
                    title="Ambil foto"
                  >
                    <div className="h-12 w-12 rounded-full bg-[#266210]" />
                  </button>
                  <button
                    onClick={stopCamera}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-red-500/60 transition-colors"
                    title="Tutup kamera"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* ── Upload / Camera selection cards ── */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Camera card */}
                <button
                  onClick={() => startCamera()}
                  className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#c5cfbf] bg-white p-8 sm:p-10 hover:border-[#266210] hover:bg-[#edf1eb] transition-colors"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#edf1eb] text-[#266210] group-hover:bg-[#266210] group-hover:text-white transition-colors">
                    <Camera className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#15370d]">
                      Buka Kamera
                    </p>
                    <p className="text-xs text-[#52604d] mt-0.5">
                      Ambil foto langsung dari kamera HP / laptop
                    </p>
                  </div>
                </button>

                {/* File upload card */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#c5cfbf] bg-white p-8 sm:p-10 hover:border-[#266210] hover:bg-[#edf1eb] transition-colors"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#edf1eb] text-[#266210] group-hover:bg-[#266210] group-hover:text-white transition-colors">
                    <Upload className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#15370d]">
                      Unggah dari Galeri
                    </p>
                    <p className="text-xs text-[#52604d] mt-0.5">
                      JPG, PNG, WEBP — maks. 10 MB
                    </p>
                  </div>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            )}

            {/* AI Error feedback */}
            {aiError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Analisis Gagal</p>
                  <p className="mt-0.5 text-red-700">{aiError}</p>
                </div>
              </div>
            )}

            {/* CTA: Analyze with AI */}
            {imagePreview && (
              <button
                onClick={runAnalysis}
                disabled={analyzing}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#266210] hover:bg-[#347f18] disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Analisis dengan AI
              </button>
            )}
          </div>
        )}

        {/* ═══════════════ STEP 2: ANALYZING (loading) ═══════════════ */}
        {step === "analyze" && analyzing && (
          <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#edf1eb]" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#266210] animate-spin" />
              <Sparkles className="h-7 w-7 text-[#266210]" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#15370d]">
                Menganalisis Gambar
              </p>
              <p className="mt-1 text-sm text-[#52604d]">
                Gemini AI sedang mengidentifikasi jenis dan kondisi sampah...
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════ STEP 3: FORM + AI RESULTS ═══════════════ */}
        {step === "form" && classification && (
          <div className="space-y-6">
            {/* ─── AI Classification Card ─── */}
            <div className="overflow-hidden rounded-2xl border border-[#e2e7df] bg-white shadow-sm">
              {/* photo + overlay badges */}
              <div className="relative">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Foto sampah"
                    className="w-full max-h-56 object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-end gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold shadow-sm",
                      CATEGORY_COLORS[classification.category] ||
                        "bg-gray-100 text-gray-800 border-gray-200"
                    )}
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    {getCategoryLabel(classification.category)}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold shadow-sm",
                      SEVERITY_COLORS[classification.severity] ||
                        "bg-gray-100 text-gray-800"
                    )}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {SEVERITY_LABELS[classification.severity] ||
                      classification.severity}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Confidence bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#15370d]">
                      Akurasi Deteksi AI
                    </span>
                    <span className="font-bold text-[#266210]">
                      {(classification.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#edf1eb]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        classification.confidence >= 0.8
                          ? "bg-[#266210]"
                          : classification.confidence >= 0.6
                            ? "bg-amber-500"
                            : "bg-red-500"
                      )}
                      style={{
                        width: `${classification.confidence * 100}%`,
                      }}
                    />
                  </div>
                  {classification.needsVerification && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-700">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Confidence rendah — perlu verifikasi manual oleh petugas
                    </p>
                  )}
                </div>

                {/* Detected Items */}
                {classification.detectedItems.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-[#15370d] mb-1.5">
                      Objek Terdeteksi
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {classification.detectedItems.map((item, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-[#edf1eb] border border-[#e2e7df] px-2.5 py-1 text-xs text-[#52604d]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Volume & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {classification.estimatedVolume && (
                    <div className="rounded-lg bg-[#f5f7f4] border border-[#e2e7df] p-3">
                      <p className="font-semibold text-[#15370d] mb-0.5">
                        Estimasi Volume
                      </p>
                      <p className="text-[#52604d]">
                        {classification.estimatedVolume}
                      </p>
                    </div>
                  )}
                  <div className="rounded-lg bg-[#f5f7f4] border border-[#e2e7df] p-3">
                    <p className="font-semibold text-[#15370d] mb-0.5">
                      Catatan AI
                    </p>
                    <p className="text-[#52604d] leading-relaxed">
                      {classification.notes}
                    </p>
                  </div>
                </div>

                {/* Re-take photo */}
                <button
                  onClick={resetImage}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#52604d] hover:text-[#15370d] transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Ganti foto / analisis ulang
                </button>
              </div>
            </div>

            {/* ─── AI Recommendation (collapsible accordion) ─── */}
            {recommendation && (
              <div className="overflow-hidden rounded-2xl border border-[#e2e7df] bg-white shadow-sm">
                <button
                  onClick={() => setShowRecommendation(!showRecommendation)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#f5f7f4] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#266210]" />
                    <span className="text-sm font-bold text-[#15370d]">
                      Rekomendasi Penanganan AI
                    </span>
                  </div>
                  {showRecommendation ? (
                    <ChevronUp className="h-4 w-4 text-[#52604d]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#52604d]" />
                  )}
                </button>

                {showRecommendation && (
                  <div className="border-t border-[#e2e7df] p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Priority */}
                      <div className="rounded-lg bg-[#f5f7f4] border border-[#e2e7df] p-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15370d] mb-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#266210]" />
                          Prioritas
                        </div>
                        <p className="text-xs text-[#52604d]">
                          {recommendation.priority}
                        </p>
                      </div>
                      {/* Assigned Agency */}
                      <div className="rounded-lg bg-[#f5f7f4] border border-[#e2e7df] p-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15370d] mb-1">
                          <Building2 className="h-3.5 w-3.5 text-[#266210]" />
                          Instansi Penanggung Jawab
                        </div>
                        <p className="text-xs text-[#52604d]">
                          {recommendation.assignedAgency}
                        </p>
                      </div>
                      {/* Resources */}
                      <div className="rounded-lg bg-[#f5f7f4] border border-[#e2e7df] p-3 sm:col-span-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15370d] mb-1">
                          <Info className="h-3.5 w-3.5 text-[#266210]" />
                          Sumber Daya yang Dibutuhkan
                        </div>
                        <p className="text-xs text-[#52604d]">
                          {recommendation.resourcesNeeded}
                        </p>
                      </div>
                    </div>

                    {/* Handling Method */}
                    <div className="rounded-lg bg-[#f5f7f4] border border-[#e2e7df] p-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15370d] mb-1">
                        <Lightbulb className="h-3.5 w-3.5 text-[#266210]" />
                        Metode Penanganan
                      </div>
                      <p className="text-xs text-[#52604d] leading-relaxed">
                        {recommendation.handlingMethod}
                      </p>
                    </div>

                    {/* Safety Notes */}
                    {recommendation.safetyNotes && (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-1">
                          <Shield className="h-3.5 w-3.5 text-amber-600" />
                          Catatan Keselamatan
                        </div>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          {recommendation.safetyNotes}
                        </p>
                      </div>
                    )}

                    {/* Action Steps */}
                    {recommendation.actionSteps &&
                      recommendation.actionSteps.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-semibold text-[#15370d] mb-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#266210]" />
                            Langkah Penanganan
                          </p>
                          <ol className="space-y-1.5">
                            {recommendation.actionSteps.map((step, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-[#52604d]"
                              >
                                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#edf1eb] text-[10px] font-bold text-[#266210]">
                                  {i + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                  </div>
                )}
              </div>
            )}

            {/* ─── Report Form ─── */}
            <div className="rounded-2xl border border-[#e2e7df] bg-white shadow-sm p-5 space-y-5">
              <h2 className="text-base font-bold text-[#15370d]">
                Detail Laporan
              </h2>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#15370d] mb-1.5">
                  Judul Laporan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Tumpukan sampah plastik di Pantai Kuta"
                  className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-4 py-3 text-sm text-[#141b12] placeholder:text-[#9ca896] focus:border-[#266210] focus:ring-2 focus:ring-[#266210]/20 outline-none transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#15370d] mb-1.5">
                  Deskripsi Tambahan
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Jelaskan kondisi di lokasi, bau, hambatan akses, dll (opsional)"
                  className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-4 py-3 text-sm text-[#141b12] placeholder:text-[#9ca896] focus:border-[#266210] focus:ring-2 focus:ring-[#266210]/20 outline-none transition-colors resize-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-[#15370d] mb-1.5">
                  Lokasi <span className="text-red-500">*</span>
                </label>

                {latitude !== null && longitude !== null ? (
                  <div className="rounded-xl border border-[#e2e7df] bg-[#f5f7f4] p-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#266210] font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      Lokasi berhasil ditentukan
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#52604d]">
                      <div>
                        <span className="font-medium">Lat:</span>{" "}
                        {latitude.toFixed(6)}
                      </div>
                      <div>
                        <span className="font-medium">Lng:</span>{" "}
                        {longitude.toFixed(6)}
                      </div>
                    </div>
                    {address && (
                      <p className="text-xs text-[#52604d] leading-relaxed border-t border-[#e2e7df] pt-2">
                        {address}
                      </p>
                    )}
                    <button
                      onClick={getLocation}
                      disabled={locationLoading}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#52604d] hover:text-[#15370d] transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Perbarui lokasi
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={getLocation}
                      disabled={locationLoading}
                      className="w-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-[#c5cfbf] bg-white py-4 text-sm font-medium text-[#52604d] hover:border-[#266210] hover:text-[#15370d] disabled:opacity-60 transition-colors"
                    >
                      {locationLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      {locationLoading
                        ? "Mendeteksi lokasi..."
                        : "Deteksi Lokasi Saat Ini"}
                    </button>
                    {locationError && (
                      <p className="flex items-center gap-1.5 text-xs text-red-600">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {locationError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Address override */}
              <div>
                <label className="block text-xs font-semibold text-[#15370d] mb-1.5">
                  Alamat Lengkap
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Raya Kuta, Badung, Bali"
                  className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-4 py-3 text-sm text-[#141b12] placeholder:text-[#9ca896] focus:border-[#266210] focus:ring-2 focus:ring-[#266210]/20 outline-none transition-colors"
                />
              </div>

              {/* Submit error */}
              {submitError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>{submitError}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#266210] hover:bg-[#347f18] disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengirim Laporan...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Kirim Laporan Sampah
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════ STEP 4: SUCCESS ═══════════════ */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf1eb]">
              <CheckCircle2 className="h-10 w-10 text-[#266210]" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#15370d]">
                Laporan Berhasil Dikirim
              </h2>
              <p className="mt-2 text-sm text-[#52604d] max-w-md leading-relaxed">
                Terima kasih atas partisipasi Anda. Laporan akan diproses
                oleh petugas terkait dan dapat dipantau melalui Peta Hotspot.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={startNewReport}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#266210] hover:bg-[#347f18] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors"
              >
                <Camera className="h-4 w-4" />
                Buat Laporan Baru
              </button>
              <a
                href="/hotspot"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d1d8cd] bg-white hover:bg-[#edf1eb] px-6 py-3 text-sm font-semibold text-[#15370d] shadow-sm transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Lihat Peta Hotspot
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
