import type { Letter } from "@/types";

function generateLetters(): Letter[] {
  const letters: Letter[] = [];
  const senders = ["DPP BPDSI", "DPD Jakarta", "DPD Jawa Barat", "DPD Jawa Timur", "DPD Jawa Tengah", "Kementerian Ketenagakerjaan", "PT Astra International", "DPD Sumatera Utara", "DPD Bali", "DPD Sulawesi Selatan"];
  const receivers = ["Seluruh DPD BPDSI", "DPP BPDSI", "DPC Surabaya", "DPC Jakarta", "DPC Bandung", "Manajemen PT. Maju Bersama", "Seluruh Cabang", "DPD Banten", "Kementerian Ketenagakerjaan", "Disnaker Provinsi"];
  const outboxTitles = [
    "Undangan Rapat Koordinasi Nasional", "SK Pengangkatan Pengurus Cabang", "Pemberitahuan Audiensi dengan Manajemen",
    "Surat Edaran Kenaikan Iuran", "SK Pembentukan Panitia Munas", "Surat Tugas Delegasi ILO",
    "Rekomendasi Anggota untuk Pelatihan", "Surat Keputusan Mutasi Pengurus", "Pemberitahuan Rapat Evaluasi",
    "Undangan Pelatihan Kader", "SK Penetapan Pengurus Wilayah", "Surat Protes Kebijakan PHK",
    "Proposal Kerja Sama BPJS", "Surat Pernyataan Sikap Organisasi", "Undangan Halal Bihalal",
    "SK Pemberhentian Pengurus", "Surat Peringatan Tunggakan Iuran", "Rekomendasi Beasiswa Anak Anggota",
    "Surat Pengantar Delegasi", "Pemberitahuan Jadwal Musyawarah Cabang", "SK Hasil Musyawarah Cabang",
    "Surat Himbauan Keselamatan Kerja", "Undangan Workshop Negosiasi PKB", "Surat Mandat Aksi May Day",
    "SK Tim Advokasi Kasus PHI",
  ];
  const inboxTitles = [
    "Laporan Kegiatan Cabang Bulan Januari", "Edaran Aturan Upah Minimum 2024", "Permohonan Bantuan Hukum",
    "Laporan Keuangan Cabang Semester I", "Usulan Kenaikan UMK 2025", "Hasil Pemeriksaan Ketenagakerjaan",
    "Permohonan Pembukaan Cabang Baru", "Laporan Insiden K3", "Pengaduan Pelanggaran Hak Pekerja",
    "Undangan Tripartit Daerah", "Konfirmasi Kehadiran Munas", "Surat Balasan Audiensi Manajemen",
    "Laporan Penyelesaian Kasus PHI", "Permohonan Data Anggota", "Kiriman Materi Sosialisasi PKB",
    "Laporan Donasi Bencana", "Surat Rekomendasi dari Disnaker", "Pengajuan Cuti Organisasi",
    "Undangan Seminar Ketenagakerjaan", "Laporan Kegiatan Cabang Semester II", "Konfirmasi Peserta Pelatihan",
    "Surat dari Kemnaker tentang RUU Cipta Kerja", "Permohonan Mediasi Perselisihan", "Balasan Surat Protes PHK",
    "Laporan Akhir Tahun Cabang",
  ];
  const statuses: Array<"draft" | "published" | "archived"> = ["published", "published", "published", "archived", "draft"];

  for (let i = 1; i <= 50; i++) {
    const isOutbox = i % 2 === 1;
    const titles = isOutbox ? outboxTitles : inboxTitles;
    const titleIndex = (i - 1) % titles.length;
    const month = Math.min(Math.ceil(i / 4.2), 12);
    const day = Math.min(((i * 3) % 28) + 1, 28);
    const dateStr = `2024-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    letters.push({
      id: `LTR${String(i).padStart(3, "0")}`,
      letterNumber: isOutbox
        ? `${String(Math.ceil(i / 2)).padStart(3, "0")}/SP/DPP/2024`
        : `${String(Math.ceil(i / 2)).padStart(3, "0")}/EXT/${i % 3 === 0 ? "KEMNAKER" : "DPD"}/2024`,
      title: titles[titleIndex],
      type: isOutbox ? "outbox" : "inbox",
      date: dateStr,
      sender: isOutbox ? senders[0] : senders[i % senders.length],
      receiver: isOutbox ? receivers[i % receivers.length] : receivers[1],
      description: `${titles[titleIndex]} - ${isOutbox ? "Surat keluar" : "Surat masuk"} terkait kegiatan organisasi.`,
      attachmentUrl: i % 3 !== 0 ? `/dummies/surat_${String(i).padStart(3, "0")}.pdf` : undefined,
      status: statuses[i % statuses.length],
      createdAt: `${dateStr}T${String(8 + (i % 8)).padStart(2, "0")}:00:00Z`,
      updatedAt: `${dateStr}T${String(8 + (i % 8)).padStart(2, "0")}:30:00Z`,
    });
  }

  return letters;
}

export const letters: Letter[] = generateLetters();
