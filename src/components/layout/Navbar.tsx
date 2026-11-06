// src/components/layout/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, BarChart3, AlertCircle, Menu, X, PlusCircle } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/lapor", label: "Lapor Sampah", icon: AlertCircle },
    { href: "/hotspot", label: "Peta Hotspot", icon: MapPin },
    { href: "/dashboard", label: "Environmental Dashboard", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e2e7df] bg-[#f5f7f4]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        {/* Brand: Clean Typography BALIWASTE without clutter */}
        <Link href="/" className="group flex items-center">
          <span className="text-2xl font-extrabold tracking-tight text-[#15370d] group-hover:opacity-90 transition-opacity">
            BALI<span className="text-[#266210]">WASTE</span>
          </span>
        </Link>

        {/* Desktop Navigation Links - Spacious Spacing */}
        <nav className="hidden md:flex items-center gap-9 text-sm font-semibold text-[#52604d]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 py-1 transition-colors ${
                  isActive
                    ? "text-[#15370d] font-bold border-b-2 border-[#266210]"
                    : "hover:text-[#15370d]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#266210]" : "text-[#52604d]"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/lapor"
            className="inline-flex items-center gap-2 rounded-xl bg-[#266210] px-4.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#15370d] transition-colors"
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
            className="inline-flex items-center justify-center rounded-lg p-2 text-[#15370d] hover:bg-[#eaf2e8] focus:outline-none transition-colors"
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
        <div className="md:hidden border-t border-[#e2e7df] bg-[#f5f7f4] px-6 py-5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#eaf2e8] text-[#15370d]"
                      : "text-[#52604d] hover:bg-[#edf1eb] hover:text-[#15370d]"
                  }`}
                >
                  <Icon className="h-5 w-5 text-[#266210]" />
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-2">
              <Link
                href="/lapor"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#266210] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#15370d] transition-colors"
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
