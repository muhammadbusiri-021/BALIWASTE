// src/lib/ai.ts
import { GoogleGenAI, Type } from "@google/genai";
import { WasteClassificationResult, WasteHandlingRecommendationResult } from "@/types";

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum dikonfigurasi di environment variables.");
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Analisis gambar sampah menggunakan Gemini Vision API
 */
export async function classifyWasteImage(
  imageBase64: string,
  mimeType = "image/jpeg"
): Promise<WasteClassificationResult> {
  const ai = getAiClient();

  // Bersihkan data URL prefix jika ada
  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  const prompt = `
Anda adalah sistem AI Waste Classifier untuk Pulau Bali (BALIWASTE).
Analisis foto sampah ini secara cermat dan berikan output dalam format JSON terstruktur.

Kategori yang harus dipilih salah satu:
- "organik" (sisa makanan, dedaunan, ranting, limbah upacara/banten organik)
- "anorganik_plastik" (kantong plastik, botol plastik, kresek, bungkus sachet)
- "anorganik_kertas" (kardus, kertas, karton)
- "anorganik_logam" (kaleng, besi, kawat, seng)
- "anorganik_kaca" (botol kaca, pecahan beling)
- "b3_berbahaya" (baterai, limbah medis, kaleng pestisida, elektronik, bahan kimia)
- "campuran_tidak_teridentifikasi" (tumpukan campur aduk atau tidak jelas)

Tentukan tingkat keparahan (severity):
- "low": tumpukan kecil, tidak menyumbat jalan/selokan, tidak berbahaya
- "medium": volume sedang di pinggir jalan / area publik
- "high": tumpukan besar mencemari sungai, pantai, jalan raya utama, atau tumpukan liar
- "critical": tumpukan sangat masif, memicu banjir, atau limbah berbahaya B3 dekat pemukiman/sumber air

Aturan confidence: nilai angka desimal antara 0.0 sampai 1.0. Jika di bawah 0.60, tandai needsVerification = true.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "Kategori sampah (salah satu dari kategori di atas)",
            },
            categoryLabel: {
              type: Type.STRING,
              description: "Label manusiawi bahasa Indonesia untuk kategori",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Skor keyakinan deteksi (0.00 - 1.00)",
            },
            detectedItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar benda spesifik yang terdeteksi dalam foto",
            },
            estimatedVolume: {
              type: Type.STRING,
              description: "Estimasi volume (contoh: '1-2 kantong plastik', '1 meter kubik', 'tumpukan muatan pikap')",
            },
            severity: {
              type: Type.STRING,
              description: "Tingkat keparahan: low, medium, high, atau critical",
            },
            notes: {
              type: Type.STRING,
              description: "Catatan analisis visual mengenai kondisi sampah dan lingkungan sekitarnya di Bali",
            },
            needsVerification: {
              type: Type.BOOLEAN,
              description: "True jika confidence < 0.60 atau visual meragukan",
            },
          },
          required: [
            "category",
            "categoryLabel",
            "confidence",
            "detectedItems",
            "severity",
            "notes",
            "needsVerification",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI tidak menghasilkan teks respon");
    }

    const parsed = JSON.parse(text) as WasteClassificationResult;
    return parsed;
  } catch (error) {
    console.error("Gemini Vision classification failed:", error);
    const detail = error instanceof Error ? error.message : "Terjadi kesalahan";
    throw new Error(`Gagal melakukan klasifikasi gambar sampah: ${detail}`);
  }
}

/**
 * Buat rekomendasi penanganan sampah cerdas (Smart Waste Handling Recommendation)
 */
export async function generateWasteRecommendation(params: {
  wasteType: string;
  severity: string;
  address?: string;
  notes?: string;
}): Promise<WasteHandlingRecommendationResult> {
  const ai = getAiClient();

  const prompt = `
Anda adalah sistem AI pakar pengelolaan sampah wilayah Provinsi Bali (Smart Waste Handling Engine).
Berdasarkan data laporan sampah berikut:
- Jenis Sampah: ${params.wasteType}
- Tingkat Keparahan: ${params.severity}
- Alamat / Lokasi: ${params.address || "Wilayah Bali"}
- Catatan Visual: ${params.notes || "Tidak ada catatan"}

Berikan rekomendasi penanganan taktis yang tepat sasaran, berbasis regulasi persampahan Bali (misal Pergub Bali No 97/2018 tentang Pembatasan Timbulan Sampah Plastik Sekali Pakai & Pergub Bali No 47/2019 tentang Pengelolaan Sampah Berbasis Sumber).

Sebutkan instansi terkait yang berwenang (misal DLHK Kabupaten/Kota, Bank Sampah Unit, TPS3R Desa Adat/Kelurahan, Dinas PU).
Berikan output JSON terstruktur.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: {
              type: Type.STRING,
              description: "Prioritas: Tinggi, Sedang, atau Rendah",
            },
            handlingMethod: {
              type: Type.STRING,
              description: "Metode penanganan utama (contoh: Pemilahan dan pengangkutan terpilah ke TPS3R)",
            },
            resourcesNeeded: {
              type: Type.STRING,
              description: "Sumber daya yang dibutuhkan (truk armroll, pickup, petugas tim kebersihan, karung, dsb)",
            },
            assignedAgency: {
              type: Type.STRING,
              description: "Instansi atau pihak penanggung jawab (contoh: DLHK Kota Denpasar / Satgas TPS3R Desa)",
            },
            actionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Langkah-langkah tindakan berurutan dari penanganan lapangan",
            },
            safetyNotes: {
              type: Type.STRING,
              description: "Peringatan keselamatan petugas (misal penggunaan APD, sarung tangan tebal, masker)",
            },
          },
          required: [
            "priority",
            "handlingMethod",
            "resourcesNeeded",
            "assignedAgency",
            "actionSteps",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI tidak menghasilkan rekomendasi");
    }

    const parsed = JSON.parse(text) as WasteHandlingRecommendationResult;
    return parsed;
  } catch (error) {
    console.error("Gemini recommendation failed:", error);
    const detail = error instanceof Error ? error.message : "Terjadi kesalahan";
    throw new Error(`Gagal menghasilkan rekomendasi penanganan sampah: ${detail}`);
  }
}
