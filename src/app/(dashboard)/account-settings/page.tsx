"use client";

import { useAuthStore } from "@/stores/auth.store";
import { members } from "@/data/members";
import { User, Lock, Bell, Shield, Smartphone } from "lucide-react";
import { useState } from "react";

export default function AccountSettingsPage() {
  const { user } = useAuthStore();
  const member = members.find((m) => m.email === user?.email) || members[0];
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Pengaturan Akun</h1>
        <p className="mt-1 text-sm text-zinc-500">Kelola informasi pribadi, keamanan, dan preferensi notifikasi</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full shrink-0 lg:w-64">
          <nav className="flex flex-row space-x-2 overflow-x-auto rounded-xl bg-white p-2 dark:bg-zinc-900 lg:flex-col lg:space-x-0 lg:space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <User className="h-4 w-4" />
              Profil Pribadi
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "security"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Shield className="h-4 w-4" />
              Keamanan Akun
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "notifications"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Bell className="h-4 w-4" />
              Notifikasi
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Informasi Pribadi</h3>
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Lengkap</label>
                    <input type="text" defaultValue={member.name} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white" disabled />
                    <p className="mt-1 text-xs text-zinc-500">Nama hanya bisa diubah melalui pengajuan ke cabang.</p>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
                    <input type="email" defaultValue={member.email} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">No. Handphone (WhatsApp)</label>
                  <input type="text" defaultValue={member.phone} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Alamat Lengkap</label>
                  <textarea rows={3} defaultValue={member.address} className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white"></textarea>
                </div>
                <div className="flex justify-end border-t border-zinc-100 pt-5 dark:border-zinc-800">
                  <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Ubah Password</h3>
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password Saat Ini</label>
                  <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password Baru</label>
                  <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Konfirmasi Password Baru</label>
                  <input type="password" placeholder="••••••••" className="w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-2.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:text-white" />
                </div>
                <div className="flex justify-end border-t border-zinc-100 pt-5 dark:border-zinc-800">
                  <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Autentikasi Dua Faktor (2FA)</h4>
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-6 w-6 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">Aplikasi Authenticator</p>
                      <p className="text-xs text-zinc-500">Gunakan Google Authenticator atau Authy</p>
                    </div>
                  </div>
                  <button className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    Aktifkan
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Preferensi Notifikasi</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Email Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">Pengingat Iuran Bulanan</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">Pengumuman Penting Organisasi</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">Update Status Surat / Mutasi</span>
                    </label>
                  </div>
                </div>
                
                <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">WhatsApp Notifications</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500" />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">Bukti Pembayaran Iuran</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500" />
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">Pesan dari Pengurus Cabang</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
