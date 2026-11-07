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
  Building2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  Search,
  Crosshair,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WASTE_CATEGORIES, BALI_REGIONS } from "@/constants";

/* ────────────────────────────────── types ────────────────────────────────── */

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

/* ─────────────────────── preset koordinat wilayah bali ─────────────────────── */

const BALI_REGION_PRESETS: Record<
  string,
  { lat: number; lng: number; defaultAddress: string }
> = {
  "Kota Denpasar": {
    lat: -8.6705,
    lng: 115.2126,
    defaultAddress: "Kota Denpasar, Bali",
  },
  "Badung (Kuta / Seminyak / Canggu)": {
    lat: -8.7185,
    lng: 115.1686,
    defaultAddress: "Kuta, Kabupaten Badung, Bali",
  },
  "Gianyar (Ubud / Sukawati)": {
    lat: -8.5069,
    lng: 115.2625,
    defaultAddress: "Ubud, Kabupaten Gianyar, Bali",
  },
  "Tabanan (Bedugul / Tanah Lot)": {
    lat: -8.5392,
    lng: 115.1235,
    defaultAddress: "Kabupaten Tabanan, Bali",
  },
  "Buleleng (Singaraja / Lovina)": {
    lat: -8.112,
    lng: 115.0882,
    defaultAddress: "Singaraja, Kabupaten Buleleng, Bali",
  },
  "Karangasem (Amlapura)": {
    lat: -8.4539,
    lng: 115.612,
    defaultAddress: "Kabupaten Karangasem, Bali",
  },
  "Klungkung (Semarapura / Nusa Penida)": {
    lat: -8.5372,
    lng: 115.4042,
    defaultAddress: "Kabupaten Klungkung, Bali",
  },
  "Bangli (Kintamani)": {
    lat: -8.4543,
    lng: 115.3551,
    defaultAddress: "Kabupaten Bangli, Bali",
  },
  "Jembrana (Negara)": {
    lat: -8.3585,
    lng: 114.6295,
    defaultAddress: "Negara, Kabupaten Jembrana, Bali",
  },
};

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

  /* ─── location helper states ─── */
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(
    null
  );
  const [locationMode, setLocationMode] = useState<
    "gps" | "preset" | "search" | "manual"
  >("gps");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

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

  useEffect(() => {
    return () => {
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
          classifyJson.error?.details ||
            classifyJson.message ||
            "Gagal menganalisis gambar"
        );
      }

      const cls: ClassificationResult = classifyJson.data;
      setClassification(cls);

      const label = getCategoryLabel(cls.category);
      setTitle(`Laporan Sampah ${label}`);

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
        /* non-critical */
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

  /* ════════════════════════ LOCATION HELPERS ════════════════════════ */

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch {
      /* silent */
    }
  }, []);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation tidak didukung oleh browser ini.");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    setLocationSuccessMsg(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setLocationLoading(false);
        setLocationSuccessMsg("Koordinat GPS berhasil diperoleh.");
        reverseGeocode(lat, lng);
      },
      (err) => {
        setLocationLoading(false);
        const msg =
          err.code === 1
            ? "Izin akses lokasi ditolak. Silakan izinkan akses pada browser, atau gunakan pilihan wilayah / cari tempat di bawah."
            : "Gagal mendapatkan lokasi GPS akurat. Anda dapat memilih wilayah Bali di bawah ini.";
        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, [reverseGeocode]);

  const selectRegionPreset = useCallback(
    (regionName: string) => {
      const preset = BALI_REGION_PRESETS[regionName];
      if (preset) {
        setLatitude(preset.lat);
        setLongitude(preset.lng);
        setAddress(preset.defaultAddress);
        setLocationError(null);
        setLocationSuccessMsg(`Lokasi diatur ke ${regionName}.`);
      }
    },
    []
  );

  const searchLocation = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setLocationError(null);
    setLocationSuccessMsg(null);

    try {
      const q = encodeURIComponent(
        searchQuery.toLowerCase().includes("bali")
          ? searchQuery
          : `${searchQuery}, Bali`
      );
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1&accept-language=id`
      );
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        setLatitude(lat);
        setLongitude(lng);
        setAddress(item.display_name);
        setLocationSuccessMsg(`Lokasi ditemukan: ${item.display_name.split(",")[0]}`);
      } else {
        setLocationError(
          "Lokasi tidak ditemukan. Coba gunakan nama tempat atau jalan yang lebih spesifik."
        );
      }
    } catch {
      setLocationError("Gagal mencari lokasi. Periksa koneksi internet Anda.");
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  const resetLocation = useCallback(() => {
    setLatitude(null);
    setLongitude(null);
    setAddress("");
    setLocationError(null);
    setLocationSuccessMsg(null);
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
        "Lokasi belum ditentukan. Silakan pilih atau deteksi lokasi terlebih dahulu."
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      /* ── 1. Upload image (Cloudinary with local fallback) ── */
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const uploadJson = await uploadRes.json();

      if (!uploadJson.success) {
        throw new Error(
          uploadJson.error?.details ||
            uploadJson.message ||
            "Gagal mengunggah foto"
        );
      }

      const imageUrl: string = uploadJson.data.imageUrl;

      /* ── 2. Submit report ── */
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
          reportJson.error?.details ||
            reportJson.message ||
            "Gagal menyimpan data laporan"
        );
      }

      setStep("success");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal mengirim laporan sampah";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }, [imageBase64, classification, title, description, address, latitude, longitude]);

  const startNewReport = useCallback(() => {
    resetImage();
    setTitle("");
    setDescription("");
    resetLocation();
    setSubmitError(null);
    setShowRecommendation(false);
    setStep("capture");
  }, [resetImage, resetLocation]);

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
              <div className="relative overflow-hidden rounded-2xl border border-[#e2e7df] bg-black shadow-sm">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-[420px] object-cover"
                />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {aiError && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Analisis Gagal</p>
                  <p className="mt-0.5 text-red-700">{aiError}</p>
                </div>
              </div>
            )}

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

        {/* ═══════════════ STEP 2: ANALYZING ═══════════════ */}
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

                <button
                  onClick={resetImage}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#52604d] hover:text-[#15370d] transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Ganti foto / analisis ulang
                </button>
              </div>
            </div>

            {/* ─── AI Recommendation ─── */}
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
                      <div className="rounded-lg bg-[#f5f7f4] border border-[#e2e7df] p-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15370d] mb-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#266210]" />
                          Prioritas
                        </div>
                        <p className="text-xs text-[#52604d]">
                          {recommendation.priority}
                        </p>
                      </div>
                      <div className="rounded-lg bg-[#f5f7f4] border border-[#e2e7df] p-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15370d] mb-1">
                          <Building2 className="h-3.5 w-3.5 text-[#266210]" />
                          Instansi Penanggung Jawab
                        </div>
                        <p className="text-xs text-[#52604d]">
                          {recommendation.assignedAgency}
                        </p>
                      </div>
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

                    <div className="rounded-lg bg-[#f5f7f4] border border-[#e2e7df] p-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#15370d] mb-1">
                        <Lightbulb className="h-3.5 w-3.5 text-[#266210]" />
                        Metode Penanganan
                      </div>
                      <p className="text-xs text-[#52604d] leading-relaxed">
                        {recommendation.handlingMethod}
                      </p>
                    </div>

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

                    {recommendation.actionSteps &&
                      recommendation.actionSteps.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-semibold text-[#15370d] mb-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#266210]" />
                            Langkah Penanganan
                          </p>
                          <ol className="space-y-1.5">
                            {recommendation.actionSteps.map((s, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs text-[#52604d]"
                              >
                                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#edf1eb] text-[10px] font-bold text-[#266210]">
                                  {i + 1}
                                </span>
                                <span className="leading-relaxed">{s}</span>
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

              {/* ─── UPGRADED LOCATION SECTION ─── */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#15370d]">
                    Lokasi Penemuan Sampah <span className="text-red-500">*</span>
                  </label>
                  {latitude !== null && longitude !== null && (
                    <button
                      type="button"
                      onClick={resetLocation}
                      className="text-[11px] font-medium text-red-600 hover:underline"
                    >
                      Hapus / Reset Lokasi
                    </button>
                  )}
                </div>

                {/* Display Current Selected Location Status */}
                {latitude !== null && longitude !== null ? (
                  <div className="rounded-xl border border-[#e2e7df] bg-[#f5f7f4] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#266210] font-semibold">
                        <CheckCircle2 className="h-4 w-4" />
                        Lokasi Terpilih
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#266210] hover:underline"
                      >
                        Buka di Google Maps
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#52604d] bg-white p-2.5 rounded-lg border border-[#e2e7df]">
                      <div>
                        <span className="font-semibold text-[#15370d]">
                          Latitude:
                        </span>{" "}
                        {latitude.toFixed(6)}
                      </div>
                      <div>
                        <span className="font-semibold text-[#15370d]">
                          Longitude:
                        </span>{" "}
                        {longitude.toFixed(6)}
                      </div>
                    </div>

                    {address && (
                      <p className="text-xs text-[#52604d] leading-relaxed">
                        <span className="font-semibold text-[#15370d]">
                          Alamat:
                        </span>{" "}
                        {address}
                      </p>
                    )}

                    {/* Interactive OpenStreetMap preview iframe */}
                    <div className="overflow-hidden rounded-lg border border-[#e2e7df] shadow-inner h-44 w-full">
                      <iframe
                        title="Peta Lokasi Sampah"
                        width="100%"
                        height="100%"
                        className="border-0"
                        loading="lazy"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                          longitude - 0.015
                        }%2C${latitude - 0.015}%2C${longitude + 0.015}%2C${
                          latitude + 0.015
                        }&layer=mapnik&marker=${latitude}%2C${longitude}`}
                      />
                    </div>

                    {/* Action buttons when location is set */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#e2e7df]">
                      <button
                        type="button"
                        onClick={getLocation}
                        disabled={locationLoading}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#d1d8cd] bg-white px-3 py-1.5 text-xs font-semibold text-[#15370d] hover:bg-[#edf1eb] transition-colors"
                      >
                        {locationLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5" />
                        )}
                        {locationLoading
                          ? "Mendeteksi ulang GPS..."
                          : "Perbarui via GPS"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setLocationMode(
                            locationMode === "preset" ? "gps" : "preset"
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#d1d8cd] bg-white px-3 py-1.5 text-xs font-semibold text-[#52604d] hover:bg-[#edf1eb] transition-colors"
                      >
                        Pilih Wilayah Lain
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setLocationMode(
                            locationMode === "search" ? "gps" : "search"
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#d1d8cd] bg-white px-3 py-1.5 text-xs font-semibold text-[#52604d] hover:bg-[#edf1eb] transition-colors"
                      >
                        Cari Tempat Lain
                      </button>
                    </div>
                  </div>
                ) : (
                  /* When no location is selected yet */
                  <div className="space-y-3">
                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#edf1eb] p-1 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setLocationMode("gps")}
                        className={cn(
                          "rounded-lg py-2 transition-colors",
                          locationMode === "gps"
                            ? "bg-white text-[#15370d] shadow-sm"
                            : "text-[#52604d] hover:text-[#15370d]"
                        )}
                      >
                        GPS Otomatis
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocationMode("preset")}
                        className={cn(
                          "rounded-lg py-2 transition-colors",
                          locationMode === "preset"
                            ? "bg-white text-[#15370d] shadow-sm"
                            : "text-[#52604d] hover:text-[#15370d]"
                        )}
                      >
                        Pilih Wilayah Bali
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocationMode("search")}
                        className={cn(
                          "rounded-lg py-2 transition-colors",
                          locationMode === "search"
                            ? "bg-white text-[#15370d] shadow-sm"
                            : "text-[#52604d] hover:text-[#15370d]"
                        )}
                      >
                        Cari Alamat / Tempat
                      </button>
                    </div>

                    {/* Mode 1: GPS Browser */}
                    {locationMode === "gps" && (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={getLocation}
                          disabled={locationLoading}
                          className="w-full flex items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-[#c5cfbf] bg-white py-4 text-sm font-semibold text-[#15370d] hover:border-[#266210] hover:bg-[#edf1eb] disabled:opacity-60 transition-colors shadow-sm"
                        >
                          {locationLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-[#266210]" />
                          ) : (
                            <Crosshair className="h-5 w-5 text-[#266210]" />
                          )}
                          {locationLoading
                            ? "Mendeteksi posisi GPS..."
                            : "Deteksi Lokasi GPS Saat Ini"}
                        </button>
                        <p className="text-[11px] text-[#52604d] text-center">
                          Catatan: Pada laptop/PC, posisi browser mengacu pada
                          jaringan WiFi/ISP. Jika tidak sesuai, silakan gunakan tab
                          <strong> &quot;Pilih Wilayah Bali&quot;</strong> atau
                          <strong> &quot;Cari Alamat&quot;</strong>.
                        </p>
                      </div>
                    )}

                    {/* Mode 2: Quick Bali Region Presets */}
                    {locationMode === "preset" && (
                      <div className="rounded-xl border border-[#e2e7df] bg-white p-4 space-y-2.5">
                        <p className="text-xs font-semibold text-[#15370d]">
                          Pilih Kabupaten / Kota Laporan di Bali:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.keys(BALI_REGION_PRESETS).map((reg) => (
                            <button
                              key={reg}
                              type="button"
                              onClick={() => selectRegionPreset(reg)}
                              className="flex items-center gap-2 rounded-lg border border-[#e2e7df] bg-[#f5f7f4] px-3 py-2 text-left text-xs font-medium text-[#141b12] hover:border-[#266210] hover:bg-[#edf1eb] transition-colors"
                            >
                              <MapPin className="h-3.5 w-3.5 text-[#266210] flex-shrink-0" />
                              <span className="truncate">{reg}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mode 3: Search Location in Bali */}
                    {locationMode === "search" && (
                      <div className="rounded-xl border border-[#e2e7df] bg-white p-4 space-y-3">
                        <p className="text-xs font-semibold text-[#15370d]">
                          Ketik nama tempat, pantai, pasar, atau jalan di Bali:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                searchLocation();
                              }
                            }}
                            placeholder="Contoh: Pantai Kuta, Ubud Monkey Forest, Sanur..."
                            className="flex-1 rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-3.5 py-2.5 text-xs text-[#141b12] placeholder:text-[#9ca896] focus:border-[#266210] outline-none"
                          />
                          <button
                            type="button"
                            onClick={searchLocation}
                            disabled={searching}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#266210] hover:bg-[#347f18] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60 transition-colors shadow-sm"
                          >
                            {searching ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Search className="h-4 w-4" />
                            )}
                            Cari
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-panels for manual override if location is already set */}
                {latitude !== null && longitude !== null && locationMode === "preset" && (
                  <div className="rounded-xl border border-[#e2e7df] bg-white p-4 space-y-2">
                    <p className="text-xs font-semibold text-[#15370d]">
                      Pilih Wilayah Bali Lainnya:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Object.keys(BALI_REGION_PRESETS).map((reg) => (
                        <button
                          key={reg}
                          type="button"
                          onClick={() => selectRegionPreset(reg)}
                          className="flex items-center gap-2 rounded-lg border border-[#e2e7df] bg-[#f5f7f4] px-3 py-2 text-left text-xs font-medium text-[#141b12] hover:border-[#266210] hover:bg-[#edf1eb] transition-colors"
                        >
                          <MapPin className="h-3.5 w-3.5 text-[#266210] flex-shrink-0" />
                          <span className="truncate">{reg}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {latitude !== null && longitude !== null && locationMode === "search" && (
                  <div className="rounded-xl border border-[#e2e7df] bg-white p-4 space-y-3">
                    <p className="text-xs font-semibold text-[#15370d]">
                      Cari Tempat Baru di Bali:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            searchLocation();
                          }
                        }}
                        placeholder="Contoh: Pantai Sanur, Pasar Badung..."
                        className="flex-1 rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-3.5 py-2.5 text-xs text-[#141b12] placeholder:text-[#9ca896] focus:border-[#266210] outline-none"
                      />
                      <button
                        type="button"
                        onClick={searchLocation}
                        disabled={searching}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#266210] hover:bg-[#347f18] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-60 transition-colors"
                      >
                        {searching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        Cari
                      </button>
                    </div>
                  </div>
                )}

                {/* Feedback notifications */}
                {locationSuccessMsg && (
                  <p className="flex items-center gap-1.5 text-xs text-[#266210]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {locationSuccessMsg}
                  </p>
                )}

                {locationError && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{locationError}</p>
                  </div>
                )}

                {/* Manual coordinate toggle */}
                <details className="text-xs text-[#52604d]">
                  <summary className="cursor-pointer font-semibold text-[#15370d] hover:underline">
                    Input / Edit Angka Koordinat Manual
                  </summary>
                  <div className="mt-2 grid grid-cols-2 gap-3 p-3 bg-[#f5f7f4] rounded-xl border border-[#e2e7df]">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#15370d] mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={latitude ?? ""}
                        onChange={(e) =>
                          setLatitude(
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value)
                          )
                        }
                        placeholder="-8.4095"
                        className="w-full rounded-lg border border-[#d1d8cd] bg-white px-3 py-2 text-xs text-[#141b12] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#15370d] mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={longitude ?? ""}
                        onChange={(e) =>
                          setLongitude(
                            e.target.value === ""
                              ? null
                              : parseFloat(e.target.value)
                          )
                        }
                        placeholder="115.1889"
                        className="w-full rounded-lg border border-[#d1d8cd] bg-white px-3 py-2 text-xs text-[#141b12] outline-none"
                      />
                    </div>
                  </div>
                </details>
              </div>

              {/* Address text */}
              <div>
                <label className="block text-xs font-semibold text-[#15370d] mb-1.5">
                  Alamat Lengkap / Patokan Lokasi
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Contoh: Jl. Pantai Kuta No. 12, Badung, Bali (dekat pos penjaga)"
                  className="w-full rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] px-4 py-3 text-sm text-[#141b12] placeholder:text-[#9ca896] focus:border-[#266210] focus:ring-2 focus:ring-[#266210]/20 outline-none transition-colors"
                />
              </div>

              {/* Submit error message */}
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
                    Menyimpan Laporan...
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
                Terima kasih atas partisipasi Anda. Laporan Anda berhasil dicatat
                dan diteruskan untuk penanganan oleh instansi terkait di Bali.
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

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
