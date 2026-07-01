"use client";

import { useAuthStore } from "@/stores/auth.store";
import { letters } from "@/data/letters";
import { members } from "@/data/members";
import { Mail, Download, Eye, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function MyLettersPage() {
  const { user } = useAuthStore();
  const member = members.find((m) => m.email === user?.email) || members[0];
  
  // Filter letters that might be relevant to a member
  // In a real app this would filter by member ID as recipient
  const myLetters = letters.slice(0, 5).map(l => ({
    ...l,
    receiver: member.name
  }));

  const [activeTab, setActiveTab] = useState<"inbox" | "requests">("inbox");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Surat Saya</h1>
          <p className="mt-1 text-sm text-zinc-500">Pesan masuk dan pengajuan surat dari/ke pengurus</p>
        </div>
        <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Ajukan Surat
        </button>
      </div>

      <div className="flex space-x-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/50 sm:w-fit">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "inbox"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          <Mail className="h-4 w-4" />
          Kotak Masuk
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "requests"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          Pengajuan Saya
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-zinc-900/80">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {activeTab === "inbox" ? (
            myLetters.map((letter) => (
              <div key={letter.id} className="p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                      <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-white">{letter.title}</h4>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{letter.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(letter.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                        <span>Dari: {letter.sender}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2 sm:self-center">
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
                      <Eye className="h-4 w-4" />
                    </button>
                    {letter.attachmentUrl && (
                      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Mail className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
              <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">Belum ada pengajuan</h3>
              <p className="mt-2 text-sm text-zinc-500">Anda belum pernah mengajukan surat atau permohonan ke pengurus.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
