import type { DashboardStats, ChartData, RecentActivity } from "@/types";

export const dashboardStats: DashboardStats = {
  totalMembers: 2847,
  activeMembers: 2634,
  pendingApprovals: 23,
  totalPayments: 1420000000,
  paymentThisMonth: 142350000,
  totalCompanies: 15,
  totalBranches: 20,
  memberGrowth: 12.5,
};

export const memberGrowthData: ChartData[] = [
  { name: "Jan", value: 2150, new: 45, resigned: 12 },
  { name: "Feb", value: 2210, new: 72, resigned: 12 },
  { name: "Mar", value: 2285, new: 89, resigned: 14 },
  { name: "Apr", value: 2340, new: 68, resigned: 13 },
  { name: "May", value: 2420, new: 95, resigned: 15 },
  { name: "Jun", value: 2490, new: 85, resigned: 15 },
  { name: "Jul", value: 2545, new: 72, resigned: 17 },
  { name: "Aug", value: 2610, new: 78, resigned: 13 },
  { name: "Sep", value: 2680, new: 82, resigned: 12 },
  { name: "Oct", value: 2735, new: 68, resigned: 13 },
  { name: "Nov", value: 2790, new: 67, resigned: 12 },
  { name: "Des", value: 2847, new: 72, resigned: 15 },
];

export const paymentChartData: ChartData[] = [
  { name: "Jan", value: 128500000 },
  { name: "Feb", value: 132000000 },
  { name: "Mar", value: 135200000 },
  { name: "Apr", value: 128900000 },
  { name: "May", value: 138500000 },
  { name: "Jun", value: 141200000 },
  { name: "Jul", value: 136800000 },
  { name: "Aug", value: 139400000 },
  { name: "Sep", value: 140500000 },
  { name: "Oct", value: 137200000 },
  { name: "Nov", value: 139800000 },
  { name: "Des", value: 142350000 },
];

export const memberByCompanyData: ChartData[] = [
  { name: "PT Astra International", value: 425 },
  { name: "PT Telkom Indonesia", value: 380 },
  { name: "PT Bank Mandiri", value: 312 },
  { name: "PT Pertamina", value: 298 },
  { name: "PT PLN", value: 267 },
  { name: "PT Garuda Indonesia", value: 245 },
  { name: "PT Semen Indonesia", value: 198 },
  { name: "PT Krakatau Steel", value: 176 },
  { name: "Lainnya", value: 546 },
];

export const memberByStatusData: ChartData[] = [
  { name: "Aktif", value: 2634, color: "#10b981" },
  { name: "Pending", value: 89, color: "#f59e0b" },
  { name: "Non-aktif", value: 78, color: "#71717a" },
  { name: "Suspended", value: 31, color: "#ef4444" },
  { name: "Pensiun", value: 15, color: "#3b82f6" },
];

export const recentActivities: RecentActivity[] = [
  { id: "ACT001", type: "member", description: "Anggota baru terdaftar: Muhammad Rizal Fadillah", user: "Budi Santoso", timestamp: "2024-12-20T08:30:00Z" },
  { id: "ACT002", type: "payment", description: "Iuran bulan Desember dibayar oleh Siti Nurhaliza", user: "Dewi Lestari", timestamp: "2024-12-20T08:15:00Z" },
  { id: "ACT003", type: "approval", description: "Registrasi anggota disetujui: Ahmad Fauzan", user: "Ahmad Fauzi", timestamp: "2024-12-20T07:45:00Z" },
  { id: "ACT004", type: "letter", description: "Surat tugas diterbitkan: No. ST-2024/XII/045", user: "Nina Susanti", timestamp: "2024-12-19T16:30:00Z" },
  { id: "ACT005", type: "announcement", description: "Pengumuman baru: Rapat Akbar Tahunan 2025", user: "Gunawan Wibisono", timestamp: "2024-12-19T14:00:00Z" },
  { id: "ACT006", type: "member", description: "Data anggota diperbarui: Hana Permata Sari", user: "Irfan Hakim", timestamp: "2024-12-19T11:30:00Z" },
  { id: "ACT007", type: "payment", description: "Batch pembayaran iuran 45 anggota cabang Jakarta", user: "Jamilah Nurul Huda", timestamp: "2024-12-19T10:00:00Z" },
  { id: "ACT008", type: "approval", description: "Mutasi anggota ditolak: Eko Prasetyo", user: "Ahmad Fauzi", timestamp: "2024-12-19T09:00:00Z" },
  { id: "ACT009", type: "member", description: "Anggota baru terdaftar: Ratna Dewi Sartika", user: "Budi Santoso", timestamp: "2024-12-18T15:30:00Z" },
  { id: "ACT010", type: "payment", description: "Tunggakan iuran dilunasi oleh Tono Suryadi", user: "Dewi Lestari", timestamp: "2024-12-18T14:00:00Z" },
];

export const upcomingEvents = [
  { date: "2024-12-22", title: "Rapat Pengurus Cabang Jakarta", type: "meeting" },
  { date: "2024-12-25", title: "Hari Libur: Natal", type: "holiday" },
  { date: "2024-12-28", title: "Batas Akhir Iuran Desember", type: "deadline" },
  { date: "2025-01-01", title: "Hari Libur: Tahun Baru", type: "holiday" },
  { date: "2025-01-05", title: "Rapat Akbar Tahunan 2025", type: "event" },
  { date: "2025-01-10", title: "Pelatihan Pengurus Baru", type: "training" },
];

export const quickMenuItems = [
  { label: "Tambah Anggota", href: "/registration", color: "from-blue-600 to-blue-700" },
  { label: "Catat Iuran", href: "/payments", color: "from-emerald-600 to-emerald-700" },
  { label: "Buat Surat", href: "/letters", color: "from-violet-600 to-violet-700" },
  { label: "Pengumuman", href: "/announcements", color: "from-amber-600 to-amber-700" },
  { label: "Approval", href: "/approval", color: "from-rose-600 to-rose-700" },
  { label: "Laporan", href: "/reports", color: "from-cyan-600 to-cyan-700" },
];
