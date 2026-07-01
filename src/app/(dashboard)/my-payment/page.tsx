"use client";

import { useAuthStore } from "@/stores/auth.store";
import { payments } from "@/data/payments";
import { members } from "@/data/members";
import { Wallet, CheckCircle, Clock, AlertTriangle, Receipt } from "lucide-react";

export default function MyPaymentPage() {
  const { user } = useAuthStore();
  const member = members.find((m) => m.email === user?.email) || members[0];
  const myPayments = payments.filter((p) => p.memberId === member.id);

  const totalPaid = myPayments.filter((p) => p.status === "verified").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = myPayments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const paidMonths = myPayments.filter((p) => p.status === "verified").length;
  const overdueMonths = 12 - paidMonths - myPayments.filter((p) => p.status === "pending").length;

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Iuran Saya</h1>
        <p className="mt-1 text-sm text-zinc-500">Riwayat dan status pembayaran iuran keanggotaan</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-5 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Total Dibayar</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-white">{formatCurrency(totalPaid)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-5 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Menunggu Verifikasi</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-white">{formatCurrency(totalPending)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-5 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Receipt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Bulan Lunas</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-white">{paidMonths} bulan</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-5 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Tunggakan</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-white">{Math.max(0, overdueMonths)} bulan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-2xl border border-zinc-200/50 bg-white dark:border-zinc-800/50 dark:bg-zinc-900/80">
        <div className="border-b border-zinc-100 p-5 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Riwayat Pembayaran</h3>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {myPayments.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500">Belum ada riwayat pembayaran</div>
          ) : (
            myPayments.slice(0, 12).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      Iuran {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][payment.periodMonth - 1]} {payment.periodYear}
                    </p>
                    <p className="text-xs text-zinc-500">{payment.paymentNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">{formatCurrency(payment.amount)}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    payment.status === "verified"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : payment.status === "pending"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {payment.status === "verified" ? "Lunas" : payment.status === "pending" ? "Pending" : "Ditolak"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
