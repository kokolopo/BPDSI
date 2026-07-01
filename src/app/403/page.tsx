"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-8">
          <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-500" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-2">
          403 Forbidden
        </h1>
        
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Maaf, Anda tidak memiliki hak akses (permission) untuk membuka halaman ini. 
          Silakan hubungi administrator jika Anda merasa ini adalah sebuah kesalahan.
        </p>

        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
