import type { AuditLog, AuditAction } from "@/types";

function generateAuditLogs(): AuditLog[] {
  const logs: AuditLog[] = [];
  const actions: AuditAction[] = ["create", "update", "delete", "login", "logout", "approve", "reject", "export", "import"];
  const modules = ["Auth", "Anggota", "Master Data", "Iuran", "Persetujuan", "Surat", "Pengumuman", "User Management", "Mutasi", "Laporan"];
  const users = [
    { id: "USR001", name: "Ahmad Fauzi" },
    { id: "USR002", name: "Siti Rahayu" },
    { id: "USR003", name: "Budi Santoso" },
    { id: "USR004", name: "Dewi Lestari" },
    { id: "USR005", name: "Eko Prasetyo" },
    { id: "USR006", name: "Fatimah Az-Zahra" },
    { id: "USR007", name: "Gunawan Wibisono" },
    { id: "USR009", name: "Irfan Hakim" },
  ];
  const ips = ["192.168.1.10", "192.168.1.15", "114.120.45.12", "110.138.22.9", "203.111.43.22", "180.244.12.88", "36.72.105.33", "103.28.14.5"];
  const descriptions: Record<string, string[]> = {
    login: ["Berhasil login ke sistem", "Login dari perangkat baru", "Login via mobile app"],
    logout: ["Logout dari sistem", "Session expired - auto logout"],
    create: [
      "Menambahkan anggota baru: {name}", "Menambahkan cabang baru: Cabang {city}",
      "Membuat surat: SK-2024/{num}", "Membuat pengumuman baru", "Menambahkan data iuran bulan {month}",
      "Membuat user baru: {email}", "Menambahkan departemen baru",
    ],
    update: [
      "Mengubah data anggota: MBR{num}", "Memperbarui profil pengguna", "Mengubah status anggota menjadi aktif",
      "Update data perusahaan: CMP{num}", "Memperbarui pengumuman: ANN{num}", "Mengubah status surat",
    ],
    delete: [
      "Menghapus surat dengan no: {letterNo}", "Menghapus draft pengumuman", "Menghapus data duplikat anggota",
    ],
    approve: [
      "Menyetujui pendaftaran anggota baru: MBR{num}", "Menyetujui mutasi anggota", "Menyetujui permintaan cuti organisasi",
    ],
    reject: [
      "Menolak pendaftaran anggota: data tidak lengkap", "Menolak mutasi: persyaratan belum terpenuhi",
    ],
    export: [
      "Export laporan anggota format PDF", "Export data iuran ke Excel", "Export laporan keuangan bulanan",
    ],
    import: [
      "Import data anggota dari Excel (45 records)", "Import data pembayaran batch",
    ],
  };
  const cities = ["Jakarta Selatan", "Bandung", "Surabaya", "Semarang", "Medan", "Makassar", "Denpasar", "Palembang"];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  for (let i = 1; i <= 100; i++) {
    const action = actions[i % actions.length];
    const module = action === "login" || action === "logout" ? "Auth" : modules[(i * 3) % modules.length];
    const user = users[i % users.length];
    const descs = descriptions[action];
    let desc = descs[i % descs.length];
    desc = desc
      .replace("{name}", `Anggota-${String(i).padStart(3, "0")}`)
      .replace("{city}", cities[i % cities.length])
      .replace("{num}", String((i * 7) % 100).padStart(3, "0"))
      .replace("{month}", months[i % 12])
      .replace("{letterNo}", `${String(i).padStart(3, "0")}/SP/DPP/2024`)
      .replace("{email}", `user${i}@example.com`);

    const month = Math.min(Math.ceil(i / 8.4), 12);
    const day = Math.min(((i * 2) % 28) + 1, 28);
    const hour = 7 + (i % 12);
    const minute = (i * 13) % 60;
    const timestamp = `2024-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00Z`;

    logs.push({
      id: `LOG${String(i).padStart(3, "0")}`,
      userId: user.id,
      userName: user.name,
      action,
      module,
      description: desc,
      ipAddress: ips[i % ips.length],
      userAgent: i % 2 === 0
        ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        : "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36",
      createdAt: timestamp,
    });
  }

  return logs;
}

export const audits: AuditLog[] = generateAuditLogs();
