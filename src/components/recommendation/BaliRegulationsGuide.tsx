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
            Landasan Hukum &amp; Regulasi Pengelolaan Sampah Bali
          </h2>
          <p className="text-xs text-[#52604d]">
            Setiap rekomendasi penanganan AI BALIWASTE diselaraskan dengan peraturan gubernur dan kearifan lokal desa adat
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
        {/* Card Pergub 97/2018 */}
        <div className="rounded-xl border border-[#e2e7df] bg-[#f5f7f4] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#266210] text-white font-bold text-xs">
              Pergub Bali No. 97 / 2018
            </span>
            <span className="text-xs font-bold text-[#15370d]">
              Pembatasan Plastik Sekali Pakai
            </span>
          </div>

          <p className="text-[#52604d] leading-relaxed text-xs">
            Peraturan Gubernur yang melarang peredaran dan penggunaan 3 jenis plastik sekali pakai di seluruh kawasan Pulau Bali: kantong plastik kresek, styrofoam, dan sedotan plastik.
          </p>

          <div className="space-y-2 pt-2 border-t border-[#d1d8cd]">
            <p className="font-bold text-[#15370d] text-xs">
              Implementasi pada AI BALIWASTE:
            </p>
            <ul className="space-y-1.5 text-xs text-[#141b12]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#266210] flex-shrink-0 mt-0.5" />
                <span>Deteksi otomatis botol PET, sedotan, kresek, dan styrofoam sebagai kategori anorganik terlarang.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#266210] flex-shrink-0 mt-0.5" />
                <span>Disposisi penanganan langsung ke Bank Sampah Unit dan mitra daur ulang untuk menekan masuknya plastik ke TPA.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Card Pergub 47/2019 */}
        <div className="rounded-xl border border-[#e2e7df] bg-[#f5f7f4] p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#15370d] text-white font-bold text-xs">
              Pergub Bali No. 47 / 2019
            </span>
            <span className="text-xs font-bold text-[#15370d]">
              Pengelolaan Berbasis Sumber
            </span>
          </div>

          <p className="text-[#52604d] leading-relaxed text-xs">
            Mandat pengelolaan sampah berbasis sumber di tingkat rumah tangga, desa dinas, dan desa adat (Banjar) melalui operasional fasilitas Tempat Pengolahan Sampah Reuse-Reduce-Recycle (TPS3R).
          </p>

          <div className="space-y-2 pt-2 border-t border-[#d1d8cd]">
            <p className="font-bold text-[#15370d] text-xs">
              Implementasi pada AI BALIWASTE:
            </p>
            <ul className="space-y-1.5 text-xs text-[#141b12]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#266210] flex-shrink-0 mt-0.5" />
                <span>Rekomendasi alokasi sampah organik sisa upacara/pasar langsung ke fasilitas komposter dan budidaya maggot BSF TPS3R terdekat.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#266210] flex-shrink-0 mt-0.5" />
                <span>Integrasi peran Pecalang dan Prajuru Desa Adat dalam pengawasan serta sosialisasi jadwal pembuangan sampah terpilah.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
