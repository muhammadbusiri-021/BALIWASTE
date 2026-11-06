// src/components/providers/AOSProvider.tsx
"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export function AOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Tunda inisialisasi sedikit agar proses hidrasi React 19 selesai terlebih dahulu
    // Ini mencegah console error 'hydration mismatch'
    const timer = setTimeout(() => {
      AOS.init({
        duration: 750,
        easing: "ease-out-cubic",
        once: true,
        offset: 30,
        delay: 50,
      });
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
}
