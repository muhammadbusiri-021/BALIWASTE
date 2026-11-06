// src/components/layout/ScrollProgress.tsx
"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3.5px] z-[9999] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#266210] via-[#48bb22] to-[#65da3c] transition-[width] duration-75 ease-out shadow-sm shadow-[#48bb22]/50"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
