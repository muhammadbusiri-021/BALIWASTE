// src/components/layout/Navbar.tsx
import Link from "next/link";
import { MapPin, BarChart3, AlertCircle } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e2e7df] bg-[#f5f7f4]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand - Clean Typography without trash icon */}
        <Link href="/" className="flex flex-col group">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-[#15370d] group-hover:text-[#266210] transition-colors">
              BALI<span className="text-[#266210]">WASTE</span>
            </span>
            <span className="rounded bg-[#eaf2e8] px-2 py-0.5 text-[10px] font-semibold text-[#15370d] border border-[#d6e4d2]">
              INTELLIGENCE
            </span>
          </div>
          <span className="text-[10px] font-medium tracking-wide text-[#52604d] -mt-0.5">
            Sistem Informasi Pengelolaan Sampah Bali
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#52604d]">
          <Link
            href="/lapor"
            className="flex items-center gap-1.5 hover:text-[#15370d] transition-colors"
          >
            <AlertCircle className="h-4 w-4 text-[#266210]" />
            Lapor Sampah
          </Link>
          <Link
            href="/hotspot"
            className="flex items-center gap-1.5 hover:text-[#15370d] transition-colors"
          >
            <MapPin className="h-4 w-4 text-[#266210]" />
            Peta Hotspot
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 hover:text-[#15370d] transition-colors"
          >
            <BarChart3 className="h-4 w-4 text-[#266210]" />
            Environmental Dashboard
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/lapor"
            className="inline-flex items-center justify-center rounded-lg bg-[#266210] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#15370d] transition-colors"
          >
            Unggah Laporan
          </Link>
        </div>
      </div>
    </header>
  );
}
