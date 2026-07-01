"use client";

import { Database } from "lucide-react";

export default function MasterDataPage() {
  const items = [
    { title: "Perusahaan", description: "Kelola data perusahaan yang terdaftar", count: 15, href: "/master-data/companies" },
    { title: "Cabang", description: "Kelola data cabang organisasi", count: 20, href: "/master-data/branches" },
    { title: "Departemen", description: "Kelola data departemen", count: 45, href: "/master-data/departments" },
    { title: "Wilayah", description: "Data provinsi, kabupaten, dan kelurahan", count: 34, href: "/master-data/regions" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Master Data</h1>
        <p className="mt-1 text-sm text-zinc-500">Kelola data referensi sistem</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="group rounded-2xl border border-zinc-200/50 bg-white p-6 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 dark:border-zinc-800/50 dark:bg-zinc-900/80 dark:hover:border-blue-500/30"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
              <Database className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">{item.title}</h3>
            <p className="mt-1 text-sm text-zinc-500">{item.description}</p>
            <p className="mt-3 text-2xl font-bold text-zinc-900 dark:text-white">{item.count}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
