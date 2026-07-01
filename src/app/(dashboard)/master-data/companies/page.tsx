"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanyService } from "@/services/company.service";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { Modal, ConfirmDialog } from "@/components/shared/modal";
import { STATUS_COLORS } from "@/constants/menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Company, QueryParams } from "@/types";

export default function CompaniesPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, pageSize: 10 });
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [formData, setFormData] = useState({
    name: "", address: "", phone: "", email: "", website: "", industry: "",
    totalEmployees: 0, totalMembers: 0, isActive: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["companies", params],
    queryFn: () => CompanyService.getAll(params),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Company, "id" | "createdAt" | "updatedAt">) => CompanyService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["companies"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) => CompanyService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["companies"] }); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CompanyService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["companies"] }); setShowDelete(false); },
  });

  const resetForm = useCallback(() => {
    setFormData({ name: "", address: "", phone: "", email: "", website: "", industry: "", totalEmployees: 0, totalMembers: 0, isActive: true });
    setSelectedCompany(null);
  }, []);

  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({ name: company.name, address: company.address, phone: company.phone, email: company.email, website: company.website || "", industry: company.industry, totalEmployees: company.totalEmployees, totalMembers: company.totalMembers, isActive: company.isActive });
    setShowForm(true);
  };
  const openDetail = (company: Company) => { setSelectedCompany(company); setShowDetail(true); };
  const openDelete = (company: Company) => { setSelectedCompany(company); setShowDelete(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCompany) {
      updateMutation.mutate({ id: selectedCompany.id, data: formData });
    } else {
      createMutation.mutate(formData as Omit<Company, "id" | "createdAt" | "updatedAt">);
    }
  };

  const columns: Column<Company>[] = [
    { key: "name", label: "Nama Perusahaan", sortable: true, render: (item) => (
      <div>
        <p className="font-medium text-zinc-900 dark:text-white">{item.name}</p>
        <p className="text-xs text-zinc-500">{item.industry}</p>
      </div>
    )},
    { key: "address", label: "Alamat", render: (item) => <span className="text-xs">{item.address.length > 40 ? item.address.slice(0, 40) + "..." : item.address}</span> },
    { key: "totalEmployees", label: "Karyawan", sortable: true, render: (item) => item.totalEmployees.toLocaleString("id-ID") },
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
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Perusahaan</h1>
        <p className="mt-1 text-sm text-zinc-500">Kelola data perusahaan yang terdaftar dalam organisasi</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={data?.page || 1}
        pageSize={data?.pageSize || 10}
        totalPages={data?.totalPages || 0}
        isLoading={isLoading}
        searchPlaceholder="Cari perusahaan..."
        onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
        onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        onAdd={openCreate}
        addLabel="Tambah Perusahaan"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openDetail(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-500 dark:hover:bg-zinc-800"><Eye className="h-4 w-4" /></button>
            <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-amber-500 dark:hover:bg-zinc-800"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => openDelete(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"><Trash2 className="h-4 w-4" /></button>
          </div>
        )}
      />

      {/* Create/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={selectedCompany ? "Edit Perusahaan" : "Tambah Perusahaan"} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Perusahaan *</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Alamat *</label>
              <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required rows={2} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
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
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Website</label>
              <input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Industri *</label>
              <input value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Total Karyawan</label>
              <input type="number" value={formData.totalEmployees} onChange={(e) => setFormData({ ...formData, totalEmployees: Number(e.target.value) })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Total Anggota SP</label>
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
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detail Perusahaan" size="lg">
        {selectedCompany && (
          <div className="space-y-4">
            {[
              { label: "Nama", value: selectedCompany.name },
              { label: "Alamat", value: selectedCompany.address },
              { label: "Telepon", value: selectedCompany.phone },
              { label: "Email", value: selectedCompany.email },
              { label: "Website", value: selectedCompany.website || "-" },
              { label: "Industri", value: selectedCompany.industry },
              { label: "Total Karyawan", value: selectedCompany.totalEmployees.toLocaleString("id-ID") },
              { label: "Total Anggota SP", value: selectedCompany.totalMembers.toLocaleString("id-ID") },
              { label: "Status", value: selectedCompany.isActive ? "Aktif" : "Non-aktif" },
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
        onConfirm={() => selectedCompany && deleteMutation.mutate(selectedCompany.id)}
        title="Hapus Perusahaan"
        message={`Apakah Anda yakin ingin menghapus "${selectedCompany?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
