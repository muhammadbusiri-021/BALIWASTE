// src/components/recommendation/BaliRegulationsGuide.tsx
"use client";

import {
  FileText,
  ShieldCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Leaf,
  Layers,
} from "lucide-react";

export default function BaliRegulationsGuide() {
  return (
    <div className="rounded-2xl border border-[#e2e7df] bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#edf1eb]">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#266210] text-white">
          <Scale className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#15370d]">
            Landasan Hukum &amp; Regulasi Pengelolaan Sampah Pulau Madura
          </h2>
          <p className="text-xs text-[#52604d]">
            Setiap rekomendasi penanganan AI MADURAWASTE diselaraskan dengan peraturan daerah 4 kabupaten dan program TPS3R Jawa Timur
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
        {/* Card Perda Bangkalan & Sampang */}
        <div className="rounded-xl border border-[#e2e7df] bg-[#f5f7f4] p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#266210] text-white font-bold text-xs">
              Perda Kab. Bangkalan No. 5 / 2016
            </span>
            <span className="text-xs font-bold text-[#15370d]">
              &amp; Perda Kab. Sampang No. 2 / 2014
            </span>
          </div>

          <p className="text-[#52604d] leading-relaxed text-xs">
            Regulasi perlindungan kawasan pesisir, muara, dan aliran sungai (termasuk kawasan vital Kali Kemuning &amp; koridor Jembatan Suramadu) dari timbulan sampah liar dan pembuangan anorganik ilegal.
          </p>

          <div className="space-y-2 pt-2 border-t border-[#d1d8cd]">
            <p className="font-bold text-[#15370d] text-xs">
              Implementasi pada AI MADURAWASTE:
            </p>
            <ul className="space-y-1.5 text-xs text-[#141b12]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#266210] flex-shrink-0 mt-0.5" />
                <span>Deteksi otomatis sumbatan jaring trash barrier sungai dan pesisir untuk mencegah luapan banjir pasang.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#266210] flex-shrink-0 mt-0.5" />
                <span>Disposisi penanganan darurat langsung ke Satgas DLH Bangkalan &amp; Tim TRC PUPR Sampang.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card Perda Pamekasan & Sumenep */}
        <div className="rounded-xl border border-[#e2e7df] bg-[#f5f7f4] p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#15370d] text-white font-bold text-xs">
              Perda Kab. Pamekasan No. 3 / 2019
            </span>
            <span className="text-xs font-bold text-[#15370d]">
              &amp; Perda Kab. Sumenep No. 6 / 2015
            </span>
          </div>

          <p className="text-[#52604d] leading-relaxed text-xs">
            Mandat pengelolaan sampah berbasis sumber di tingkat pasar rakyat, desa pesisir, dan dermaga penyeberangan pulau melalui operasional fasilitas Tempat Pengolahan Sampah Reuse-Reduce-Recycle (TPS3R).
          </p>

          <div className="space-y-2 pt-2 border-t border-[#d1d8cd]">
            <p className="font-bold text-[#15370d] text-xs">
              Implementasi pada AI MADURAWASTE:
            </p>
            <ul className="space-y-1.5 text-xs text-[#141b12]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#266210] flex-shrink-0 mt-0.5" />
                <span>Rekomendasi alokasi sampah organik pasar (Kolpajung &amp; Anom Baru) langsung ke fasilitas komposter dan budidaya maggot BSF.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#266210] flex-shrink-0 mt-0.5" />
                <span>Pengelolaan terpilah residu plastik pelabuhan antarpulau Kalianget dan sentra perikanan PPI Branta.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
