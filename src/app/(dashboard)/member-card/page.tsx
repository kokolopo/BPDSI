"use client";

import { useAuthStore } from "@/stores/auth.store";
import { members } from "@/data/members";
import { companies } from "@/data/companies";
import { branches } from "@/data/branches";
import {
  CreditCard,
  Download,
  Printer,
  Share2,
  QrCode,
  Shield,
} from "lucide-react";

export default function MemberCardPage() {
  const { user } = useAuthStore();

  // Simulate finding member data linked to current user
  const member = members.find((m) => m.email === user?.email) || members[0];
  const company = companies.find((c) => c.id === member.companyId);
  const branch = branches.find((b) => b.id === member.branchId);

  const isActive = member.status === "active";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Kartu Anggota Digital
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kartu identitas keanggotaan serikat pekerja Anda
        </p>
      </div>

      {/* Card */}
      <div className="mx-auto max-w-lg">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-2xl shadow-blue-600/30">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white" />
            <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <span className="text-sm font-bold">SP</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/70">SERIKAT PEKERJA</p>
                  <p className="text-sm font-bold">BPDSI Indonesia</p>
                </div>
              </div>
              <div className={`rounded-full px-3 py-1 text-xs font-bold ${isActive ? "bg-emerald-400/20 text-emerald-300" : "bg-red-400/20 text-red-300"}`}>
                {isActive ? "AKTIF" : member.status.toUpperCase()}
              </div>
            </div>

            {/* Photo & Info */}
            <div className="mt-6 flex gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <span className="text-3xl font-bold text-white/80">
                  {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-lg font-bold leading-tight">{member.name}</p>
                <p className="mt-1 text-sm text-white/70">No. Anggota</p>
                <p className="text-base font-semibold tracking-wider">{member.registrationNumber}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50">Perusahaan</p>
                <p className="text-xs font-medium">{company?.name || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50">Cabang</p>
                <p className="text-xs font-medium">{branch?.name || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50">Bergabung</p>
                <p className="text-xs font-medium">
                  {new Date(member.joinDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/50">Masa Berlaku</p>
                <p className="text-xs font-medium">31 Des 2025</p>
              </div>
            </div>

            {/* QR Code placeholder */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2">
                <QrCode className="h-full w-full text-zinc-800" />
              </div>
              <div className="text-right text-[10px] text-white/50">
                <p>ID: {member.id}</p>
                <p>Verified by BPDSI</p>
                <Shield className="ml-auto mt-1 h-4 w-4 text-emerald-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-900 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
            <Download className="h-5 w-5" />
            Download PDF
          </button>
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-900 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
            <Printer className="h-5 w-5" />
            Print
          </button>
          <button className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-blue-900 dark:hover:bg-blue-900/20 dark:hover:text-blue-400">
            <Share2 className="h-5 w-5" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
