"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BranchService } from "@/services/branch.service";
import { RegionService } from "@/services/region.service";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { Modal, ConfirmDialog } from "@/components/shared/modal";
import { STATUS_COLORS } from "@/constants/menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Branch, QueryParams } from "@/types";

export default function BranchesPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, pageSize: 10 });
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [formData, setFormData] = useState({
    name: "", code: "", address: "", phone: "", email: "", headName: "", provinceId: "",
    totalMembers: 0, isActive: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["branches", params],
    queryFn: () => BranchService.getAll(params),
  });

  const { data: provincesData } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => RegionService.getProvinces({ pageSize: 100 }), // Get all provinces
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Branch, "id" | "createdAt" | "updatedAt">) => BranchService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["branches"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Branch> }) => BranchService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["branches"] }); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => BranchService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["branches"] }); setShowDelete(false); },
  });

  const resetForm = () => {
    setFormData({ name: "", code: "", address: "", phone: "", email: "", headName: "", provinceId: "", totalMembers: 0, isActive: true });
    setSelectedBranch(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setFormData({ name: branch.name, code: branch.code, address: branch.address, phone: branch.phone, email: branch.email, headName: branch.headName, provinceId: branch.provinceId, totalMembers: branch.totalMembers, isActive: branch.isActive });
    setShowForm(true);
  };
  const openDetail = (branch: Branch) => { setSelectedBranch(branch); setShowDetail(true); };
  const openDelete = (branch: Branch) => { setSelectedBranch(branch); setShowDelete(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBranch) {
      updateMutation.mutate({ id: selectedBranch.id, data: formData });
    } else {
      createMutation.mutate(formData as Omit<Branch, "id" | "createdAt" | "updatedAt">);
    }
  };

  const columns: Column<Branch>[] = [
    { key: "code", label: "Kode", sortable: true, render: (item) => <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.code}</span> },
    { key: "name", label: "Nama Cabang", sortable: true, render: (item) => (
      <div>
        <p className="font-medium text-zinc-900 dark:text-white">{item.name}</p>
        <p className="text-xs text-zinc-500">{provincesData?.data.find(p => p.id === item.provinceId)?.name || item.provinceId}</p>
      </div>
    )},
    { key: "headName", label: "Kepala Cabang" },
    { key: "totalMembers", label: "Anggota", sortable: true, render: (item) => <span className="font-semibold text-blue-500">{item.totalMembers.toLocaleString("id-ID")}</span> },
    { key: "isActive", label: "Status", render: (item) => (
      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${item.isActive ? STATUS_COLORS.active : STATUS_COLORS.inactive}`}>
        {item.isActive ? "Aktif" : "Non-aktif"}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Cabang</h1>
        <p className="mt-1 text-sm text-zinc-500">Kelola data cabang organisasi di berbagai wilayah</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={data?.page || 1}
        pageSize={data?.pageSize || 10}
        totalPages={data?.totalPages || 0}
        isLoading={isLoading}
        searchPlaceholder="Cari cabang..."
        onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
        onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        onAdd={openCreate}
        addLabel="Tambah Cabang"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openDetail(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-500 dark:hover:bg-zinc-800"><Eye className="h-4 w-4" /></button>
            <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-amber-500 dark:hover:bg-zinc-800"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => openDelete(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"><Trash2 className="h-4 w-4" /></button>
          </div>
        )}
      />

      {/* Create/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={selectedBranch ? "Edit Cabang" : "Tambah Cabang"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kode Cabang *</label>
              <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Cabang *</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Alamat *</label>
              <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required rows={2} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Provinsi *</label>
              <select value={formData.provinceId} onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
                <option value="">Pilih Provinsi</option>
                {provincesData?.data.map((prov) => (
                  <option key={prov.id} value={prov.id}>{prov.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kepala Cabang *</label>
              <input value={formData.headName} onChange={(e) => setFormData({ ...formData, headName: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Telepon *</label>
              <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Total Anggota</label>
              <input type="number" value={formData.totalMembers} onChange={(e) => setFormData({ ...formData, totalMembers: Number(e.target.value) })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4 rounded border-zinc-300 text-blue-600" />
              <label htmlFor="isActive" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Aktif</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">Batal</button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60">
              {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detail Cabang" size="lg">
        {selectedBranch && (
          <div className="space-y-4">
            {[
              { label: "Kode", value: selectedBranch.code },
              { label: "Nama", value: selectedBranch.name },
              { label: "Alamat", value: selectedBranch.address },
              { label: "Provinsi", value: provincesData?.data.find(p => p.id === selectedBranch.provinceId)?.name || selectedBranch.provinceId },
              { label: "Kepala Cabang", value: selectedBranch.headName },
              { label: "Telepon", value: selectedBranch.phone },
              { label: "Email", value: selectedBranch.email },
              { label: "Total Anggota", value: selectedBranch.totalMembers.toLocaleString("id-ID") },
              { label: "Status", value: selectedBranch.isActive ? "Aktif" : "Non-aktif" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <span className="w-32 shrink-0 text-sm text-zinc-500">{item.label}</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => selectedBranch && deleteMutation.mutate(selectedBranch.id)}
        title="Hapus Cabang"
        message={`Apakah Anda yakin ingin menghapus cabang "${selectedBranch?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
