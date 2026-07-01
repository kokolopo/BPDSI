"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnnouncementService } from "@/services/announcement.service";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { Modal, ConfirmDialog } from "@/components/shared/modal";
import { Eye, Pencil, Trash2, Megaphone, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import type { Announcement, QueryParams } from "@/types";

const priorityColors = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  medium: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
};

const statusColors = {
  draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700",
  published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  archived: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
};

export default function AnnouncementsPage() {
  const { user } = useAuthStore();
  const isAnggota = user?.role === "anggota";

  const queryClient = useQueryClient();
  const [params, setParams] = useState<QueryParams>({ page: 1, pageSize: 10 });
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "", content: "", priority: "medium" as "low"|"medium"|"high"|"urgent", status: "draft" as "draft"|"published"|"archived"
  });

  const { data, isLoading } = useQuery({ queryKey: ["announcements", params], queryFn: () => AnnouncementService.getAll(params) });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Announcement, "id" | "createdAt" | "updatedAt">) => AnnouncementService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["announcements"] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Announcement> }) => AnnouncementService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["announcements"] }); setShowForm(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AnnouncementService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["announcements"] }); setShowDelete(false); },
  });

  const openCreate = () => {
    setFormData({ title: "", content: "", priority: "medium", status: "draft" });
    setSelectedAnn(null);
    setShowForm(true);
  };
  const openEdit = (item: Announcement) => {
    setFormData({ title: item.title, content: item.content, priority: item.priority, status: item.isPublished ? "published" : "draft" });
    setSelectedAnn(item);
    setShowForm(true);
  };
  const openDetail = (item: Announcement) => { setSelectedAnn(item); setShowDetail(true); };
  const openDelete = (item: Announcement) => { setSelectedAnn(item); setShowDelete(true); };

  const columns: Column<Announcement>[] = [
    { key: "title", label: "Judul Pengumuman", sortable: true, render: (item) => (
      <div>
        <p className="font-semibold text-zinc-900 dark:text-white line-clamp-1">{item.title}</p>
        <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{item.content}</p>
      </div>
    )},
    { key: "priority", label: "Prioritas", render: (item) => (
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priorityColors[item.priority]}`}>
        {item.priority}
      </span>
    )},
    { key: "status", label: "Status", render: (item) => (
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[item.isPublished ? "published" : "draft"]}`}>
        {item.isPublished ? "published" : "draft"}
      </span>
    )},
    { key: "createdAt", label: "Dibuat Pada", sortable: true, render: (item) => <span className="text-sm text-zinc-600 dark:text-zinc-400">{new Date(item.createdAt).toLocaleString("id-ID")}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Pengumuman</h1>
          <p className="mt-1 text-sm text-zinc-500">Kelola informasi broadcast dan pengumuman untuk anggota</p>
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
        searchPlaceholder="Cari judul atau konten..."
        onSearch={(q) => setParams((p) => ({ ...p, search: q, page: 1 }))}
        onPageChange={(page) => setParams((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setParams((p) => ({ ...p, pageSize, page: 1 }))}
        onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
        onAdd={!isAnggota ? openCreate : undefined}
        addLabel="Buat Pengumuman"
        actions={(item) => (
          <div className="flex items-center justify-end gap-1">
            <button onClick={() => openDetail(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-blue-500 dark:hover:bg-zinc-800" title="Detail"><Eye className="h-4 w-4" /></button>
            {!isAnggota && (
              <>
                <button onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-amber-500 dark:hover:bg-zinc-800" title="Edit"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => openDelete(item)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800" title="Hapus"><Trash2 className="h-4 w-4" /></button>
              </>
            )}
          </div>
        )}
      />

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={selectedAnn ? "Edit Pengumuman" : "Buat Pengumuman Baru"} size="lg">
        <form onSubmit={(e) => {
          e.preventDefault();
          const mappedData = { ...formData, isPublished: formData.status === "published" };
          const { status, ...submitData } = mappedData;
          if (selectedAnn) updateMutation.mutate({ id: selectedAnn.id, data: submitData });
          else createMutation.mutate({ ...submitData, author: "Admin Pusat" } as any);
        }} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Judul Pengumuman *</label>
            <input required value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Konten Pengumuman *</label>
            <textarea required value={formData.content} onChange={e => setFormData(p => ({...p, content: e.target.value}))} rows={5} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Prioritas *</label>
              <select required value={formData.priority} onChange={e => setFormData(p => ({...p, priority: e.target.value as any}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                <option value="low">Rendah (Low)</option>
                <option value="medium">Sedang (Medium)</option>
                <option value="high">Tinggi (High)</option>
                <option value="urgent">Mendesak (Urgent)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Status *</label>
              <select required value={formData.status} onChange={e => setFormData(p => ({...p, status: e.target.value as any}))} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300">Batal</button>
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">Simpan</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Detail Pengumuman" size="md">
        {selectedAnn && (
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-3">
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priorityColors[selectedAnn.priority]}`}>
                  {selectedAnn.priority}
                </span>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[selectedAnn.isPublished ? "published" : "draft"]}`}>
                  {selectedAnn.isPublished ? "published" : "draft"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{selectedAnn.title}</h3>
              <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
                <span>Oleh: {selectedAnn.author}</span>
                <span>•</span>
                <span>{new Date(selectedAnn.createdAt).toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <p className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{selectedAnn.content}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => selectedAnn && deleteMutation.mutate(selectedAnn.id)}
        title="Hapus Pengumuman"
        message={`Apakah Anda yakin ingin menghapus pengumuman "${selectedAnn?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
