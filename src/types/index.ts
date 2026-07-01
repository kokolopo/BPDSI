// ==========================================
// AUTH TYPES
// ==========================================

export type RoleId =
  | "super_admin"
  | "administrator"
  | "operator"
  | "bendahara"
  | "pengurus_cabang"
  | "pengurus_wilayah"
  | "pengurus_pusat"
  | "anggota";

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  level: number; // 1 = highest (super admin), 8 = lowest (anggota)
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: RoleId;
  avatar?: string;
  phone: string;
  branchId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: Omit<User, "password"> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: Omit<User, "password">;
  message?: string;
}

// ==========================================
// MEMBER TYPES
// ==========================================

export type MemberStatus = "active" | "inactive" | "pending" | "suspended" | "retired";
export type Gender = "L" | "P";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type Religion = "islam" | "kristen" | "katolik" | "hindu" | "buddha" | "konghucu";
export type Education = "sd" | "smp" | "sma" | "d1" | "d2" | "d3" | "s1" | "s2" | "s3";

export interface Member {
  id: string;
  registrationNumber: string; // Nomor Registrasi Anggota
  nik: string; // NIK KTP
  name: string;
  gender: Gender;
  placeOfBirth: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  companyId: string;
  departmentId: string;
  branchId: string;
  position: string;
  joinDate: string;
  status: MemberStatus;
  documents?: { id: string; name: string; type: string; url?: string }[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// COMPANY & ORGANIZATION TYPES
// ==========================================

export interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  industry: string;
  totalEmployees: number;
  totalMembers: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  headName: string;
  provinceId: string;
  isActive: boolean;
  totalMembers: number;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// REGION TYPES
// ==========================================

export interface Province {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  name: string;
  provinceId: string;
}

export interface Village {
  id: string;
  name: string;
  districtId: string;
}

// ==========================================
// PAYMENT TYPES
// ==========================================

export type PaymentStatus = "pending" | "verified" | "rejected";
export type PaymentMethod = "transfer" | "cash" | "payroll_deduction";

export interface Payment {
  id: string;
  paymentNumber: string;
  memberId: string;
  amount: number;
  periodMonth: number;
  periodYear: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  proofUrl?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// LETTER TYPES
// ==========================================

export type LetterType = "inbox" | "outbox";
export type LetterStatus = "draft" | "published" | "archived";

export interface Letter {
  id: string;
  letterNumber: string;
  type: LetterType;
  title: string;
  description: string;
  sender: string;
  receiver: string;
  status: LetterStatus;
  date: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// ANNOUNCEMENT TYPES
// ==========================================

export type AnnouncementPriority = "low" | "medium" | "high" | "urgent";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  priority: AnnouncementPriority;
  isPublished: boolean;
  publishDate: string;
  expireDate?: string;
  targetBranches?: string[];
  attachments?: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// APPROVAL TYPES
// ==========================================

export type ApprovalType = "registration" | "mutation" | "resignation" | "promotion";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Approval {
  id: string;
  type: ApprovalType;
  requesterId: string;
  requesterName: string;
  description: string;
  status: ApprovalStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewNote?: string;
  reviewedAt?: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// AUDIT LOG TYPES
// ==========================================

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "approve"
  | "reject"
  | "export"
  | "import";

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: AuditAction;
  module: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  createdAt: string;
}

// ==========================================
// COMMON TYPES
// ==========================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, string | string[] | undefined>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// ==========================================
// DASHBOARD TYPES
// ==========================================

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  pendingApprovals: number;
  totalPayments: number;
  paymentThisMonth: number;
  totalCompanies: number;
  totalBranches: number;
  memberGrowth: number; // percentage
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface RecentActivity {
  id: string;
  type: "member" | "payment" | "approval" | "letter" | "announcement";
  description: string;
  user: string;
  timestamp: string;
}
