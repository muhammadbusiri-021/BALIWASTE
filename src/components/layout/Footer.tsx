// src/components/layout/Footer.tsx
import Link from "next/link";
import { ShieldCheck, ChevronRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#e2e7df] bg-[#edf1eb] py-12 text-[#52604d]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col - Clean typography, no trash icon */}
          <div className="md:col-span-2">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#15370d]">
                BALI<span className="text-[#266210]">WASTE</span>
              </span>
              <span className="text-xs text-[#52604d]">Bali Waste Intelligence System</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-[#52604d] leading-relaxed">
              Sistem informasi berbasis web yang memanfaatkan Artificial Intelligence (AI) untuk
              memantau dan mengelola permasalahan sampah di seluruh wilayah Bali melalui partisipasi
              masyarakat, computer vision, pemetaan hotspot, dan rekomendasi penanganan otomatis.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#eaf2e8] px-3 py-1.5 text-xs font-semibold text-[#15370d] border border-[#d6e4d2]">
              <ShieldCheck className="h-4 w-4 text-[#266210]" />
              <span>Bali DigiFest 2026 — AI Web Innovation Challenge</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#15370d]">Fitur Inti</h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              <li>
                <Link href="/lapor" className="inline-flex items-center gap-1.5 hover:text-[#15370d] transition-colors">
                  <ChevronRight className="h-3.5 w-3.5 text-[#266210]" />
                  Pelaporan Sampah (AI Vision)
                </Link>
              </li>
              <li>
                <Link href="/hotspot" className="inline-flex items-center gap-1.5 hover:text-[#15370d] transition-colors">
                  <ChevronRight className="h-3.5 w-3.5 text-[#266210]" />
                  Waste Hotspot Mapping
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="inline-flex items-center gap-1.5 hover:text-[#15370d] transition-colors">
                  <ChevronRight className="h-3.5 w-3.5 text-[#266210]" />
                  Environmental Impact Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Compliance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#15370d]">Regulasi & Dasar Hukum</h3>
            <ul className="mt-3 space-y-2 text-xs text-[#52604d]">
              <li>Pergub Bali No. 97 Tahun 2018 tentang Pembatasan Timbulan Sampah Plastik Sekali Pakai</li>
              <li>Pergub Bali No. 47 Tahun 2019 tentang Pengelolaan Sampah Berbasis Sumber di Desa/Kelurahan</li>
              <li>Visi Pembangunan Bali: Nangun Sat Kerthi Loka Bali</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#dce3d8] pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#52604d] gap-4">
          <p>© 2026 Tim BALIWASTE. Hak cipta dilindungi.</p>
          <p className="font-medium text-[#15370d]">
            Inovasi Digital untuk Bali Smart Society
          </p>
        </div>
      </div>
    </footer>
  );
}
