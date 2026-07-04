"use client";

import { useAuthStore } from "@/stores/auth.store";
import { announcements } from "@/data/announcements";
import { members } from "@/data/members";
import { payments } from "@/data/payments";
import {
  Bell,
  CreditCard,
  FileText,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Megaphone
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function MemberDashboard() {
  const { user } = useAuthStore();
  const member = members.find((m) => m.email === user?.email);

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/50 bg-white py-16 px-6 text-center shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">Status Keanggotaan Belum Terdaftar</h2>
        <p className="mb-6 max-w-md text-sm text-zinc-500">
          Akun Anda telah berhasil dibuat, namun data keanggotaan Anda belum lengkap. Silakan lakukan registrasi keanggotaan untuk mendapatkan fasilitas BPDSI.
        </p>
        <Link href="/registration" className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30">
          Registrasi Keanggotaan Sekarang
        </Link>
      </div>
    );
  }

  const myPayments = payments.filter((p) => p.memberId === member.id);
  
  const lastPayment = myPayments[0]; // Assuming sorted descending
  const recentAnnouncements = announcements.slice(0, 3);

  const isActive = member.status === "active";
  const statusLabel = member.status === "pending" ? "MENUNGGU PERSETUJUAN" : member.status.toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Selamat datang, {user?.name}!</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Berikut ringkasan keanggotaan Anda di BPDSI
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Status Card */}
        <div className={`col-span-full md:col-span-2 rounded-2xl border p-6 ${
          isActive 
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20" 
            : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20"
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isActive ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
              }`}>
                {isActive ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Status Keanggotaan: {isActive ? "AKTIF" : statusLabel}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Nomor Registrasi (NIA): <span className="font-semibold">{member.registrationNumber}</span>
                </p>
              </div>
            </div>
            <Link
              href="/membership-status"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Lihat Detail <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Quick Payment Status */}
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">Status Iuran</h3>
          </div>
          <div className="mt-4">
            <p className="text-sm text-zinc-500">Iuran Terakhir</p>
            {lastPayment ? (
              <>
                <p className="text-xl font-bold text-zinc-900 dark:text-white mt-1">
                  {formatCurrency(lastPayment.amount)}
                </p>
                <p className="text-xs text-zinc-500">
                  Periode: Bulan {lastPayment.periodMonth} {lastPayment.periodYear} 
                  <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    lastPayment.status === "verified" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  }`}>
                    {lastPayment.status}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-sm font-medium mt-1">Belum ada riwayat iuran</p>
            )}
          </div>
          <Link
            href="/my-payment"
            className="mt-4 inline-block text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Lihat Riwayat &rarr;
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Menu */}
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Akses Cepat</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/member-card"
              className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-800/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Kartu Anggota</span>
            </Link>
            <Link
              href="/my-documents"
              className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-800/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Dokumen Saya</span>
            </Link>
            <Link
              href="/my-letters"
              className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-800/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Surat & Pengajuan</span>
            </Link>
            <Link
              href="/announcements"
              className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-800/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                <Megaphone className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Pengumuman</span>
            </Link>
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" /> Pengumuman Terbaru
            </h3>
            <Link href="/announcements" className="text-xs font-medium text-blue-500 hover:text-blue-600">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-4">
            {recentAnnouncements.map((ann) => (
              <div key={ann.id} className="group flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <Megaphone className="h-4 w-4 text-zinc-500 group-hover:text-amber-500 transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white line-clamp-1">{ann.title}</h4>
                  <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">{ann.content}</p>
                  <p className="mt-1 text-[10px] text-zinc-400">
                    {new Date(ann.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
