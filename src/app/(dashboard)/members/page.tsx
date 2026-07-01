"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MemberService } from "@/services/member.service";
import { CompanyService } from "@/services/company.service";
import { BranchService } from "@/services/branch.service";
import { DepartmentService } from "@/services/department.service";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { Modal, ConfirmDialog } from "@/components/shared/modal";
import { PermissionGuard } from "@/components/shared/permission-guard";
import { usePermissions } from "@/lib/permissions/hooks";
import { useAuthStore } from "@/stores/auth.store";
import { Eye, Pencil, Trash2, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import type { Member, QueryParams } from "@/types";

const statusColors = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  inactive: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  retired: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

const statusLabels = {
  active: "Aktif",
  inactive: "Non-aktif",
  pending: "Menunggu",
  suspended: "Ditangguhkan",
  retired: "Pensiun",
};

export default function MembersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cannot } = usePermissions();
  const [params, setParams] = useState<QueryParams>({ page: 1, pageSize: 10 });
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Update params when filters change
  const handleStatusFilter = (val: string) => {
    setStatusFilter(val);
    setParams(p => ({
      ...p,
      page: 1,
      filters: { ...p.filters, status: val || "all" }
    }));
  };

  const { data, isLoading } = useQuery({
    queryKey: ["members", params],
    queryFn: () => MemberService.getAll(params),
  });

  const { data: companies } = useQuery({ queryKey: ["companies"], queryFn: () => CompanyService.getAll({ pageSize: 100 }) });
  const { data: branches } = useQuery({ queryKey: ["branches"], queryFn: () => BranchService.getAll({ pageSize: 100 }) });
  const { data: departments } = useQuery({ queryKey: ["departments"], queryFn: () => DepartmentService.getAll({ pageSize: 100 }) });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => MemberService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["members"] }); setShowDelete(false); },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: Member["status"] }) => MemberService.update(id, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["members"] }); },
  });

  const openDetail = (member: Member) => { setSelectedMember(member); setShowDetail(true); };
  const openDelete = (member: Member) => { setSelectedMember(member); setShowDelete(true); };

  const columns: Column<Member>[] = [
    { key: "registrationNumber", label: "No. Anggota", sortable: true, render: (item) => <span className="font-semibold text-blue-600 dark:text-blue-400">{item.registrationNumber}</span> },
    { key: "name", label: "Nama Lengkap", sortable: true, render: (item) => (
      <div>
        <p className="font-medium text-zinc-900 dark:text-white">{item.name}</p>
        <p className="text-xs text-zinc-500">NIK: {item.nik}</p>
      </div>
    )},
    { key: "companyId", label: "Perusahaan / Cabang", render: (item) => {
      const comp = companies?.data.find(c => c.id === item.companyId)?.name;
      const branch = branches?.data.find(b => b.id === item.branchId)?.name;
      return (
        <div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{comp || item.companyId}</p>
          <p className="text-xs text-zinc-500">{branch || item.branchId}</p>
        </div>
      );
    }},
    { key: "position", label: "Posisi", render: (item) => (
      <div>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{item.position}</p>
        <p className="text-xs text-zinc-500">{departments?.data.find(d => d.id === item.departmentId)?.name}</p>
      </div>
    )},
    { key: "status", label: "Status", sortable: true, render: (item) => (
      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusColors[item.status]}`}>
        {statusLabels[item.status]}
      </span>
    )},
  ];

  const filterNode = (
    <select
      value={statusFilter}
      onChange={(e) => handleStatusFilter(e.target.value)}
      className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
    >
      <option value="">Semua Status</option>
      <option value="active">Aktif</option>
      <option value="pending">Menunggu</option>
      <option value="suspended">Ditangguhkan</option>
      <option value="inactive">Non-aktif</option>
    </select>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Data Anggota</h1>
        <p className="mt-1 text-sm text-zinc-500">Kelola seluruh data anggota serikat pekerja</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={data?.page || 1}
        pageSize={data?.pageSize || 10}
        totalPages={data?.totalPages || 0}
        isLoading={isLoading}
        searchPlaceholder="Cari nama, NIK, atau no anggota..."
        onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
        onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        onAdd={() => router.push("/registration")}
        addLabel="Registrasi Baru"
        filters={filterNode}
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openDetail(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-500 dark:hover:bg-zinc-800" title="Detail"><Eye className="h-4 w-4" /></button>
            <PermissionGuard permission="update:members">
              <button onClick={() => router.push(`/registration?edit=${item.id}`)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-amber-500 dark:hover:bg-zinc-800" title="Edit"><Pencil className="h-4 w-4" /></button>
            </PermissionGuard>
            <PermissionGuard permission="delete:members">
              <button onClick={() => openDelete(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800" title="Hapus"><Trash2 className="h-4 w-4" /></button>
            </PermissionGuard>
          </div>
        )}
      />

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detail Anggota" size="lg">
        {selectedMember && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedMember.name}</h3>
                <p className="text-sm text-zinc-500">{selectedMember.registrationNumber}</p>
              </div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[selectedMember.status]}`}>
                {statusLabels[selectedMember.status]}
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-semibold text-zinc-900 dark:text-white border-b border-zinc-100 pb-2 dark:border-zinc-800">Data Pribadi</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-zinc-500">NIK</span><span className="col-span-2 font-medium">{selectedMember.nik}</span>
                  <span className="text-zinc-500">Gender</span><span className="col-span-2 font-medium">{selectedMember.gender === "L" ? "Laki-laki" : "Perempuan"}</span>
                  <span className="text-zinc-500">TTL</span><span className="col-span-2 font-medium">{selectedMember.placeOfBirth}, {new Date(selectedMember.dateOfBirth).toLocaleDateString("id-ID")}</span>
                  <span className="text-zinc-500">Alamat</span><span className="col-span-2 font-medium">{selectedMember.address}</span>
                  <span className="text-zinc-500">Email</span><span className="col-span-2 font-medium">{selectedMember.email}</span>
                  <span className="text-zinc-500">Telepon</span><span className="col-span-2 font-medium">{selectedMember.phone}</span>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-zinc-900 dark:text-white border-b border-zinc-100 pb-2 dark:border-zinc-800">Data Pekerjaan</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-zinc-500">Perusahaan</span><span className="col-span-2 font-medium">{companies?.data.find(c => c.id === selectedMember.companyId)?.name}</span>
                  <span className="text-zinc-500">Cabang</span><span className="col-span-2 font-medium">{branches?.data.find(b => b.id === selectedMember.branchId)?.name}</span>
                  <span className="text-zinc-500">Departemen</span><span className="col-span-2 font-medium">{departments?.data.find(d => d.id === selectedMember.departmentId)?.name}</span>
                  <span className="text-zinc-500">Posisi</span><span className="col-span-2 font-medium">{selectedMember.position}</span>
                  <span className="text-zinc-500">Tgl Gabung</span><span className="col-span-2 font-medium">{new Date(selectedMember.joinDate).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            </div>

            {selectedMember.documents && selectedMember.documents.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-zinc-900 dark:text-white border-b border-zinc-100 pb-2 dark:border-zinc-800">Dokumen Pendukung</h4>
                <div className="flex gap-4">
                  {selectedMember.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {doc.type}
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <a href="#" className="text-xs text-blue-500 hover:underline">Lihat Dokumen</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              {selectedMember.status === "pending" && (
                <button
                  onClick={() => updateStatusMutation.mutate({ id: selectedMember.id, status: "active" })}
                  disabled={updateStatusMutation.isPending}
                  className="flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve
                </button>
              )}
              {selectedMember.status === "active" && (
                <button
                  onClick={() => updateStatusMutation.mutate({ id: selectedMember.id, status: "suspended" })}
                  disabled={updateStatusMutation.isPending}
                  className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                >
                  <ShieldAlert className="h-4 w-4" /> Suspend
                </button>
              )}
              {selectedMember.status === "suspended" && (
                <button
                  onClick={() => updateStatusMutation.mutate({ id: selectedMember.id, status: "active" })}
                  disabled={updateStatusMutation.isPending}
                  className="flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                >
                  <CheckCircle2 className="h-4 w-4" /> Aktifkan
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => selectedMember && deleteMutation.mutate(selectedMember.id)}
        title="Hapus Anggota"
        message={`Apakah Anda yakin ingin menghapus "${selectedMember?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
