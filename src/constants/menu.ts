import {
  User,
  type LucideIcon,
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  children?: MenuItem[];
  badge?: number;
}

export const PROFILE_MENU: MenuItem = {
  id: "profile",
  label: "Profile",
  icon: User,
  href: "/profile",
};

export const APP_NAME = "SERIKAT";
export const APP_FULL_NAME = "Sistem Administrasi Anggota Serikat Pekerja";
export const APP_VERSION = "1.0.0-beta";

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  administrator: "Administrator",
  operator: "Operator",
  bendahara: "Bendahara",
  pengurus_cabang: "Pengurus Cabang",
  pengurus_wilayah: "Pengurus Wilayah",
  pengurus_pusat: "Pengurus Pusat",
  anggota: "Anggota",
};

export const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  inactive: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/20",
  suspended: "bg-red-500/15 text-red-500 border-red-500/20",
  retired: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  approved: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  rejected: "bg-red-500/15 text-red-500 border-red-500/20",
  paid: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  overdue: "bg-red-500/15 text-red-500 border-red-500/20",
  cancelled: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  draft: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  review: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  sent: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  archived: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

export const GENDER_LABELS: Record<string, string> = {
  L: "Laki-laki",
  P: "Perempuan",
};

export const RELIGION_LABELS: Record<string, string> = {
  islam: "Islam",
  kristen: "Kristen",
  katolik: "Katolik",
  hindu: "Hindu",
  buddha: "Buddha",
  konghucu: "Konghucu",
};

export const EDUCATION_LABELS: Record<string, string> = {
  sd: "SD",
  smp: "SMP",
  sma: "SMA/SMK",
  d1: "D1",
  d2: "D2",
  d3: "D3",
  s1: "S1",
  s2: "S2",
  s3: "S3",
};

export const MARITAL_STATUS_LABELS: Record<string, string> = {
  single: "Belum Menikah",
  married: "Menikah",
  divorced: "Cerai",
  widowed: "Duda/Janda",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  transfer: "Transfer Bank",
  cash: "Tunai",
  auto_debit: "Auto Debit",
  e_wallet: "E-Wallet",
};

export const LETTER_TYPE_LABELS: Record<string, string> = {
  recommendation: "Surat Rekomendasi",
  assignment: "Surat Tugas",
  membership: "Surat Keanggotaan",
  notification: "Surat Pemberitahuan",
  circular: "Surat Edaran",
  official: "Surat Resmi",
};

export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;
