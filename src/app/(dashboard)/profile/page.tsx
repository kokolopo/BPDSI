"use client";

import { useAuthStore } from "@/stores/auth.store";
import { ROLE_PERMISSIONS } from "@/lib/permissions/permissions";
import { UserCircle, Mail, Phone, MapPin, Building, Briefcase } from "lucide-react";
import type { RoleId } from "@/types";

const roleLabels: Record<RoleId, string> = {
  super_admin: "Super Admin",
  administrator: "Administrator",
  pengurus_pusat: "Pengurus Pusat",
  pengurus_wilayah: "Pengurus Wilayah",
  pengurus_cabang: "Pengurus Cabang",
  bendahara: "Bendahara",
  operator: "Operator",
  anggota: "Anggota",
};

export default function ProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return <div>Memuat profil...</div>;
  }

  const permissions = ROLE_PERMISSIONS[user.role] || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Profil Pengguna</h1>
        <p className="mt-1 text-sm text-zinc-500">Informasi akun dan akses sistem Anda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 text-center flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 dark:bg-blue-900/30 dark:text-blue-400">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
            ) : (
              <UserCircle className="h-16 w-16" />
            )}
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{user.name}</h2>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-4">{roleLabels[user.role] || user.role}</p>
          
          <div className="w-full border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-500">Status</span>
              <span className="font-semibold text-emerald-600">Aktif</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">ID Anggota</span>
              <span className="font-semibold text-zinc-900 dark:text-white">ADM-001</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 border-b border-zinc-100 pb-3 dark:border-zinc-800">
            Informasi Detail
          </h3>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500 dark:bg-zinc-800"><Mail className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Email</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500 dark:bg-zinc-800"><Phone className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Telepon</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">0812-3456-7890</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500 dark:bg-zinc-800"><Building className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Penempatan (Cabang)</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Pusat / Nasional</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500 dark:bg-zinc-800"><Briefcase className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Departemen</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Pengurus Inti DPP</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:col-span-2">
              <div className="p-2 bg-zinc-100 rounded-lg text-zinc-500 dark:bg-zinc-800"><MapPin className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Alamat</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Gedung BPDSI Pusat, Jl. Jend. Sudirman Kav 21, Jakarta Selatan</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Hak Akses Sistem</h4>
            <div className="flex flex-wrap gap-2">
              {permissions.slice(0, 5).map(perm => (
                <span key={perm} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
                  {perm}
                </span>
              ))}
              {permissions.length > 5 && (
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700">
                  +{permissions.length - 5} lainnya
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
