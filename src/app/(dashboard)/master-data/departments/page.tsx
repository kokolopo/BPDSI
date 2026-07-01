"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DepartmentService } from "@/services/department.service";
import { CompanyService } from "@/services/company.service";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { Modal, ConfirmDialog } from "@/components/shared/modal";
import { STATUS_COLORS } from "@/constants/menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Department, QueryParams } from "@/types";

export default function DepartmentsPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, pageSize: 10 });
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [formData, setFormData] = useState({
    name: "", code: "", companyId: "", isActive: true,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["departments", params],
    queryFn: () => DepartmentService.getAll(params),
  });

  const { data: companiesData } = useQuery({
    queryKey: ["companies"],
    queryFn: () => CompanyService.getAll({ pageSize: 100 }), // Get all companies for dropdown
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Department, "id" | "createdAt" | "updatedAt">) => DepartmentService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["departments"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) => DepartmentService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["departments"] }); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => DepartmentService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["departments"] }); setShowDelete(false); },
  });

  const resetForm = () => {
    setFormData({ name: "", code: "", companyId: "", isActive: true });
    setSelectedDepartment(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({ name: department.name, code: department.code, companyId: department.companyId, isActive: department.isActive });
    setShowForm(true);
  };
  const openDetail = (department: Department) => { setSelectedDepartment(department); setShowDetail(true); };
  const openDelete = (department: Department) => { setSelectedDepartment(department); setShowDelete(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDepartment) {
      updateMutation.mutate({ id: selectedDepartment.id, data: formData });
    } else {
      createMutation.mutate(formData as Omit<Department, "id" | "createdAt" | "updatedAt">);
    }
  };

  const columns: Column<Department>[] = [
    { key: "code", label: "Kode", sortable: true, render: (item) => <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.code}</span> },
    { key: "name", label: "Nama Departemen", sortable: true, render: (item) => <span className="font-medium text-zinc-900 dark:text-white">{item.name}</span> },
    { key: "companyId", label: "Perusahaan", sortable: true, render: (item) => {
      const companyName = companiesData?.data.find(c => c.id === item.companyId)?.name;
      return <span className="text-zinc-600 dark:text-zinc-400">{companyName || item.companyId}</span>;
    }},
    { key: "isActive", label: "Status", render: (item) => (
      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${item.isActive ? STATUS_COLORS.active : STATUS_COLORS.inactive}`}>
        {item.isActive ? "Aktif" : "Non-aktif"}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Departemen</h1>
        <p className="mt-1 text-sm text-zinc-500">Kelola data departemen dalam perusahaan</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={data?.page || 1}
        pageSize={data?.pageSize || 10}
        totalPages={data?.totalPages || 0}
        isLoading={isLoading}
        searchPlaceholder="Cari departemen..."
        onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
        onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        onAdd={openCreate}
        addLabel="Tambah Departemen"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openDetail(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-500 dark:hover:bg-zinc-800"><Eye className="h-4 w-4" /></button>
            <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-amber-500 dark:hover:bg-zinc-800"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => openDelete(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"><Trash2 className="h-4 w-4" /></button>
          </div>
        )}
      />

      {/* Create/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={selectedDepartment ? "Edit Departemen" : "Tambah Departemen"} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kode Departemen *</label>
            <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Departemen *</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Perusahaan *</label>
            <select value={formData.companyId} onChange={(e) => setFormData({ ...formData, companyId: e.target.value })} required className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
              <option value="">Pilih Perusahaan</option>
              {companiesData?.data.map((comp) => (
                <option key={comp.id} value={comp.id}>{comp.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4 rounded border-zinc-300 text-blue-600" />
            <label htmlFor="isActive" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Aktif</label>
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
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detail Departemen" size="sm">
        {selectedDepartment && (
          <div className="space-y-4">
            {[
              { label: "Kode", value: selectedDepartment.code },
              { label: "Nama", value: selectedDepartment.name },
              { label: "Perusahaan", value: companiesData?.data.find(c => c.id === selectedDepartment.companyId)?.name || selectedDepartment.companyId },
              { label: "Status", value: selectedDepartment.isActive ? "Aktif" : "Non-aktif" },
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
        onConfirm={() => selectedDepartment && deleteMutation.mutate(selectedDepartment.id)}
        title="Hapus Departemen"
        message={`Apakah Anda yakin ingin menghapus departemen "${selectedDepartment?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
