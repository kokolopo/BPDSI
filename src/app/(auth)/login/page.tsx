"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { APP_NAME, APP_FULL_NAME } from "@/constants/menu";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await AuthService.login({ email, password });

      if (response.success && response.user) {
        setUser(response.user);
        router.push("/dashboard");
      } else {
        setError(response.message || "Login gagal.");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Decorative */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:items-center lg:justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-blue-950 to-indigo-950">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/images/bpdsi.png" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/80 via-blue-950/70 to-indigo-950/80" />
        </div>

        <div className="relative z-10 max-w-lg px-12 text-center">
          {/* Logo */}
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-600/30">
            <span className="text-3xl font-bold text-white">SP</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            {APP_NAME}
          </h1>
          <p className="mb-8 text-lg text-blue-200/70">
            {APP_FULL_NAME}
          </p>

          {/* Feature list */}
          <div className="space-y-4 text-left">
            {[
              "Manajemen data anggota yang komprehensif",
              "Pengelolaan iuran dan keuangan terintegrasi",
              "Sistem surat-menyurat digital",
              "Dashboard analitik real-time",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                </div>
                <span className="text-sm text-zinc-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-6 text-center text-xs text-zinc-600">
          © 2024 Serikat Pekerja Indonesia. All rights reserved.
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex w-full items-center justify-center bg-white px-6 dark:bg-zinc-900 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-600/20">
              <span className="text-xl font-bold text-white">SP</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {APP_NAME}
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Selamat Datang
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Masukkan email dan password untuk melanjutkan
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-11 pr-12 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-zinc-300 bg-white text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800"
                />
                Ingat saya
              </label>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-500"
              >
                Lupa password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>

            <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Daftar sekarang
              </Link>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Demo Credentials
            </p>
            <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <p>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Email:</span>{" "}
                superadmin@example.com
              </p>
              <p>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Password:</span>{" "}
                password123
              </p>
            </div>

            <div className="mt-4 mb-4 h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <p>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Email:</span>{" "}
                anggota@example.com
              </p>
              <p>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Password:</span>{" "}
                password123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
