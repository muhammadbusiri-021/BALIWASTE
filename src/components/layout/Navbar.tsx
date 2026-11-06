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

  useEffect(() => {
    const handleScroll = () => {
      // Mirip gaya koperasi-utm.com: aktifkan state scrolled saat scroll > 50px
      if (window.scrollY > 50) {
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
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#e2e7df] shadow-sm py-3.5"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand: Clean Typography, dinamik transisi warna seperti koperasi-utm.com */}
        <Link href="/" className="group flex items-center">
          <span
            className={`text-2xl sm:text-[26px] font-black tracking-tight transition-colors duration-300 ${
              isScrolled ? "text-[#15370d]" : "text-white"
            }`}
          >
            BALI
            <span
              className={`font-extrabold transition-colors duration-300 ${
                isScrolled ? "text-[#266210]" : "text-[#65da3c]"
              }`}
            >
              WASTE
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-9 text-sm font-semibold transition-colors duration-300 ${
            isScrolled ? "text-[#52604d]" : "text-white/90"
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
                    ? isScrolled
                      ? "text-[#15370d] font-bold border-b-2 border-[#266210]"
                      : "text-[#65da3c] font-bold border-b-2 border-[#65da3c]"
                    : isScrolled
                    ? "hover:text-[#15370d]"
                    : "hover:text-[#65da3c]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive
                      ? isScrolled
                        ? "text-[#266210]"
                        : "text-[#65da3c]"
                      : isScrolled
                      ? "text-[#52604d]"
                      : "text-white/70"
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
              isScrolled
                ? "bg-[#266210] hover:bg-[#15370d] text-white shadow-emerald-900/10"
                : "bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 shadow-black/20"
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors ${
              isScrolled
                ? "text-[#15370d] hover:bg-gray-100"
                : "text-white hover:bg-white/10"
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

      {/* Mobile Drawer / Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-6 py-5 shadow-xl animate-in slide-in-from-top-2 duration-200 transition-colors ${
            isScrolled
              ? "bg-white border-[#e2e7df]"
              : "bg-[#15370d]/95 backdrop-blur-xl border-[#266210]/40 text-white"
          }`}
        >
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
                    isScrolled
                      ? isActive
                        ? "bg-[#eaf2e8] text-[#15370d]"
                        : "text-[#52604d] hover:bg-gray-50 hover:text-[#15370d]"
                      : isActive
                      ? "bg-[#266210] text-white"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isScrolled ? "text-[#266210]" : "text-[#65da3c]"
                    }`}
                  />
                  {link.label}
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
