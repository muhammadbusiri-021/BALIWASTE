// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("Email atau kata sandi tidak sesuai. Silakan periksa kembali.");
      } else {
        router.push("/rekomendasi");
        router.refresh();
      }
    } catch {
      setErrorMsg("Terjadi kendala autentikasi. Silakan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] flex flex-col justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#15370d] text-white shadow-md">
            <ShieldCheck className="h-6 w-6 text-[#65da3c]" />
          </div>
        </div>
        <h2 className="mt-5 text-center text-2xl sm:text-3xl font-black tracking-tight text-[#15370d]">
          Portal Masuk Petugas &amp; Penilai
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-[#52604d]">
          Sistem Verifikasi &amp; Disposisi Penanganan MADURAWASTE
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#e2e7df] rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#15370d]"
              >
                Alamat Email Kedinasan / Akun
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52604d]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@instansi.id"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] text-[#141b12] placeholder-[#9ca896] focus:border-[#266210] focus:ring-2 focus:ring-[#266210]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#15370d]"
              >
                Kata Sandi
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52604d]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#d1d8cd] bg-[#f5f7f4] text-[#141b12] placeholder-[#9ca896] focus:border-[#266210] focus:ring-2 focus:ring-[#266210]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-xs sm:text-sm font-semibold text-white bg-[#266210] hover:bg-[#15370d] focus:outline-none transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memverifikasi Akses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#edf1eb] text-center">
            <p className="text-[11px] text-[#52604d]">
              Sistem Terbuka untuk Publik • Penilaian Terpadu 4 Kabupaten Madura
            </p>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs font-semibold text-[#266210]">
              <Link href="/lapor" className="hover:underline">
                Pelaporan Sampah
              </Link>
              <span>•</span>
              <Link href="/hotspot" className="hover:underline">
                Peta Hotspot
              </Link>
              <span>•</span>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
