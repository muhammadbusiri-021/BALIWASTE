// src/components/layout/Footer.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#e2e7df] bg-[#edf1eb] py-12 text-[#52604d]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-extrabold tracking-tight text-[#15370d]">
                BALI<span className="text-[#266210]">WASTE</span>
              </span>
            </Link>
            <p className="mt-3 max-w-md text-sm text-[#52604d] leading-relaxed">
              Sistem informasi cerdas berbasis Artificial Intelligence untuk pemantauan, pelaporan,
              pemetaan hotspot, dan rekomendasi penanganan timbulan sampah di seluruh wilayah Bali.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#15370d]">Navigasi Sistem</h3>
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

          {/* Regulatory Context */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#15370d]">Landasan Kebijakan</h3>
            <ul className="mt-3 space-y-2 text-xs text-[#52604d] leading-relaxed">
              <li>Pergub Bali No. 97/2018 (Pembatasan Timbulan Sampah Plastik)</li>
              <li>Pergub Bali No. 47/2019 (Pengelolaan Sampah Berbasis Sumber)</li>
              <li>Visi Pembangunan: Nangun Sat Kerthi Loka Bali</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#dce3d8] pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#52604d] gap-4">
          <p>© 2026 Tim BALIWASTE. Hak cipta dilindungi.</p>
          <p className="font-medium text-[#15370d]">
            Inisiatif Digital untuk Kelestarian Lingkungan Bali
          </p>
        </div>
      </div>
    </footer>
  );
}
