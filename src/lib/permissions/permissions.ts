import { RoleId } from "@/types";

export type Action = "create" | "read" | "update" | "delete" | "approve" | "export";
export type Subject = 
  | "dashboard"
  | "master_data"
  | "members"
  | "registration"
  | "approval"
  | "mutation"
  | "payments"
  | "letters"
  | "announcements"
  | "users"
  | "audit_log"
  | "reports"
  | "settings"
  | "member_dashboard"
  | "member_card"
  | "member_profile"
  | "member_payment"
  | "member_document"
  | "member_mutations"
  | "member_letters"
  | "member_settings"
  | "membership_status";

export type Permission = `${Action}:${Subject}` | `manage:${Subject}` | `view:${Subject}`;

// Helper to expand CRUD actions
const createCrud = (subject: Subject): Permission[] => [
  `create:${subject}`,
  `read:${subject}`,
  `update:${subject}`,
  `delete:${subject}`,
];

export const ROLE_PERMISSIONS: Record<RoleId, Permission[]> = {
  super_admin: [
    "view:dashboard",
    ...createCrud("master_data"),
    ...createCrud("members"),
    ...createCrud("registration"),
    ...createCrud("approval"), "approve:approval",
    ...createCrud("mutation"),
    ...createCrud("payments"),
    ...createCrud("letters"),
    ...createCrud("announcements"),
    ...createCrud("users"),
    ...createCrud("audit_log"),
    ...createCrud("reports"), "export:reports",
    ...createCrud("settings"),
  ],
  administrator: [
    "view:dashboard",
    ...createCrud("master_data"),
    ...createCrud("members"),
    ...createCrud("registration"),
    ...createCrud("approval"), "approve:approval",
    ...createCrud("mutation"),
    "view:payments",
    ...createCrud("letters"),
    ...createCrud("announcements"),
    ...createCrud("users"),
    "view:audit_log",
    ...createCrud("reports"), "export:reports",
    ...createCrud("settings"),
  ],
  pengurus_pusat: [
    "view:dashboard",
    "view:master_data",
    ...createCrud("members"),
    "view:registration",
    ...createCrud("approval"), "approve:approval",
    ...createCrud("mutation"),
    "view:payments",
    ...createCrud("letters"),
    ...createCrud("announcements"),
    "view:audit_log",
    ...createCrud("reports"), "export:reports",
  ],
  pengurus_wilayah: [
    "view:dashboard",
    ...createCrud("members"),
    "view:registration",
    ...createCrud("approval"), "approve:approval",
    ...createCrud("mutation"),
    "view:payments",
    ...createCrud("letters"),
    ...createCrud("announcements"),
    ...createCrud("reports"), "export:reports",
  ],
  pengurus_cabang: [
    "view:dashboard",
    ...createCrud("members"),
    ...createCrud("registration"),
    ...createCrud("approval"), "approve:approval",
    ...createCrud("mutation"),
    "view:payments",
    ...createCrud("letters"),
    ...createCrud("announcements"),
    ...createCrud("reports"), "export:reports",
  ],
  bendahara: [
    "view:dashboard",
    "view:members",
    ...createCrud("payments"),
    "view:letters",
    "view:announcements",
    ...createCrud("reports"), "export:reports",
  ],
  operator: [
    "view:dashboard",
    ...createCrud("members"),
    ...createCrud("registration"),
    "read:approval", // Review only
    "create:mutation", "read:mutation",
    "create:payments", "read:payments",
    ...createCrud("letters"),
    ...createCrud("announcements"),
    "view:reports",
  ],
  anggota: [
    "view:member_dashboard",
    "view:member_profile",
    "view:member_card",
    "view:membership_status",
    "view:member_mutations",
    "view:member_letters",
    "view:member_settings",
    "read:members", // Can only read own, logic handled in components/service
    "read:registration",
    "read:approval",
    "read:mutation",
    "read:payments",
    "read:letters",
    "read:announcements",
    "view:member_document"
  ],
};

export const hasPermission = (role: RoleId, permission: Permission): boolean => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};
