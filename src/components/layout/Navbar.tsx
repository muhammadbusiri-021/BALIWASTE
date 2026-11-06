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

  // Header hanya boleh transparan di halaman beranda (Home) ketika belum di-scroll.
  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled;

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

  // Kunci scroll halaman saat menu mobile terbuka agar tidak bertabrakan
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/lapor", label: "Lapor Sampah", icon: AlertCircle },
    { href: "/hotspot", label: "Peta Hotspot", icon: MapPin },
    { href: "/dashboard", label: "Environmental Dashboard", icon: BarChart3 },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ease-in-out ${
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

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors ${
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-[#15370d] hover:bg-gray-100"
              }`}
              aria-label="Buka Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Immersive Menu (Menyatu Sempurna dengan Background Awal) */}
      {mobileMenuOpen && (
        <div
          className={`fixed inset-0 z-50 md:hidden flex flex-col justify-between px-6 py-6 transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isTransparent
              ? "bg-[#15370d]/90 backdrop-blur-2xl text-white"
              : "bg-white/98 backdrop-blur-2xl text-[#141b12]"
          }`}
        >
          {/* Header Dalam Menu: Logo & Tombol Tutup (X) */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center"
            >
              <span
                className={`text-2xl font-black tracking-tight ${
                  isTransparent ? "text-white" : "text-[#15370d]"
                }`}
              >
                BALI
                <span
                  className={`font-extrabold ${
                    isTransparent ? "text-[#65da3c]" : "text-[#266210]"
                  }`}
                >
                  WASTE
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className={`rounded-xl p-2.5 transition-colors ${
                isTransparent
                  ? "text-white hover:bg-white/15 bg-white/10 border border-white/15"
                  : "text-[#15370d] hover:bg-gray-100 bg-gray-50 border border-gray-200"
              }`}
              aria-label="Tutup Menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Nav Links: Berjarak Luas, Rapi, Tanpa Memotong Teks Hero */}
          <div className="flex flex-col space-y-3 my-auto py-8">
            <span
              className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                isTransparent ? "text-[#65da3c]" : "text-[#266210]"
              }`}
            >
              Navigasi Platform
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-semibold transition-all ${
                    isTransparent
                      ? isActive
                        ? "bg-white/20 text-[#65da3c] border border-white/25"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                      : isActive
                      ? "bg-[#eaf2e8] text-[#15370d]"
                      : "text-[#52604d] hover:bg-gray-50 hover:text-[#15370d]"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isTransparent ? "text-[#65da3c]" : "text-[#266210]"
                    }`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Tombol Aksi di Bawah */}
          <div
            className={`pt-5 border-t ${
              isTransparent ? "border-white/10" : "border-gray-200"
            }`}
          >
            <Link
              href="/lapor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#266210] hover:bg-[#347f18] px-4 py-4 text-base font-semibold text-white shadow-lg transition-all border border-[#48bb22]/30 active:scale-[0.98]"
            >
              <PlusCircle className="h-5 w-5" />
              Unggah Laporan Sampah
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
