"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuditService } from "@/services/audit.service";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { Activity, Search } from "lucide-react";
import type { QueryParams, AuditLog } from "@/types";
import { audits } from "@/data/audits";

const actionColors: Record<string, string> = {
  "Login": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "Failed Login": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  "Create": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  "Update": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  "Delete": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  "Approve": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  "Verify": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "Publish": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

export default function AuditLogPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, pageSize: 15 });

  const { data, isLoading } = useQuery({ 
    queryKey: ["audits", params], 
    queryFn: () => AuditService.getAll(params) 
  });

  const columns: Column<AuditLog>[] = [
    { key: "createdAt", label: "Waktu", sortable: true, render: (item) => (
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {new Date(item.createdAt).toLocaleString("id-ID", { 
          year: "numeric", month: "short", day: "numeric", 
          hour: "2-digit", minute: "2-digit", second: "2-digit"
        })}
      </span>
    )},
    { key: "user", label: "Pengguna", render: (item) => (
      <div>
        <p className="font-semibold text-zinc-900 dark:text-white">{item.userName}</p>
        <p className="text-xs text-zinc-500">IP: {item.ipAddress}</p>
      </div>
    )},
    { key: "module", label: "Modul", sortable: true, render: (item) => <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.module}</span> },
    { key: "action", label: "Aktivitas", sortable: true, render: (item) => (
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${actionColors[item.action] || "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"}`}>
        {item.action}
      </span>
    )},
    { key: "details", label: "Detail", render: (item) => <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.description}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Audit Log</h1>
          <p className="text-sm text-zinc-500">Rekam jejak aktivitas pengguna di dalam sistem BPDSI</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
        <DataTable
          columns={columns}
          data={data?.data || []}
          total={data?.total || 0}
          page={data?.page || 1}
          pageSize={data?.pageSize || 15}
          totalPages={data?.totalPages || 0}
          isLoading={isLoading}
          searchPlaceholder="Cari aktivitas, modul, atau pengguna..."
          onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
          onPageChange={(page) => setParams((p) => ({ ...p, page }))}
          onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
          onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        />
      </div>
    </div>
  );
}
