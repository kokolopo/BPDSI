"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentService } from "@/services/payment.service";
import { MemberService } from "@/services/member.service";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { Modal, ConfirmDialog } from "@/components/shared/modal";
import { CheckCircle2, XCircle, FileText, Upload, Plus } from "lucide-react";
import type { Payment, QueryParams } from "@/types";

const statusColors = {
  verified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
};

const statusLabels = {
  verified: "Terverifikasi",
  pending: "Menunggu",
  rejected: "Ditolak",
};

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, pageSize: 10 });
  
  // Status filter
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showReject, setShowReject] = useState(false);
  
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "", amount: 50000, periodMonth: new Date().getMonth() + 1, periodYear: new Date().getFullYear(),
    paymentMethod: "transfer", proofUrl: "",
  });

  const handleStatusFilter = (val: string) => {
    setStatusFilter(val);
    setParams(p => ({ ...p, page: 1, filters: { ...p.filters, status: val || "all" } }));
  };

  const { data, isLoading } = useQuery({ queryKey: ["payments", params], queryFn: () => PaymentService.getAll(params) });
  const { data: members } = useQuery({ queryKey: ["members"], queryFn: () => MemberService.getAll({ pageSize: 500, filters: { status: "active" } }) });

  const createMutation = useMutation({
    mutationFn: (data: any) => PaymentService.create({
      ...data, paymentDate: new Date().toISOString()
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["payments"] }); setShowForm(false); },
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string, status: "verified" | "rejected", notes: string }) => 
      PaymentService.verify(id, "Admin Keuangan", status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setShowVerify(false);
      setShowReject(false);
      setShowDetail(false);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await MemberService.uploadDocument(file); // reuse file upload service
      setFormData(prev => ({ ...prev, proofUrl: url }));
    } catch {
      alert("Gagal mengunggah bukti pembayaran");
    } finally {
      setIsUploading(false);
    }
  };

  const openForm = () => {
    setFormData({ memberId: "", amount: 50000, periodMonth: new Date().getMonth() + 1, periodYear: new Date().getFullYear(), paymentMethod: "transfer", proofUrl: "" });
    setShowForm(true);
  };
  const openDetail = (item: Payment) => { setSelectedPayment(item); setShowDetail(true); };
  const openVerify = (item: Payment) => { setSelectedPayment(item); setNotes(""); setShowVerify(true); };
  const openReject = (item: Payment) => { setSelectedPayment(item); setNotes(""); setShowReject(true); };

  const columns: Column<Payment>[] = [
    { key: "paymentNumber", label: "No. Invoice", render: (item) => <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.paymentNumber}</span> },
    { key: "memberId", label: "Anggota", render: (item) => {
      const member = members?.data.find(m => m.id === item.memberId);
      return (
        <div>
          <p className="font-medium text-zinc-900 dark:text-white">{member?.name || item.memberId}</p>
          <p className="text-xs text-zinc-500">{member?.registrationNumber}</p>
        </div>
      );
    }},
    { key: "period", label: "Periode", render: (item) => (
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {new Date(item.periodYear, item.periodMonth - 1).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
      </span>
    )},
    { key: "amount", label: "Jumlah", sortable: true, render: (item) => (
      <span className="font-semibold text-emerald-600 dark:text-emerald-400">Rp {item.amount.toLocaleString("id-ID")}</span>
    )},
    { key: "paymentDate", label: "Tgl Bayar", sortable: true, render: (item) => <span className="text-sm text-zinc-600 dark:text-zinc-400">{new Date(item.paymentDate).toLocaleDateString("id-ID")}</span> },
    { key: "status", label: "Status", sortable: true, render: (item) => (
      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusColors[item.status]}`}>
        {statusLabels[item.status]}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Iuran & Pembayaran</h1>
        <p className="mt-1 text-sm text-zinc-500">Kelola data iuran anggota dan verifikasi pembayaran</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={data?.page || 1}
        pageSize={data?.pageSize || 10}
        totalPages={data?.totalPages || 0}
        isLoading={isLoading}
        searchPlaceholder="Cari nomor invoice..."
        onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
        onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        onAdd={openForm}
        addLabel="Catat Pembayaran"
        filters={
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option value="">Semua Status</option>
            <option value="verified">Terverifikasi</option>
            <option value="pending">Menunggu</option>
            <option value="rejected">Ditolak</option>
          </select>
        }
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openDetail(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-500 dark:hover:bg-zinc-800" title="Detail"><FileText className="h-4 w-4" /></button>
            {item.status === "pending" && (
              <>
                <button onClick={() => openVerify(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-emerald-500 dark:hover:bg-zinc-800" title="Verifikasi"><CheckCircle2 className="h-4 w-4" /></button>
                <button onClick={() => openReject(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800" title="Tolak"><XCircle className="h-4 w-4" /></button>
              </>
            )}
          </div>
        )}
      />

      {/* Record Payment Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Catat Pembayaran Baru" size="sm">
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData); }} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Pilih Anggota *</label>
            <select required value={formData.memberId} onChange={e => setFormData(p => ({...p, memberId: e.target.value}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
              <option value="">Pilih Anggota</option>
              {members?.data.map(m => <option key={m.id} value={m.id}>{m.registrationNumber} - {m.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Bulan *</label>
              <select required value={formData.periodMonth} onChange={e => setFormData(p => ({...p, periodMonth: Number(e.target.value)}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('id-ID', {month: 'long'})}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tahun *</label>
              <input type="number" required value={formData.periodYear} onChange={e => setFormData(p => ({...p, periodYear: Number(e.target.value)}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Jumlah (Rp) *</label>
            <input type="number" required value={formData.amount} onChange={e => setFormData(p => ({...p, amount: Number(e.target.value)}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Metode Pembayaran *</label>
            <select required value={formData.paymentMethod} onChange={e => setFormData(p => ({...p, paymentMethod: e.target.value}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
              <option value="transfer">Transfer Bank</option>
              <option value="cash">Tunai</option>
              <option value="payroll_deduction">Potong Gaji</option>
            </select>
          </div>
          {formData.paymentMethod === "transfer" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Bukti Transfer</label>
              <div className="relative flex h-16 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <input type="file" onChange={handleFileUpload} className="absolute inset-0 z-10 cursor-pointer opacity-0" disabled={isUploading} />
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {isUploading ? "Mengunggah..." : formData.proofUrl ? "File Terlampir ✓" : "Pilih File"}
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">Batal</button>
            <button type="submit" disabled={createMutation.isPending || isUploading} className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">Simpan</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detail Pembayaran" size="sm">
        {selectedPayment && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <span className="text-lg font-bold text-zinc-900 dark:text-white">{selectedPayment.paymentNumber}</span>
              <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusColors[selectedPayment.status]}`}>
                {statusLabels[selectedPayment.status]}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Anggota</span><span className="font-medium text-zinc-900 dark:text-white">{members?.data.find(m => m.id === selectedPayment.memberId)?.name}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Periode</span><span className="font-medium text-zinc-900 dark:text-white">{new Date(selectedPayment.periodYear, selectedPayment.periodMonth - 1).toLocaleString('id-ID', {month: 'long', year: 'numeric'})}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Metode</span><span className="font-medium text-zinc-900 dark:text-white">{selectedPayment.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Tgl Bayar</span><span className="font-medium text-zinc-900 dark:text-white">{new Date(selectedPayment.paymentDate).toLocaleString("id-ID")}</span></div>
              <div className="flex justify-between mt-2 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-700"><span className="font-semibold text-zinc-900 dark:text-white">Jumlah Total</span><span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Rp {selectedPayment.amount.toLocaleString("id-ID")}</span></div>
            </div>

            {selectedPayment.status !== "pending" && (
              <div className="rounded-lg bg-zinc-50 p-3 text-xs dark:bg-zinc-800/50 mt-4">
                <p className="text-zinc-500">Diperiksa oleh: <span className="font-medium text-zinc-900 dark:text-white">{selectedPayment.verifiedBy}</span></p>
                <p className="text-zinc-500">Waktu: <span className="font-medium text-zinc-900 dark:text-white">{selectedPayment.verifiedAt ? new Date(selectedPayment.verifiedAt).toLocaleString("id-ID") : "-"}</span></p>
                {selectedPayment.notes && <p className="mt-1 text-zinc-700 dark:text-zinc-300">Catatan: {selectedPayment.notes}</p>}
              </div>
            )}
            
            {selectedPayment.proofUrl && (
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
                <a href={selectedPayment.proofUrl} target="_blank" className="text-sm font-medium text-blue-600 hover:underline">Lihat Bukti Transfer</a>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Verify Confirm */}
      <Modal isOpen={showVerify} onClose={() => setShowVerify(false)} title="Verifikasi Pembayaran" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Setujui pembayaran <strong>{selectedPayment?.paymentNumber}</strong> sebesar <strong>Rp {selectedPayment?.amount.toLocaleString("id-ID")}</strong>?</p>
          <textarea placeholder="Catatan opsional..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowVerify(false)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm">Batal</button>
            <button onClick={() => selectedPayment && verifyMutation.mutate({ id: selectedPayment.id, status: "verified", notes })} className="rounded-xl bg-emerald-600 px-6 py-2 text-sm text-white">Verifikasi</button>
          </div>
        </div>
      </Modal>

      {/* Reject Confirm */}
      <Modal isOpen={showReject} onClose={() => setShowReject(false)} title="Tolak Pembayaran" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Tolak pembayaran <strong>{selectedPayment?.paymentNumber}</strong>?</p>
          <textarea required placeholder="Alasan penolakan..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm outline-none focus:border-red-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowReject(false)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm">Batal</button>
            <button onClick={() => selectedPayment && verifyMutation.mutate({ id: selectedPayment.id, status: "rejected", notes })} disabled={!notes.trim()} className="rounded-xl bg-red-600 px-6 py-2 text-sm text-white disabled:opacity-50">Tolak</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
