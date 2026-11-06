import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AOSProvider } from "@/components/providers/AOSProvider";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BALIWASTE — Bali Waste Intelligence System",
  description:
    "Platform pemantauan, pelaporan, analisis, dan rekomendasi penanganan sampah berbasis Artificial Intelligence untuk Bali Smart Society.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-[#f5f7f4] text-[#141b12] font-sans antialiased selection:bg-[#266210] selection:text-white"
        suppressHydrationWarning
      >
        <AOSProvider>
          {/* Top Scroll Progress Indicator */}
          <ScrollProgress />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AOSProvider>
      </body>
    </html>
  );
}
