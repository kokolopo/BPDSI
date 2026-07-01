"use client";

import { useState } from "react";
import { Save, Bell, Shield, Database, Smartphone } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    appName: "BPDSI Admin Portal",
    iuranAmount: 50000,
    enableEmailNotif: true,
    enableSmsNotif: false,
    autoApproveMutations: false,
    sessionTimeout: 60,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Pengaturan berhasil disimpan.");
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "Umum", icon: Database },
    { id: "notifications", label: "Notifikasi", icon: Bell },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "system", label: "Sistem", icon: Smartphone },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Pengaturan Sistem</h1>
        <p className="mt-1 text-sm text-zinc-500">Konfigurasi aplikasi dan preferensi sistem BPDSI</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Menu */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
              }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-blue-700 dark:text-blue-400" : "text-zinc-400"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 p-6 md:p-8">
            
            {activeTab === "general" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Pengaturan Umum</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Aplikasi</label>
                      <input value={formData.appName} onChange={e => setFormData({...formData, appName: e.target.value})} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nominal Iuran Bulanan Default (Rp)</label>
                      <input type="number" value={formData.iuranAmount} onChange={e => setFormData({...formData, iuranAmount: Number(e.target.value)})} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Pengaturan Notifikasi</h2>
                  <div className="space-y-4 max-w-md">
                    <label className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Email Notifikasi</p>
                        <p className="text-xs text-zinc-500">Kirim pemberitahuan sistem via Email</p>
                      </div>
                      <input type="checkbox" checked={formData.enableEmailNotif} onChange={e => setFormData({...formData, enableEmailNotif: e.target.checked})} className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600" />
                    </label>
                    <label className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">SMS Notifikasi</p>
                        <p className="text-xs text-zinc-500">Kirim pemberitahuan penting via SMS</p>
                      </div>
                      <input type="checkbox" checked={formData.enableSmsNotif} onChange={e => setFormData({...formData, enableSmsNotif: e.target.checked})} className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Pengaturan Keamanan</h2>
                  <div className="space-y-4 max-w-md">
                    <label className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-700 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">Auto-approve Mutasi Internal</p>
                        <p className="text-xs text-zinc-500">Setujui otomatis jika mutasi dalam cabang yang sama</p>
                      </div>
                      <input type="checkbox" checked={formData.autoApproveMutations} onChange={e => setFormData({...formData, autoApproveMutations: e.target.checked})} className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600" />
                    </label>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Sesi Login (Menit)</label>
                      <input type="number" value={formData.sessionTimeout} onChange={e => setFormData({...formData, sessionTimeout: Number(e.target.value)})} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                      <p className="mt-1 text-xs text-zinc-500">Otomatis logout jika tidak ada aktivitas.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Informasi Sistem</h2>
                  <div className="space-y-3 text-sm max-w-md">
                    <div className="flex justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                      <span className="text-zinc-500">Versi Aplikasi</span>
                      <span className="font-medium text-zinc-900 dark:text-white">v1.0.0</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                      <span className="text-zinc-500">Database</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">Terhubung</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                      <span className="text-zinc-500">Terakhir Update</span>
                      <span className="font-medium text-zinc-900 dark:text-white">Hari ini, 09:00</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-60"
              >
                <Save className="h-4 w-4" /> {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
