// src/components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, BarChart3, AlertCircle, Menu, X, PlusCircle } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Header transparan hanya di halaman beranda (Home) ketika belum di-scroll DAN menu mobile sedang tertutup.
  // Saat menu mobile dibuka, header & dropdown otomatis berlatar putih solid/bersih agar warna tidak tabrakan dan terbaca jelas.
  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled && !mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/lapor", label: "Lapor Sampah", icon: AlertCircle },
    { href: "/hotspot", label: "Peta Hotspot", icon: MapPin },
    { href: "/dashboard", label: "Environmental Dashboard", icon: BarChart3 },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isTransparent
          ? "bg-transparent border-b border-transparent py-5"
          : "bg-white/95 backdrop-blur-md border-b border-[#e2e7df] shadow-sm py-3.5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand: Clean Typography with Poppins */}
        <Link href="/" className="group flex items-center">
          <span
            className={`text-2xl sm:text-[26px] font-black tracking-tight transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-[#15370d]"
            }`}
          >
            BALI
            <span
              className={`font-extrabold transition-colors duration-300 ${
                isTransparent ? "text-[#65da3c]" : "text-[#266210]"
              }`}
            >
              WASTE
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-9 text-sm font-semibold transition-colors duration-300 ${
            isTransparent ? "text-white/90" : "text-[#52604d]"
          }`}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 py-1 transition-all duration-200 ${
                  isActive
                    ? isTransparent
                      ? "text-[#65da3c] font-bold border-b-2 border-[#65da3c]"
                      : "text-[#15370d] font-bold border-b-2 border-[#266210]"
                    : isTransparent
                    ? "hover:text-[#65da3c]"
                    : "hover:text-[#15370d]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive
                      ? isTransparent
                        ? "text-[#65da3c]"
                        : "text-[#266210]"
                      : isTransparent
                      ? "text-white/70"
                      : "text-[#52604d]"
                  }`}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/lapor"
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 shadow-sm ${
              isTransparent
                ? "bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 shadow-black/20"
                : "bg-[#266210] hover:bg-[#15370d] text-white shadow-emerald-900/10"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            Unggah Laporan
          </Link>
        </div>

        {/* Mobile Hamburger / Close Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors ${
              isTransparent
                ? "text-white hover:bg-white/10"
                : "text-[#15370d] hover:bg-gray-100"
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu (Kembali ke Bentuk Awal Dropdown dengan Warna Bersih & Serasi) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e2e7df] bg-white/98 backdrop-blur-md px-6 py-5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#eaf2e8] text-[#15370d]"
                      : "text-[#52604d] hover:bg-gray-50 hover:text-[#15370d]"
                  }`}
                >
                  <Icon className="h-5 w-5 text-[#266210]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-2">
              <Link
                href="/lapor"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#266210] hover:bg-[#15370d] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Unggah Laporan Sampah
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
