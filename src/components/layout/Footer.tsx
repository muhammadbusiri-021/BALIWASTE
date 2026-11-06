// src/components/layout/Footer.tsx
import Link from "next/link";
import { Trash2, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-12 text-gray-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Trash2 className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                BALI<span className="text-emerald-600">WASTE</span>
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm text-gray-600 leading-relaxed">
              Bali Waste Intelligence System — Platform pemantauan, pelaporan, analisis citra, dan
              rekomendasi penanganan sampah berbasis Artificial Intelligence untuk menjaga kelestarian
              alam Pulau Dewata.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
              <span>Dibangun untuk</span>
              <strong>Bali DigiFest 2026 AI Web Innovation Challenge</strong>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Fitur Sistem</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/lapor" className="hover:text-emerald-600 transition-colors">
                  Pelaporan Sampah (AI Vision)
                </Link>
              </li>
              <li>
                <Link href="/hotspot" className="hover:text-emerald-600 transition-colors">
                  Waste Hotspot Mapping
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
                  Environmental Impact Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Compliance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">Landasan & Kebijakan</h3>
            <ul className="mt-3 space-y-2 text-xs text-gray-500">
              <li>Pergub Bali No. 97/2018 (Pembatasan Sampah Plastik)</li>
              <li>Pergub Bali No. 47/2019 (Pengelolaan Sampah Berbasis Sumber)</li>
              <li>Visi & Misi Nangun Sat Kerthi Loka Bali</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 Tim BALIWASTE. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for Bali Smart Society
          </p>
        </div>
      </div>
    </footer>
  );
}
