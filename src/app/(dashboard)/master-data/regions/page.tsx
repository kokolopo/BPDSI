"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RegionService } from "@/services/region.service";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { MapPin, Map, Building } from "lucide-react";
import type { Province, District, Village, QueryParams } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "province" | "district" | "village";

export default function RegionsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("province");
  const [params, setParams] = useState<QueryParams>({ page: 1, pageSize: 10 });

  const { data: provincesData, isLoading: loadProv } = useQuery({
    queryKey: ["provinces", params, activeTab],
    queryFn: () => RegionService.getProvinces(params),
    enabled: activeTab === "province",
  });

  const { data: districtsData, isLoading: loadDist } = useQuery({
    queryKey: ["districts", params, activeTab],
    queryFn: () => RegionService.getDistricts(undefined, params),
    enabled: activeTab === "district",
  });

  const { data: villagesData, isLoading: loadVill } = useQuery({
    queryKey: ["villages", params, activeTab],
    queryFn: () => RegionService.getVillages(undefined, params),
    enabled: activeTab === "village",
  });

  // Fetch all provinces for district reference
  const { data: allProvinces } = useQuery({
    queryKey: ["all-provinces"],
    queryFn: () => RegionService.getProvinces({ pageSize: 100 }),
    enabled: activeTab === "district",
  });

  // Fetch all districts for village reference
  const { data: allDistricts } = useQuery({
    queryKey: ["all-districts"],
    queryFn: () => RegionService.getDistricts(undefined, { pageSize: 500 }),
    enabled: activeTab === "village",
  });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setParams({ page: 1, pageSize: 10 });
  };

  const provColumns: Column<Province>[] = [
    { key: "code", label: "Kode", sortable: true, render: (item) => <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.code}</span> },
    { key: "name", label: "Nama Provinsi", sortable: true, render: (item) => <span className="font-medium text-zinc-900 dark:text-white">{item.name}</span> },
  ];

  const distColumns: Column<District>[] = [
    { key: "id", label: "ID", sortable: true, render: (item) => <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.id}</span> },
    { key: "name", label: "Nama Kabupaten/Kota", sortable: true, render: (item) => <span className="font-medium text-zinc-900 dark:text-white">{item.name}</span> },
    { key: "provinceId", label: "Provinsi", sortable: true, render: (item) => {
      const provName = allProvinces?.data.find(p => p.id === item.provinceId)?.name;
      return <span className="text-zinc-600 dark:text-zinc-400">{provName || item.provinceId}</span>;
    }},
  ];

  const villColumns: Column<Village>[] = [
    { key: "id", label: "ID", sortable: true, render: (item) => <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.id}</span> },
    { key: "name", label: "Nama Kecamatan/Kelurahan", sortable: true, render: (item) => <span className="font-medium text-zinc-900 dark:text-white">{item.name}</span> },
    { key: "districtId", label: "Kabupaten/Kota", sortable: true, render: (item) => {
      const distName = allDistricts?.data.find(d => d.id === item.districtId)?.name;
      return <span className="text-zinc-600 dark:text-zinc-400">{distName || item.districtId}</span>;
    }},
  ];

  const tabs = [
    { id: "province", label: "Provinsi", icon: MapPin },
    { id: "district", label: "Kabupaten/Kota", icon: Map },
    { id: "village", label: "Kelurahan/Kecamatan", icon: Building },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Wilayah</h1>
        <p className="mt-1 text-sm text-zinc-500">Lihat data referensi wilayah administrasi (Read-only)</p>
      </div>

      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "province" && (
        <DataTable
          columns={provColumns}
          data={provincesData?.data || []}
          total={provincesData?.total || 0}
          page={provincesData?.page || 1}
          pageSize={provincesData?.pageSize || 10}
          totalPages={provincesData?.totalPages || 0}
          isLoading={loadProv}
          searchPlaceholder="Cari provinsi..."
          onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
          onPageChange={(page) => setParams((p) => ({ ...p, page }))}
          onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
          onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        />
      )}

      {activeTab === "district" && (
        <DataTable
          columns={distColumns}
          data={districtsData?.data || []}
          total={districtsData?.total || 0}
          page={districtsData?.page || 1}
          pageSize={districtsData?.pageSize || 10}
          totalPages={districtsData?.totalPages || 0}
          isLoading={loadDist}
          searchPlaceholder="Cari kabupaten/kota..."
          onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
          onPageChange={(page) => setParams((p) => ({ ...p, page }))}
          onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
          onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        />
      )}

      {activeTab === "village" && (
        <DataTable
          columns={villColumns}
          data={villagesData?.data || []}
          total={villagesData?.total || 0}
          page={villagesData?.page || 1}
          pageSize={villagesData?.pageSize || 10}
          totalPages={villagesData?.totalPages || 0}
          isLoading={loadVill}
          searchPlaceholder="Cari kelurahan/kecamatan..."
          onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
          onPageChange={(page) => setParams((p) => ({ ...p, page }))}
          onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
          onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        />
      )}
    </div>
  );
}
