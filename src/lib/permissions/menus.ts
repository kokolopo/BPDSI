import { Permission } from "./permissions";
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  FileText, 
  Wallet, 
  Mail, 
  Megaphone, 
  Settings, 
  Activity, 
  CheckSquare, 
  ShieldCheck, 
  UserCircle, 
  CreditCard,
  FileCheck2,
  FolderOpen,
  BadgeCheck,
  ArrowRightLeft,
} from "lucide-react";

export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: any;
  permission: Permission;
}

export const adminMenus: MenuItem[] = [
  { id: "dashboard", title: "Dashboard", path: "/dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
  { id: "master_data", title: "Master Data", path: "/master-data/companies", icon: Database, permission: "view:master_data" },
  { id: "members", title: "Data Anggota", path: "/members", icon: Users, permission: "read:members" },
  { id: "registration", title: "Registrasi", path: "/registration", icon: FileText, permission: "read:registration" },
  { id: "approval", title: "Approval", path: "/approval", icon: CheckSquare, permission: "read:approval" },
  { id: "mutation", title: "Mutasi", path: "/mutation", icon: Activity, permission: "read:mutation" },
  { id: "payments", title: "Iuran", path: "/payments", icon: Wallet, permission: "read:payments" },
  { id: "letters", title: "Persuratan", path: "/letters", icon: Mail, permission: "read:letters" },
  { id: "announcements", title: "Pengumuman", path: "/announcements", icon: Megaphone, permission: "read:announcements" },
  { id: "users", title: "User Management", path: "/users", icon: ShieldCheck, permission: "read:users" },
  { id: "audit_log", title: "Audit Log", path: "/audit-log", icon: Activity, permission: "view:audit_log" },
  { id: "reports", title: "Laporan", path: "/reports", icon: FileCheck2, permission: "read:reports" },
  { id: "settings", title: "Pengaturan", path: "/settings", icon: Settings, permission: "read:settings" },
];

export const memberMenus: MenuItem[] = [
  { id: "dashboard", title: "Dashboard", path: "/dashboard", icon: LayoutDashboard, permission: "view:member_dashboard" },
  { id: "profile", title: "Profil Saya", path: "/profile", icon: UserCircle, permission: "view:member_profile" },
  { id: "member_card", title: "Kartu Anggota", path: "/member-card", icon: CreditCard, permission: "view:member_card" },
  { id: "membership_status", title: "Status Keanggotaan", path: "/membership-status", icon: BadgeCheck, permission: "view:membership_status" },
  { id: "my_mutations", title: "Riwayat Mutasi", path: "/my-mutations", icon: ArrowRightLeft, permission: "view:member_mutations" },
  { id: "my_payment", title: "Iuran Saya", path: "/my-payment", icon: Wallet, permission: "read:payments" },
  { id: "my_letters", title: "Surat Saya", path: "/my-letters", icon: Mail, permission: "view:member_letters" },
  { id: "my_documents", title: "Dokumen Saya", path: "/my-documents", icon: FolderOpen, permission: "view:member_document" },
  { id: "announcements", title: "Pengumuman", path: "/announcements", icon: Megaphone, permission: "read:announcements" },
  { id: "account_settings", title: "Pengaturan Akun", path: "/account-settings", icon: Settings, permission: "view:member_settings" },
];

export const getMenusForRole = (role: string, roleLevel: number): MenuItem[] => {
  // roleLevel 8 is Anggota
  if (role === "anggota" || roleLevel === 8) {
    return memberMenus;
  }
  return adminMenus;
};
