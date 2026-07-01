"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MemberService } from "@/services/member.service";
import { CompanyService } from "@/services/company.service";
import { BranchService } from "@/services/branch.service";
import { DepartmentService } from "@/services/department.service";
import { ArrowRightLeft, Upload, Loader2, CheckCircle2 } from "lucide-react";

export default function MutationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyId: "",
    branchId: "",
    departmentId: "",
    position: "",
    reason: "",
    documentUrl: "",
  });

  const { data: membersData } = useQuery({ queryKey: ["members"], queryFn: () => MemberService.getAll({ pageSize: 500, filters: { status: "active" } }) });
  const { data: companies } = useQuery({ queryKey: ["companies"], queryFn: () => CompanyService.getAll({ pageSize: 100 }) });
  const { data: branches } = useQuery({ queryKey: ["branches"], queryFn: () => BranchService.getAll({ pageSize: 100 }) });
  const { data: departments } = useQuery({ queryKey: ["departments"], queryFn: () => DepartmentService.getAll({ pageSize: 100 }) });

  const selectedMember = membersData?.data.find(m => m.id === selectedMemberId);

  const mutation = useMutation({
    mutationFn: (data: any) => MemberService.update(selectedMemberId, {
      companyId: data.companyId,
      branchId: data.branchId,
      departmentId: data.departmentId,
      position: data.position,
      status: "pending", // Mutasi biasanya butuh approval lagi, jadi kita ubah status jadi pending
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      setIsSuccess(true);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await MemberService.uploadDocument(file);
      setFormData(prev => ({ ...prev, documentUrl: url }));
    } catch (error) {
      alert("Gagal mengunggah surat mutasi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    mutation.mutate(formData);
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center animate-fade-in">
        <div className="mb-6 flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">Pengajuan Mutasi Berhasil!</h2>
        <p className="mb-8 text-zinc-500">
          Data mutasi untuk <strong>{selectedMember?.name}</strong> telah disimpan dan sedang menunggu persetujuan dari Admin Pusat.
        </p>
        <button
          onClick={() => router.push("/members")}
          className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Kembali ke Daftar Anggota
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Mutasi Anggota</h1>
        <p className="mt-1 text-sm text-zinc-500">Proses perpindahan cabang, departemen, atau perusahaan anggota</p>
      </div>

      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Pilih Anggota */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Pilih Anggota *</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              <option value="">-- Ketik / Pilih Nama Anggota --</option>
              {membersData?.data.map((m) => (
                <option key={m.id} value={m.id}>{m.registrationNumber} - {m.name}</option>
              ))}
            </select>
          </div>

          {selectedMember && (
            <div className="grid gap-6 sm:grid-cols-2 animate-fade-in">
              {/* Data Saat Ini */}
              <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/30">
                <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  Data Saat Ini
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-zinc-500">Perusahaan</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{companies?.data.find(c => c.id === selectedMember.companyId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Cabang</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{branches?.data.find(b => b.id === selectedMember.branchId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Departemen</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{departments?.data.find(d => d.id === selectedMember.departmentId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Posisi</p>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{selectedMember.position}</p>
                  </div>
                </div>
              </div>

              {/* Data Tujuan */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
                <h3 className="mb-4 text-sm font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4" /> Tujuan Mutasi
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Perusahaan Baru *</label>
                    <select required value={formData.companyId} onChange={e => setFormData(p => ({...p, companyId: e.target.value}))} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                      <option value="">Pilih</option>
                      {companies?.data.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Cabang Baru *</label>
                    <select required value={formData.branchId} onChange={e => setFormData(p => ({...p, branchId: e.target.value}))} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                      <option value="">Pilih</option>
                      {branches?.data.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Departemen Baru *</label>
                    <select required value={formData.departmentId} onChange={e => setFormData(p => ({...p, departmentId: e.target.value}))} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                      <option value="">Pilih</option>
                      {departments?.data.filter(d => !formData.companyId || d.companyId === formData.companyId).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">Posisi Baru *</label>
                    <input required value={formData.position} onChange={e => setFormData(p => ({...p, position: e.target.value}))} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedMember && (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Alasan Mutasi *</label>
                <textarea required value={formData.reason} onChange={e => setFormData(p => ({...p, reason: e.target.value}))} rows={3} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Surat Pengantar Mutasi (Opsional)</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-full max-w-sm cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                    <input type="file" onChange={handleFileUpload} className="absolute inset-0 z-10 cursor-pointer opacity-0" disabled={isUploading} />
                    {isUploading ? (
                      <span className="flex items-center gap-2 text-sm text-blue-600"><Loader2 className="h-4 w-4 animate-spin" /> Mengunggah...</span>
                    ) : formData.documentUrl ? (
                      <span className="text-sm font-medium text-emerald-600">File Terlampir ✓</span>
                    ) : (
                      <span className="flex items-center gap-2 text-sm text-zinc-500"><Upload className="h-4 w-4" /> Lampirkan File</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="submit"
                  disabled={mutation.isPending || isUploading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60"
                >
                  {mutation.isPending ? "Memproses..." : "Ajukan Mutasi"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
