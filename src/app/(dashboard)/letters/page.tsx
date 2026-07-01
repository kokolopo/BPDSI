"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LetterService } from "@/services/letter.service";
import { MemberService } from "@/services/member.service";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { Modal, ConfirmDialog } from "@/components/shared/modal";
import { Eye, Pencil, Trash2, Mail, MailOpen, Upload } from "lucide-react";
import type { Letter, QueryParams } from "@/types";

const typeColors = {
  inbox: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  outbox: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

const statusColors = {
  draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
  published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  archived: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
};

export default function LettersPage() {
  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, pageSize: 10 });
  
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    letterNumber: "", title: "", type: "inbox" as "inbox" | "outbox",
    date: new Date().toISOString().split("T")[0], sender: "", receiver: "",
    description: "", status: "draft" as "draft" | "published" | "archived",
    attachmentUrl: ""
  });

  // Fetch with multiple filters
  const { data, isLoading } = useQuery({ 
    queryKey: ["letters", params, typeFilter, statusFilter], 
    queryFn: () => LetterService.getAll({
      ...params,
      filters: { ...params.filters, type: typeFilter || undefined, status: statusFilter || undefined }
    })
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Letter, "id" | "createdAt" | "updatedAt">) => LetterService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["letters"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Letter> }) => LetterService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["letters"] }); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => LetterService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["letters"] }); setShowDelete(false); },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await MemberService.uploadDocument(file);
      setFormData(prev => ({ ...prev, attachmentUrl: url }));
    } catch {
      alert("Gagal mengunggah surat");
    } finally {
      setIsUploading(false);
    }
  };

  const openCreate = () => {
    setFormData({ letterNumber: "", title: "", type: "inbox", date: new Date().toISOString().split("T")[0], sender: "", receiver: "", description: "", status: "draft", attachmentUrl: "" });
    setSelectedLetter(null);
    setShowForm(true);
  };
  const openEdit = (item: Letter) => {
    setFormData({ letterNumber: item.letterNumber, title: item.title, type: item.type, date: item.date, sender: item.sender, receiver: item.receiver, description: item.description, status: item.status, attachmentUrl: item.attachmentUrl || "" });
    setSelectedLetter(item);
    setShowForm(true);
  };
  const openDetail = (item: Letter) => { setSelectedLetter(item); setShowDetail(true); };
  const openDelete = (item: Letter) => { setSelectedLetter(item); setShowDelete(true); };

  const columns: Column<Letter>[] = [
    { key: "letterNumber", label: "No. Surat", sortable: true, render: (item) => <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.letterNumber}</span> },
    { key: "title", label: "Perihal", sortable: true, render: (item) => (
      <div>
        <p className="font-medium text-zinc-900 dark:text-white line-clamp-1 max-w-[200px]" title={item.title}>{item.title}</p>
        <div className="flex gap-2 mt-1">
          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeColors[item.type]}`}>
            {item.type === "inbox" ? "Masuk" : "Keluar"}
          </span>
          <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[item.status]}`}>
            {item.status}
          </span>
        </div>
      </div>
    )},
    { key: "sender", label: "Pengirim / Tujuan", render: (item) => (
      <div className="text-sm">
        <p><span className="text-zinc-500">Dari:</span> {item.sender}</p>
        <p><span className="text-zinc-500">Ke:</span> {item.receiver}</p>
      </div>
    )},
    { key: "date", label: "Tgl Surat", sortable: true, render: (item) => <span className="text-sm text-zinc-600 dark:text-zinc-400">{new Date(item.date).toLocaleDateString("id-ID")}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Persuratan</h1>
        <p className="mt-1 text-sm text-zinc-500">Kelola arsip surat masuk dan surat keluar organisasi</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
            <button onClick={() => { setTypeFilter(""); setParams(p => ({...p, page: 1})); }} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${typeFilter === "" ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white" : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"}`}>Semua</button>
            <button onClick={() => { setTypeFilter("inbox"); setParams(p => ({...p, page: 1})); }} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${typeFilter === "inbox" ? "bg-white text-blue-700 shadow-sm dark:bg-blue-900/50 dark:text-blue-400" : "text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"}`}><Mail className="h-4 w-4" /> Masuk</button>
            <button onClick={() => { setTypeFilter("outbox"); setParams(p => ({...p, page: 1})); }} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${typeFilter === "outbox" ? "bg-white text-purple-700 shadow-sm dark:bg-purple-900/50 dark:text-purple-400" : "text-zinc-500 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400"}`}><MailOpen className="h-4 w-4" /> Keluar</button>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setParams(p => ({...p, page: 1})); }}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option value="">Status (Semua)</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        total={data?.total || 0}
        page={data?.page || 1}
        pageSize={data?.pageSize || 10}
        totalPages={data?.totalPages || 0}
        isLoading={isLoading}
        searchPlaceholder="Cari no surat atau perihal..."
        onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
        onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        onAdd={openCreate}
        addLabel="Tambah Surat"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openDetail(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-500 dark:hover:bg-zinc-800" title="Detail"><Eye className="h-4 w-4" /></button>
            <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-amber-500 dark:hover:bg-zinc-800" title="Edit"><Pencil className="h-4 w-4" /></button>
            <button onClick={() => openDelete(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800" title="Hapus"><Trash2 className="h-4 w-4" /></button>
          </div>
        )}
      />

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={selectedLetter ? "Edit Surat" : "Tambah Surat"} size="lg">
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          if(selectedLetter) updateMutation.mutate({ id: selectedLetter.id, data: formData });
          else createMutation.mutate(formData);
        }} className="space-y-4">
          
          <div className="flex gap-4 p-1 mb-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 w-full sm:w-fit mx-auto">
             <label className="flex-1 sm:w-32 cursor-pointer">
               <input type="radio" name="type" className="peer sr-only" checked={formData.type === "inbox"} onChange={() => setFormData({...formData, type: "inbox"})} />
               <div className="rounded-lg py-2 text-center text-sm font-medium text-zinc-500 transition-all peer-checked:bg-white peer-checked:text-blue-700 peer-checked:shadow-sm dark:peer-checked:bg-zinc-700 dark:peer-checked:text-blue-400">Masuk</div>
             </label>
             <label className="flex-1 sm:w-32 cursor-pointer">
               <input type="radio" name="type" className="peer sr-only" checked={formData.type === "outbox"} onChange={() => setFormData({...formData, type: "outbox"})} />
               <div className="rounded-lg py-2 text-center text-sm font-medium text-zinc-500 transition-all peer-checked:bg-white peer-checked:text-purple-700 peer-checked:shadow-sm dark:peer-checked:bg-zinc-700 dark:peer-checked:text-purple-400">Keluar</div>
             </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nomor Surat *</label>
              <input required value={formData.letterNumber} onChange={e => setFormData(p => ({...p, letterNumber: e.target.value}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tanggal Surat *</label>
              <input type="date" required value={formData.date} onChange={e => setFormData(p => ({...p, date: e.target.value}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Perihal *</label>
              <input required value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Pengirim (Dari) *</label>
              <input required value={formData.sender} onChange={e => setFormData(p => ({...p, sender: e.target.value}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tujuan (Kepada) *</label>
              <input required value={formData.receiver} onChange={e => setFormData(p => ({...p, receiver: e.target.value}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Keterangan / Ringkasan</label>
              <textarea value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} rows={2} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Status *</label>
              <select value={formData.status} onChange={e => setFormData(p => ({...p, status: e.target.value as any}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                <option value="draft">Draft (Belum disahkan)</option>
                <option value="published">Published (Selesai/Beredar)</option>
                <option value="archived">Archived (Diarsipkan)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Lampiran (PDF/Scan)</label>
              <div className="relative flex h-[42px] w-full cursor-pointer items-center justify-center rounded-xl border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <input type="file" onChange={handleFileUpload} className="absolute inset-0 z-10 cursor-pointer opacity-0" disabled={isUploading} />
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {isUploading ? "Mengunggah..." : formData.attachmentUrl ? "File Terlampir ✓" : "Upload File"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">Batal</button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending || isUploading} className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">Simpan</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detail Surat" size="md">
        {selectedLetter && (
          <div className="space-y-4">
            <div className="border-b border-zinc-100 pb-4 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeColors[selectedLetter.type]}`}>
                  {selectedLetter.type === "inbox" ? "Masuk" : "Keluar"}
                </span>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[selectedLetter.status]}`}>
                  {selectedLetter.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">{selectedLetter.title}</h3>
              <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">{selectedLetter.letterNumber}</p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Tanggal</span><span className="font-medium text-zinc-900 dark:text-white">{new Date(selectedLetter.date).toLocaleDateString("id-ID", {dateStyle: 'long'})}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Pengirim</span><span className="font-medium text-zinc-900 dark:text-white">{selectedLetter.sender}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Tujuan</span><span className="font-medium text-zinc-900 dark:text-white">{selectedLetter.receiver}</span></div>
              
              <div className="pt-2">
                <span className="block text-zinc-500 mb-1">Keterangan:</span>
                <p className="rounded-lg bg-zinc-50 p-3 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 leading-relaxed">
                  {selectedLetter.description || "-"}
                </p>
              </div>
            </div>

            {selectedLetter.attachmentUrl && (
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <a href={selectedLetter.attachmentUrl} target="_blank" className="flex items-center justify-center gap-2 w-full rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                  <Upload className="h-4 w-4" /> Lihat Dokumen Lampiran
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => selectedLetter && deleteMutation.mutate(selectedLetter.id)}
        title="Hapus Surat"
        message={`Apakah Anda yakin ingin menghapus arsip surat "${selectedLetter?.letterNumber}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
