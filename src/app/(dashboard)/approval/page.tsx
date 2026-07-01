"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApprovalService, type ApprovalRequest } from "@/services/approval.service";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { Modal, ConfirmDialog } from "@/components/shared/modal";
import { CheckCircle2, XCircle, FileText, Loader2 } from "lucide-react";
import type { QueryParams } from "@/types";

export default function ApprovalPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, pageSize: 10 });
  const [selectedReq, setSelectedReq] = useState<ApprovalRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["approvals", params],
    queryFn: () => ApprovalService.getPendingApprovals(params),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, memberId, notes }: { id: string, memberId: string, notes: string }) => ApprovalService.approve(id, memberId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setShowApprove(false);
      setShowDetail(false);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, memberId, notes }: { id: string, memberId: string, notes: string }) => ApprovalService.reject(id, memberId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setShowReject(false);
      setShowDetail(false);
    },
  });

  const openApprove = (req: ApprovalRequest) => { setSelectedReq(req); setNotes(""); setShowApprove(true); };
  const openReject = (req: ApprovalRequest) => { setSelectedReq(req); setNotes(""); setShowReject(true); };
  const openDetail = (req: ApprovalRequest) => { setSelectedReq(req); setShowDetail(true); };

  const columns: Column<ApprovalRequest>[] = [
    { key: "id", label: "ID Request", render: (item) => <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.id}</span> },
    { key: "type", label: "Tipe", render: (item) => (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${item.type === "REGISTRATION" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"}`}>
        {item.type === "REGISTRATION" ? "Registrasi" : "Mutasi"}
      </span>
    )},
    { key: "name", label: "Nama Anggota", render: (item) => (
      <div>
        <p className="font-medium text-zinc-900 dark:text-white">{item.memberInfo.name}</p>
        <p className="text-xs text-zinc-500">{item.memberInfo.nik}</p>
      </div>
    )},
    { key: "requestDate", label: "Tanggal Pengajuan", sortable: true, render: (item) => new Date(item.requestDate).toLocaleDateString("id-ID") },
    { key: "status", label: "Status", render: (item) => (
      <span className="inline-flex rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
        Menunggu
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Persetujuan</h1>
        <p className="mt-1 text-sm text-zinc-500">Daftar pengajuan registrasi dan mutasi yang menunggu persetujuan</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={data?.page || 1}
        pageSize={data?.pageSize || 10}
        totalPages={data?.totalPages || 0}
        isLoading={isLoading}
        searchPlaceholder="Cari ID request atau nama..."
        onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
        onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        emptyMessage="Tidak ada pengajuan yang menunggu persetujuan."
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openDetail(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-500 dark:hover:bg-zinc-800" title="Review Pengajuan"><FileText className="h-4 w-4" /></button>
            <button onClick={() => openApprove(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-emerald-500 dark:hover:bg-zinc-800" title="Setujui"><CheckCircle2 className="h-4 w-4" /></button>
            <button onClick={() => openReject(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800" title="Tolak"><XCircle className="h-4 w-4" /></button>
          </div>
        )}
      />

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Review Pengajuan" size="lg">
        {selectedReq && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedReq.memberInfo.name}</h3>
                <p className="text-sm text-zinc-500">{selectedReq.memberInfo.nik}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{selectedReq.type === "REGISTRATION" ? "Registrasi Baru" : "Mutasi"}</p>
                <p className="text-xs text-zinc-500">{new Date(selectedReq.requestDate).toLocaleDateString("id-ID")}</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-zinc-900 dark:text-white">Data Pribadi</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-zinc-500">Gender</span><span className="col-span-2 font-medium">{selectedReq.memberInfo.gender === "L" ? "Laki-laki" : "Perempuan"}</span>
                  <span className="text-zinc-500">Alamat</span><span className="col-span-2 font-medium">{selectedReq.memberInfo.address}</span>
                  <span className="text-zinc-500">Telepon</span><span className="col-span-2 font-medium">{selectedReq.memberInfo.phone}</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-zinc-900 dark:text-white">Penempatan</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-zinc-500">Perusahaan</span><span className="col-span-2 font-medium">{selectedReq.memberInfo.companyId}</span>
                  <span className="text-zinc-500">Cabang</span><span className="col-span-2 font-medium">{selectedReq.memberInfo.branchId}</span>
                  <span className="text-zinc-500">Departemen</span><span className="col-span-2 font-medium">{selectedReq.memberInfo.departmentId}</span>
                  <span className="text-zinc-500">Posisi</span><span className="col-span-2 font-medium">{selectedReq.memberInfo.position}</span>
                </div>
              </div>
            </div>

            {selectedReq.memberInfo.documents && selectedReq.memberInfo.documents.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="font-semibold text-zinc-900 dark:text-white">Dokumen Terlampir</h4>
                <div className="flex gap-4">
                  {selectedReq.memberInfo.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{doc.type}</div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <a href={doc.url} target="_blank" className="text-xs text-blue-500 hover:underline">Lihat</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => openReject(selectedReq)}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                <XCircle className="h-4 w-4" /> Tolak
              </button>
              <button
                onClick={() => openApprove(selectedReq)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500"
              >
                <CheckCircle2 className="h-4 w-4" /> Setujui
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Confirm */}
      <Modal isOpen={showApprove} onClose={() => setShowApprove(false)} title="Setujui Pengajuan" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Anda akan menyetujui pengajuan {selectedReq?.type === "REGISTRATION" ? "registrasi" : "mutasi"} atas nama <strong>{selectedReq?.memberInfo.name}</strong>.
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Catatan Persetujuan (Opsional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setShowApprove(false)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">Batal</button>
            <button
              onClick={() => selectedReq && approveMutation.mutate({ id: selectedReq.id, memberId: selectedReq.memberId, notes })}
              disabled={approveMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
            >
              {approveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Setujui
            </button>
          </div>
        </div>
      </Modal>

      {/* Reject Confirm */}
      <Modal isOpen={showReject} onClose={() => setShowReject(false)} title="Tolak Pengajuan" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Anda akan <strong className="text-red-500">menolak</strong> pengajuan {selectedReq?.type === "REGISTRATION" ? "registrasi" : "mutasi"} atas nama <strong>{selectedReq?.memberInfo.name}</strong>.
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Alasan Penolakan *</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} required rows={3} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setShowReject(false)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">Batal</button>
            <button
              onClick={() => selectedReq && rejectMutation.mutate({ id: selectedReq.id, memberId: selectedReq.memberId, notes })}
              disabled={rejectMutation.isPending || !notes.trim()}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
            >
              {rejectMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Tolak
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
