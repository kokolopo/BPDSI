"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Wallet,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  CreditCard,
  FileText,
  Megaphone,
  ClipboardCheck,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Bell,
  type LucideIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  dashboardStats,
  memberGrowthData,
  paymentChartData,
  memberByStatusData,
  recentActivities,
  upcomingEvents,
  quickMenuItems,
} from "@/data/dashboard-stats";
import { formatCurrency } from "@/lib/utils";

// ============= STAT CARD =============
interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
}

function StatCard({ label, value, change, trend, icon: Icon, color }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/50 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/80">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
          <div className="mt-2 flex items-center gap-1">
            {trend === "up" ? (
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend === "up" ? "text-emerald-500" : "text-red-500"}`}>{change}</span>
            <span className="text-xs text-zinc-400">vs bulan lalu</span>
          </div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${color} opacity-0 transition-opacity group-hover:opacity-100`} />
    </div>
  );
}

// ============= CUSTOM TOOLTIP =============
interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
      <p className="mb-1 text-xs font-semibold text-zinc-500">{label}</p>
      {payload.map((entry: TooltipPayload, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.dataKey === "value" && entry.value > 100000
            ? formatCurrency(entry.value)
            : entry.value.toLocaleString("id-ID")}
        </p>
      ))}
    </div>
  );
}

// ============= CALENDAR WIDGET =============
function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 20)); // Dec 20, 2024

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = 20; // simulated "today"

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const eventDays = upcomingEvents
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .map((e) => new Date(e.date).getDate());

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="rounded-2xl border border-zinc-200/50 bg-white p-5 dark:border-zinc-800/50 dark:bg-zinc-900/80">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          <Calendar className="mr-2 inline h-4 w-4 text-blue-500" />
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={nextMonth} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map((d) => (
          <div key={d} className="py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            {d}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`relative flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-colors ${
              day === null
                ? ""
                : day === today && month === 11
                ? "bg-blue-600 font-bold text-white"
                : eventDays.includes(day!)
                ? "bg-blue-100 font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {day}
            {eventDays.includes(day!) && day !== today && (
              <span className="absolute -bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-500" />
            )}
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Agenda Mendatang</p>
        {upcomingEvents.slice(0, 3).map((event, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
            <div className={`h-2 w-2 rounded-full ${
              event.type === "meeting" ? "bg-blue-500" :
              event.type === "holiday" ? "bg-emerald-500" :
              event.type === "deadline" ? "bg-red-500" :
              event.type === "event" ? "bg-violet-500" : "bg-amber-500"
            }`} />
            <div className="flex-1">
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{event.title}</p>
              <p className="text-[10px] text-zinc-400">
                {new Date(event.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============= MAIN DASHBOARD =============
import { useAuthStore } from "@/stores/auth.store";
import MemberDashboard from "./member-dashboard";

function AdminDashboard() {
  const stats: StatCardProps[] = [
    { label: "Total Anggota", value: dashboardStats.totalMembers.toLocaleString("id-ID"), change: "+12.5%", trend: "up", icon: Users, color: "from-blue-600 to-blue-700" },
    { label: "Perusahaan Terdaftar", value: dashboardStats.totalCompanies.toString(), change: "+2", trend: "up", icon: Building2, color: "from-emerald-600 to-emerald-700" },
    { label: "Iuran Bulan Ini", value: formatCurrency(dashboardStats.paymentThisMonth), change: "+8.2%", trend: "up", icon: Wallet, color: "from-violet-600 to-violet-700" },
    { label: "Pending Approval", value: dashboardStats.pendingApprovals.toString(), change: "-5", trend: "down", icon: CheckCircle, color: "from-amber-600 to-amber-700" },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#71717a", "#ef4444", "#3b82f6"];

  const activityIcons: Record<string, LucideIcon> = {
    member: Users,
    payment: CreditCard,
    approval: ClipboardCheck,
    letter: FileText,
    announcement: Bell,
  };

  const activityColors: Record<string, string> = {
    member: "bg-blue-500/15 text-blue-500",
    payment: "bg-emerald-500/15 text-emerald-500",
    approval: "bg-amber-500/15 text-amber-500",
    letter: "bg-violet-500/15 text-violet-500",
    announcement: "bg-rose-500/15 text-rose-500",
  };

  const quickIcons: Record<string, LucideIcon> = {
    "Tambah Anggota": UserPlus,
    "Catat Iuran": CreditCard,
    "Buat Surat": FileText,
    "Pengumuman": Megaphone,
    "Approval": ClipboardCheck,
    "Laporan": BarChart3,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Selamat datang kembali. Berikut ringkasan data terkini.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Clock className="h-3.5 w-3.5" />
          <span>Terakhir diperbarui: 20 Desember 2024, 08:30 WIB</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Member Growth Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Pertumbuhan Anggota</h3>
              <p className="text-xs text-zinc-500">Total anggota per bulan tahun 2024</p>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              +{dashboardStats.memberGrowth}%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={memberGrowthData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} domain={["dataMin - 100", "dataMax + 50"]} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorValue)" name="Total Anggota" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Member by Status Pie */}
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">Status Anggota</h3>
          <p className="mb-4 text-xs text-zinc-500">Distribusi status keanggotaan</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={memberByStatusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {memberByStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {memberByStatusData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-white">{item.value.toLocaleString("id-ID")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Chart + Quick Menu */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Penerimaan Iuran</h3>
              <p className="text-xs text-zinc-500">Total iuran per bulan tahun 2024</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-zinc-900 dark:text-white">{formatCurrency(dashboardStats.totalPayments)}</p>
              <p className="text-xs text-zinc-500">Total tahun ini</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={paymentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Iuran" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Menu */}
        <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Menu Cepat</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickMenuItems.map((item) => {
              const QIcon = quickIcons[item.label] || UserPlus;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex flex-col items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-800/30 dark:hover:border-blue-900/50 dark:hover:bg-blue-900/10"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-sm`}>
                    <QIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-zinc-600 group-hover:text-blue-600 dark:text-zinc-400 dark:group-hover:text-blue-400">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity + Calendar */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200/50 bg-white p-6 dark:border-zinc-800/50 dark:bg-zinc-900/80">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Aktivitas Terkini</h3>
            <button className="text-xs font-medium text-blue-500 hover:text-blue-400">
              Lihat Semua
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.slice(0, 8).map((activity) => {
              const ActIcon = activityIcons[activity.type] || Users;
              const colorClass = activityColors[activity.type] || "bg-zinc-500/15 text-zinc-500";
              const timeAgo = getTimeAgo(activity.timestamp);

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                    <ActIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{activity.description}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar */}
        <CalendarWidget />
      </div>
    </div>
  );
}

// Helper function
function getTimeAgo(timestamp: string): string {
  const now = new Date("2024-12-20T09:00:00Z");
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  return `${diffDays} hari lalu`;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  
  // Render based on role
  if (user?.role === "anggota") {
    return <MemberDashboard />;
  }

  return <AdminDashboard />;
}

