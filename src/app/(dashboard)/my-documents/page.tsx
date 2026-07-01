"use client";

import { useAuthStore } from "@/stores/auth.store";
import { members } from "@/data/members";
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";

interface DocItem {
  id: string;
  type: string;
  name: string;
  status: "verified" | "pending" | "missing";
  uploadDate?: string;
}

export default function MyDocumentsPage() {
  const { user } = useAuthStore();
  const member = members.find((m) => m.email === user?.email) || members[0];

  const [documents] = useState<DocItem[]>([
    { id: "1", type: "KTP", name: "KTP_" + member.name.replace(/\s+/g, "_") + ".jpg", status: "verified", uploadDate: "2024-01-15" },
    { id: "2", type: "Kartu Karyawan", name: "ID_Card_" + member.name.replace(/\s+/g, "_") + ".jpg", status: "verified", uploadDate: "2024-01-15" },
    { id: "3", type: "NPWP", name: "NPWP_" + member.name.replace(/\s+/g, "_") + ".pdf", status: "pending", uploadDate: "2024-03-10" },
    { id: "4", type: "KK (Kartu Keluarga)", name: "", status: "missing" },
    { id: "5", type: "BPJS Kesehatan", name: "BPJS_Kes.jpg", status: "verified", uploadDate: "2024-02-20" },
    { id: "6", type: "BPJS Ketenagakerjaan", name: "", status: "missing" },
    { id: "7", type: "Ijazah Terakhir", name: "Ijazah_S1.pdf", status: "verified", uploadDate: "2024-01-15" },
    { id: "8", type: "Surat Keterangan Kerja", name: "SK_Kerja.pdf", status: "pending", uploadDate: "2024-06-05" },
  ]);

  const verifiedCount = documents.filter((d) => d.status === "verified").length;
  const pendingCount = documents.filter((d) => d.status === "pending").length;
  const missingCount = documents.filter((d) => d.status === "missing").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dokumen Saya</h1>
        <p className="mt-1 text-sm text-zinc-500">Kelola berkas persyaratan keanggotaan Anda</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/50 bg-white p-4 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          <div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{verifiedCount}</p>
            <p className="text-xs text-zinc-500">Terverifikasi</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/50 bg-white p-4 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          <div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{pendingCount}</p>
            <p className="text-xs text-zinc-500">Menunggu Verifikasi</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/50 bg-white p-4 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <Upload className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{missingCount}</p>
            <p className="text-xs text-zinc-500">Belum Diunggah</p>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="rounded-2xl border border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-zinc-900/80">
        <div className="border-b border-zinc-100 p-5 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Daftar Dokumen</h3>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  doc.status === "verified"
                    ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : doc.status === "pending"
                    ? "bg-amber-100 dark:bg-amber-900/30"
                    : "bg-zinc-100 dark:bg-zinc-800"
                }`}>
                  {doc.status === "missing" ? (
                    <Upload className="h-5 w-5 text-zinc-400" />
                  ) : doc.name.endsWith(".pdf") ? (
                    <FileText className={`h-5 w-5 ${doc.status === "verified" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`} />
                  ) : (
                    <ImageIcon className={`h-5 w-5 ${doc.status === "verified" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{doc.type}</p>
                  {doc.name ? (
                    <p className="text-xs text-zinc-500">{doc.name}</p>
                  ) : (
                    <p className="text-xs italic text-red-400">Belum diunggah</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                  doc.status === "verified"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : doc.status === "pending"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {doc.status === "verified" ? "Terverifikasi" : doc.status === "pending" ? "Pending" : "Belum Upload"}
                </span>
                {doc.status !== "missing" && (
                  <button className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                {doc.status === "missing" && (
                  <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                    Upload
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
