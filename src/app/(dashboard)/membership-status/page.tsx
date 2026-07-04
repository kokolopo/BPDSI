"use client";

import { useAuthStore } from "@/stores/auth.store";
import { members } from "@/data/members";
import { companies } from "@/data/companies";
import { branches } from "@/data/branches";
import {
  BadgeCheck,
  Building2,
  Calendar,
  Clock,
  ShieldAlert,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function MembershipStatusPage() {
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
          Anda belum melengkapi data keanggotaan. Silakan lakukan registrasi keanggotaan terlebih dahulu.
        </p>
        <Link href="/registration" className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30">
          Registrasi Keanggotaan Sekarang
        </Link>
      </div>
    );
  }

  const company = companies.find((c) => c.id === member.companyId);
  const branch = branches.find((b) => b.id === member.branchId);

  const isActive = member.status === "active";
  const statusLabel = member.status === "pending" ? "MENUNGGU PERSETUJUAN" : member.status.toUpperCase();
  const joinDate = new Date(member.joinDate);
  const now = new Date();
  
  // Calculate membership duration in years and months
  const diffTime = Math.abs(now.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Status Keanggotaan</h1>
        <p className="mt-1 text-sm text-zinc-500">Informasi detail status dan data keanggotaan Anda</p>
      </div>

      {/* Status Banner */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 ${
        isActive 
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20" 
          : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20"
      }`}>
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            isActive ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
          }`}>
            {isActive ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
          </div>
          <div>
            <h2 className={`text-lg font-bold ${
              isActive ? "text-emerald-800 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"
            }`}>
              Status: {isActive ? "AKTIF" : statusLabel}
            </h2>
            <p className={`text-sm ${
              isActive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            }`}>
              {isActive 
                ? "Keanggotaan Anda aktif. Anda berhak mendapatkan semua fasilitas dan perlindungan organisasi."
                : "Keanggotaan Anda sedang dalam peninjauan atau tidak aktif."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Detail Keanggotaan */}
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-blue-500" />
            Identitas Anggota
          </h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium text-zinc-500">Nomor Registrasi (NIA)</dt>
              <dd className="mt-1 text-sm font-semibold text-zinc-900 dark:text-white">{member.registrationNumber}</dd>
            </div>
            <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <dt className="text-xs font-medium text-zinc-500">Nama Lengkap</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">{member.name}</dd>
            </div>
            <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <dt className="text-xs font-medium text-zinc-500">NIK / No. KTP</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">{member.nik}</dd>
            </div>
            <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <dt className="text-xs font-medium text-zinc-500">Tempat, Tanggal Lahir</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
                {member.placeOfBirth}, {new Date(member.dateOfBirth).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </dd>
            </div>
          </dl>
        </div>

        {/* Data Pekerjaan & Durasi */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              Penempatan
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-medium text-zinc-500">Perusahaan</dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">{company?.name || "-"}</dd>
              </div>
              <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <dt className="text-xs font-medium text-zinc-500">Cabang BPDSI</dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">{branch?.name || "-"}</dd>
              </div>
              <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <dt className="text-xs font-medium text-zinc-500">Jabatan Pekerjaan</dt>
                <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">{member.position}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Masa Keanggotaan
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Tergabung sejak {joinDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                </p>
                <p className="text-xs text-zinc-500">
                  Total masa keanggotaan: {years} Tahun {months} Bulan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/50 bg-zinc-50 p-4 dark:border-zinc-800/50 dark:bg-zinc-900/50">
        <div className="flex gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Jika terdapat ketidaksesuaian data identitas maupun data pekerjaan, silakan ajukan perubahan data melalui menu Pengaturan Akun atau hubungi pengurus cabang Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
