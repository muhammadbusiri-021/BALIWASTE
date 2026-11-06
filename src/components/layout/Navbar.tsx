// src/components/layout/Navbar.tsx
import Link from "next/link";
import { Trash2, MapPin, BarChart3, AlertCircle, ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                BALI<span className="text-emerald-600">WASTE</span>
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                AI Powered
              </span>
            </div>
            <p className="text-[11px] text-gray-500 leading-none">Bali Waste Intelligence System</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link
            href="/lapor"
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
          >
            <AlertCircle className="h-4 w-4 text-emerald-500" />
            Lapor Sampah
          </Link>
          <Link
            href="/hotspot"
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
          >
            <MapPin className="h-4 w-4 text-emerald-500" />
            Peta Hotspot
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
          >
            <BarChart3 className="h-4 w-4 text-emerald-500" />
            Environmental Dashboard
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/lapor"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all"
          >
            Unggah Laporan
          </Link>
        </div>
      </div>
    </header>
  );
}
