"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MemberService } from "@/services/member.service";
import { CompanyService } from "@/services/company.service";
import { BranchService } from "@/services/branch.service";
import { DepartmentService } from "@/services/department.service";
import { CheckCircle2, ChevronRight } from "lucide-react";
import type { Member } from "@/types";
import { generateKuasaDebetPDF } from "@/lib/pdf";

const STEPS = ["Data Pribadi", "Data Pekerjaan", "Kuasa Debet", "Selesai"];

export default function RegistrationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    name: "", nik: "", gender: "L", placeOfBirth: "", dateOfBirth: "",
    address: "", phone: "", email: "",
    companyId: "", departmentId: "", branchId: "", position: "",
    documents: [],
    status: "pending",
    bankName: "", bankBranch: "", bankAccount: "", monthlyDues: "", deductionDate: "", isAgreed: false
  });

  const { data: companies } = useQuery({ queryKey: ["companies"], queryFn: () => CompanyService.getAll({ pageSize: 100 }) });
  const { data: branches } = useQuery({ queryKey: ["branches"], queryFn: () => BranchService.getAll({ pageSize: 100 }) });
  const { data: departments } = useQuery({ queryKey: ["departments"], queryFn: () => DepartmentService.getAll({ pageSize: 100 }) });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Member, "id" | "registrationNumber" | "createdAt" | "updatedAt">) => MemberService.create(data),
    onSuccess: () => {
      generateKuasaDebetPDF(formData);
      queryClient.invalidateQueries({ queryKey: ["members"] });
      router.push("/dashboard");
    },
  });

  const handleNext = () => {
    if (currentStep === 2) {
      // Submit
      createMutation.mutate({
        ...formData,
        joinDate: new Date().toISOString(),
      } as any);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));


  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid gap-6 sm:grid-cols-2 animate-fade-in">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Lengkap *</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">NIK *</label>
              <input value={formData.nik} onChange={(e) => setFormData({ ...formData, nik: e.target.value })} maxLength={16} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Jenis Kelamin *</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as "L" | "P" })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tempat Lahir *</label>
              <input value={formData.placeOfBirth} onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tanggal Lahir *</label>
              <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Alamat Lengkap *</label>
              <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Telepon *</label>
              <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid gap-6 sm:grid-cols-2 animate-fade-in">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Perusahaan *</label>
              <select value={formData.companyId} onChange={(e) => setFormData({ ...formData, companyId: e.target.value })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                <option value="">Pilih Perusahaan</option>
                {companies?.data.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Cabang *</label>
              <select value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                <option value="">Pilih Cabang</option>
                {branches?.data.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Departemen *</label>
              <select value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                <option value="">Pilih Departemen</option>
                {departments?.data.filter(d => !formData.companyId || d.companyId === formData.companyId).map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Posisi / Jabatan *</label>
              <input value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
              <h4 className="mb-4 font-semibold text-zinc-900 dark:text-white">Data Rekening (Pemberi Kuasa)</h4>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Bank *</label>
                  <input value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} placeholder="Contoh: Bank BPD" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Cabang Bank *</label>
                  <input value={formData.bankBranch} onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })} placeholder="Contoh: Cabang Utama" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nomor Rekening *</label>
                  <input value={formData.bankAccount} onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })} placeholder="Masukkan nomor rekening Anda" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
              <h4 className="mb-4 font-semibold text-zinc-900 dark:text-white">Detail Kuasa Debet</h4>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Besaran Iuran per Bulan (Rp) *</label>
                  <input type="number" value={formData.monthlyDues} onChange={(e) => setFormData({ ...formData, monthlyDues: e.target.value })} placeholder="Contoh: 50000" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tanggal Pendebetan *</label>
                  <input type="number" min="1" max="31" value={formData.deductionDate} onChange={(e) => setFormData({ ...formData, deductionDate: e.target.value })} placeholder="Contoh: 25" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900/50 dark:bg-blue-900/20">
              <h4 className="mb-4 font-bold text-blue-900 dark:text-blue-300">Surat Kuasa Debet Rekening</h4>
              <div className="mb-4 h-48 overflow-y-auto rounded-lg border border-blue-200 bg-white p-4 text-xs text-zinc-700 dark:border-blue-800 dark:bg-zinc-900 dark:text-zinc-300">
                <p className="font-bold mb-2">Dengan ini menyatakan memberikan kuasa penuh kepada:</p>
                <ul className="list-disc pl-4 mb-4 space-y-1">
                  <li>Serikat Pegawai Bank Pembangunan Daerah (Penerima Kuasa)</li>
                </ul>
                <p className="font-bold mb-2">1. Objek Kuasa</p>
                <p className="mb-4">Pemberi Kuasa dengan ini memberikan kuasa kepada Penerima Kuasa untuk melakukan pendebetan (auto-debet) secara berkala setiap bulan atas rekening milik Pemberi Kuasa guna pembayaran iuran keanggotaan Serikat Pegawai.</p>
                <p className="font-bold mb-2">2. Kewajiban dan Kewenangan Penerima Kuasa</p>
                <p className="mb-4">Melakukan pendebetan rekening sesuai jumlah dan tanggal yang telah disepakati, menyalurkan dana hasil pendebetan kepada rekening Serikat Pegawai, dan menghentikan pendebetan apabila menerima surat pencabutan kuasa tertulis.</p>
                <p className="font-bold mb-2">3. Hak Pemberi Kuasa</p>
                <p className="mb-4">Berhak mencabut/membatalkan surat kuasa ini sewaktu-waktu dengan menyampaikan surat pemberitahuan tertulis, dan berhak memperoleh informasi serta bukti pendebetan setiap bulan.</p>
                <p className="font-bold mb-2">4. Ketentuan Lain-lain</p>
                <p>Surat kuasa ini dibuat tanpa hak substitusi. Segala biaya administrasi akibat proses pendebetan menjadi tanggung jawab Pemberi Kuasa. Surat kuasa ini berlaku sejak tanggal disetujui sampai dengan adanya pencabutan.</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isAgreed} onChange={(e) => setFormData({ ...formData, isAgreed: e.target.checked })} className="mt-1 h-5 w-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Saya telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan Surat Kuasa Debet Rekening di atas, serta menjamin kebenaran data rekening yang saya berikan.
                </span>
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">Registrasi Berhasil!</h2>
            <p className="max-w-md text-zinc-500">
              Data anggota telah berhasil disimpan dan sedang menunggu persetujuan admin. Nomor Registrasi akan dikirimkan melalui email.
            </p>
            <div className="mt-8 flex gap-4">
              <button onClick={() => router.push("/members")} className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                Kembali ke Daftar Anggota
              </button>
              <button onClick={() => { setFormData({ name: "", nik: "", gender: "L", placeOfBirth: "", dateOfBirth: "", address: "", phone: "", email: "", companyId: "", departmentId: "", branchId: "", position: "", documents: [], status: "pending" }); setCurrentStep(0); }} className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500">
                Registrasi Baru
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Registrasi Anggota Baru</h1>
        <p className="mt-1 text-sm text-zinc-500">Isi formulir berikut untuk mendaftarkan anggota serikat pekerja</p>
      </div>

      {currentStep < 3 && (
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center relative z-10 w-1/4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${i <= currentStep ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"}`}>
                    {i < currentStep ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                  </div>
                  <span className={`mt-3 text-xs font-medium ${i <= currentStep ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>{step}</span>
                  {i < STEPS.length - 1 && (
                    <div className={`absolute left-[50%] top-4 -z-10 h-[2px] w-[100%] ${i < currentStep ? "bg-blue-600" : "bg-zinc-100 dark:bg-zinc-800"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0 || createMutation.isPending}
              className={`rounded-xl px-6 py-2.5 text-sm font-medium transition-colors ${currentStep === 0 ? "invisible" : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"}`}
            >
              Kembali
            </button>
            <button
              onClick={handleNext}
              disabled={createMutation.isPending || (currentStep === 2 && (!formData.bankName || !formData.bankBranch || !formData.bankAccount || !formData.monthlyDues || !formData.deductionDate || !formData.isAgreed))}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60"
            >
              {createMutation.isPending ? "Menyimpan..." : currentStep === 2 ? "Kirim Registrasi" : "Selanjutnya"}
              {currentStep < 2 && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && renderStepContent()}
    </div>
  );
}
