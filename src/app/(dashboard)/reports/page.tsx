"use client";

import { useState } from "react";
import { Download, FileBarChart2, Loader2, FileSpreadsheet, Users, Wallet } from "lucide-react";
import { randomDelay } from "@/lib/utils";

const REPORT_TYPES = [
  { id: "members", name: "Laporan Data Anggota", icon: Users, description: "Demografi anggota, status keaktifan, sebaran wilayah dan perusahaan." },
  { id: "payments", name: "Laporan Rekap Iuran", icon: Wallet, description: "Pemasukan iuran per bulan, tunggakan, dan status pembayaran anggota." },
  { id: "mutations", name: "Laporan Mutasi", icon: FileBarChart2, description: "Rekap perpindahan anggota antar cabang dan perusahaan." },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("members");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [branch, setBranch] = useState("all");
  
  const [isGenerating, setIsGenerating] = useState<{ pdf: boolean, excel: boolean }>({ pdf: false, excel: false });

  const handleDownload = async (format: "pdf" | "excel") => {
    setIsGenerating(prev => ({ ...prev, [format]: true }));
    try {
      await randomDelay(1500, 3000); // Simulate processing time
      alert(`Berhasil mengunduh laporan dalam format ${format.toUpperCase()}`);
    } catch {
      alert("Gagal mengunduh laporan");
    } finally {
      setIsGenerating(prev => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Laporan & Statistik</h1>
        <p className="mt-1 text-sm text-zinc-500">Cetak dan unduh laporan operasional serikat pekerja</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        
        {/* Sidebar - Report Type Selection */}
        <div className="space-y-2">
          {REPORT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className={`flex w-full flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
                selectedReport === type.id
                  ? "border-blue-500 bg-blue-50/50 shadow-sm dark:border-blue-500/50 dark:bg-blue-900/10"
                  : "border-zinc-200 bg-white hover:border-blue-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${selectedReport === type.id ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                  <type.icon className="h-5 w-5" />
                </div>
                <h3 className={`font-semibold ${selectedReport === type.id ? "text-blue-900 dark:text-blue-100" : "text-zinc-700 dark:text-zinc-300"}`}>
                  {type.name}
                </h3>
              </div>
              <p className={`text-xs ${selectedReport === type.id ? "text-blue-600 dark:text-blue-300" : "text-zinc-500 dark:text-zinc-400"}`}>
                {type.description}
              </p>
            </button>
          ))}
        </div>

        {/* Content - Filters and Action */}
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <h2 className="mb-6 text-lg font-bold text-zinc-900 dark:text-white border-b border-zinc-100 pb-4 dark:border-zinc-800">
            Parameter Laporan
          </h2>
          
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tanggal Mulai</label>
                <input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({...p, start: e.target.value}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tanggal Akhir</label>
                <input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({...p, end: e.target.value}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Cabang</label>
              <select value={branch} onChange={e => setBranch(e.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                <option value="all">Semua Cabang (Nasional)</option>
                <option value="BR001">Cabang Jakarta</option>
                <option value="BR002">Cabang Bandung</option>
                <option value="BR003">Cabang Surabaya</option>
              </select>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={() => handleDownload("excel")}
                disabled={isGenerating.excel || isGenerating.pdf}
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40 disabled:opacity-60"
              >
                {isGenerating.excel ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                Export Excel
              </button>
              <button
                onClick={() => handleDownload("pdf")}
                disabled={isGenerating.excel || isGenerating.pdf}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 disabled:opacity-60"
              >
                {isGenerating.pdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Unduh PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
