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
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[#15370d]/95 backdrop-blur-md border-b border-[#266210]/40 shadow-lg py-3.5"
          : "bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
        {/* Brand: Clean Typography with Poppins, Unified with Video Background */}
        <Link href="/" className="group flex items-center">
          <span className="text-2xl sm:text-[26px] font-black tracking-tight text-white group-hover:opacity-90 transition-opacity">
            BALI<span className="text-[#65da3c] font-extrabold">WASTE</span>
          </span>
        </Link>

        {/* Desktop Navigation Links - Vibrant, Crisp Contrast against Video */}
        <nav className="hidden md:flex items-center gap-9 text-sm font-semibold text-white/85">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 py-1 transition-colors ${
                  isActive
                    ? "text-[#65da3c] font-bold border-b-2 border-[#65da3c]"
                    : "hover:text-[#65da3c]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#65da3c]" : "text-white/70"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/lapor"
            className="inline-flex items-center gap-2 rounded-xl bg-[#266210] hover:bg-[#347f18] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-black/20 border border-[#48bb22]/40 transition-all"
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
            className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#266210]/40 bg-[#15370d]/95 backdrop-blur-xl px-6 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
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
                      ? "bg-[#266210] text-white"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 text-[#65da3c]" />
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2">
              <Link
                href="/lapor"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#266210] hover:bg-[#347f18] px-4 py-3 text-sm font-semibold text-white shadow-sm border border-[#48bb22]/40 transition-colors"
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
