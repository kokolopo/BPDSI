import { Role } from "@/types";

export const roles: Role[] = [
  { id: "super_admin", name: "Super Admin", description: "Akses penuh ke seluruh sistem", level: 1 },
  { id: "administrator", name: "Administrator", description: "Akses hampir penuh, kecuali pengaturan sistem", level: 2 },
  { id: "operator", name: "Operator", description: "Input data dan akses terbatas", level: 3 },
  { id: "bendahara", name: "Bendahara", description: "Fokus pada pengelolaan iuran dan keuangan", level: 4 },
  { id: "pengurus_cabang", name: "Pengurus Cabang", description: "Akses level cabang", level: 5 },
  { id: "pengurus_wilayah", name: "Pengurus Wilayah", description: "Akses level wilayah/provinsi", level: 6 },
  { id: "pengurus_pusat", name: "Pengurus Pusat", description: "Akses level nasional", level: 7 },
  { id: "anggota", name: "Anggota", description: "Hanya melihat data sendiri", level: 8 },
];
