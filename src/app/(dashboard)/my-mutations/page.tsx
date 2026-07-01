"use client";

import { useAuthStore } from "@/stores/auth.store";
import { ArrowRightLeft, FileText, Download } from "lucide-react";

export default function MyMutationsPage() {
  const { user } = useAuthStore();

  // Dummy mutation history data for demo
  const mutations = [
    {
      id: "MUT001",
      date: "2024-03-15",
      type: "Mutasi Cabang",
      from: "DPC Jakarta Pusat",
      to: "DPC Jakarta Selatan",
      reason: "Pindah unit kerja perusahaan",
      status: "approved",
      approvedBy: "Ketua DPD DKI Jakarta"
    },
    {
      id: "MUT002",
      date: "2023-01-10",
      type: "Pendaftaran Anggota",
      from: "-",
      to: "DPC Jakarta Pusat",
      reason: "Pendaftaran awal",
      status: "approved",
      approvedBy: "Ketua DPC Jakarta Pusat"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Riwayat Mutasi</h1>
        <p className="mt-1 text-sm text-zinc-500">Rekam jejak perpindahan keanggotaan antar cabang</p>
      </div>

      <div className="rounded-2xl border border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-zinc-900/80">
        <div className="border-b border-zinc-100 p-5 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Daftar Mutasi</h3>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {mutations.map((mutation) => (
            <div key={mutation.id} className="p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <ArrowRightLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 dark:text-white">{mutation.type}</h4>
                    <p className="text-xs text-zinc-500">{new Date(mutation.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                  mutation.status === "approved"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}>
                  {mutation.status === "approved" ? "Disetujui" : "Pending"}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900/50">
                <div>
                  <p className="text-xs text-zinc-500">Asal</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white mt-1">{mutation.from}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Tujuan</p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white mt-1">{mutation.to}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-zinc-500">Alasan</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{mutation.reason}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <div className="text-xs text-zinc-500">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Disetujui oleh:</span> {mutation.approvedBy}
                </div>
                <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  <Download className="h-3.5 w-3.5" />
                  SK Mutasi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
