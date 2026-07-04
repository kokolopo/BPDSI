import { jsPDF } from "jspdf";
import { formatCurrency } from "./utils";

export const generateKuasaDebetPDF = (data: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Helper for center text
  const centerText = (text: string, y: number) => {
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  centerText("SURAT KUASA DEBET REKENING", 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  centerText("Untuk Pembayaran Iuran Serikat Pegawai Bank Pembangunan Daerah (BPD)", 26);
  centerText("Nomor:       /SK-DEBET/      /     ", 32);

  // Body
  doc.setFontSize(11);
  doc.text("Yang bertanda tangan di bawah ini, saya:", 20, 45);

  const startY = 55;
  const lineHeight = 8;

  // Pemberi Kuasa Details
  const fields = [
    { label: "Nama Lengkap", value: `: ${data.name || "-"}` },
    { label: "Nomor Induk Pegawai (NIP)", value: `: ${data.nik || "-"}` },
    { label: "Jabatan / Unit Kerja", value: `: ${data.position || "-"}` },
    { label: "Nomor Identitas (KTP/NIK)", value: `: ${data.nik || "-"}` },
    { label: "Alamat", value: `: ${data.address || "-"}` },
    { label: "Nomor Rekening Bank", value: `: ${data.bankAccount || "-"}` },
    { label: "Nama Bank / Cabang", value: `: ${data.bankName || "-"} / ${data.bankBranch || "-"}` },
    { label: "Nomor Telepon / HP", value: `: ${data.phone || "-"}` },
  ];

  fields.forEach((field, index) => {
    const y = startY + (index * lineHeight);
    doc.text(field.label, 20, y);
    doc.text(field.value, 85, y); // Aligned after the longest label
  });

  const nextY1 = startY + (fields.length * lineHeight) + 10;
  
  const text1 = doc.splitTextToSize("Selanjutnya disebut sebagai \"Pemberi Kuasa\", dengan ini menyatakan memberikan kuasa penuh kepada:", 170);
  doc.text(text1, 20, nextY1);

  const nextY2 = nextY1 + (text1.length * 6) + 5;
  doc.text("Nama Bank", 20, nextY2);
  doc.text(`: ${data.bankName || "-"}`, 85, nextY2);
  doc.text("Cabang", 20, nextY2 + lineHeight);
  doc.text(`: ${data.bankBranch || "-"}`, 85, nextY2 + lineHeight);

  const nextY3 = nextY2 + (lineHeight * 2) + 5;
  const text2 = doc.splitTextToSize("Selanjutnya disebut sebagai \"Penerima Kuasa\", yang bertindak untuk dan atas nama Serikat Pegawai Bank Pembangunan Daerah [Nama Serikat Pegawai BPD] (selanjutnya disebut \"Serikat Pegawai\"), untuk melaksanakan hal-hal sebagai berikut:", 170);
  doc.text(text2, 20, nextY3);

  const nextY4 = nextY3 + (text2.length * 6) + 5;
  doc.setFont("helvetica", "bold");
  doc.text("1. Objek Kuasa", 20, nextY4);
  
  doc.setFont("helvetica", "normal");
  const text3 = doc.splitTextToSize("Pemberi Kuasa dengan ini memberikan kuasa kepada Penerima Kuasa untuk melakukan pendebetan (auto-debet) secara berkala setiap bulan atas rekening milik Pemberi Kuasa sebagaimana tercantum di atas, guna pembayaran iuran keanggotaan Serikat Pegawai, dengan ketentuan sebagai berikut:", 160);
  doc.text(text3, 25, nextY4 + 6);

  const detailY = nextY4 + 6 + (text3.length * 6) + 5;
  const details = [
    { label: "Besaran Iuran per Bulan", value: `: Rp ${data.monthlyDues ? formatCurrency(Number(data.monthlyDues)).replace("Rp", "").trim() : "-"}` },
    { label: "Tanggal Pendebetan", value: `: Setiap tanggal ${data.deductionDate || "-"} pada setiap bulan` },
    { label: "Tujuan Pendebetan", value: ": Pembayaran iuran wajib anggota Serikat Pegawai BPD" },
    { label: "Rekening Tujuan", value: ": Rekening kas Serikat Pegawai" },
    { label: "Masa Berlaku Kuasa", value: ": Sejak tanggal ditandatangani sampai pencabutan" }
  ];

  details.forEach((detail, index) => {
    const y = detailY + (index * lineHeight);
    doc.text(detail.label, 25, y);
    doc.text(detail.value, 80, y);
  });

  const nextY5 = detailY + (details.length * lineHeight) + 10;
  
  doc.setFont("helvetica", "bold");
  doc.text("2. Kewajiban dan Kewenangan Penerima Kuasa", 20, nextY5);
  doc.text("3. Hak Pemberi Kuasa", 20, nextY5 + 8);
  doc.text("4. Ketentuan Lain-lain", 20, nextY5 + 16);
  
  doc.setFont("helvetica", "normal");
  const closureText = doc.splitTextToSize("Demikian Surat Kuasa Debet Rekening ini dibuat dengan sebenarnya, tanpa paksaan dari pihak manapun, dan dapat dipergunakan sebagaimana mestinya.", 170);
  doc.text(closureText, 20, nextY5 + 30);

  const date = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  
  const signY = nextY5 + 50;
  doc.text(`[Kota], ${date}`, 130, signY);
  doc.text("Pemberi Kuasa,", 20, signY + 10);
  doc.text("Penerima Kuasa", 130, signY + 10);

  doc.setFontSize(9);
  doc.text("(Materai 10.000)", 20, signY + 25);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`(${data.name || "________________"})`, 20, signY + 45);
  doc.text("(________________)", 130, signY + 45);
  
  doc.setFont("helvetica", "normal");
  doc.text(`NIP: ${data.nik || "________________"}`, 20, signY + 50);
  doc.text("Ketua Serikat Pekerja BPD", 130, signY + 50);

  doc.save(`Surat_Kuasa_Debet_${data.name || "Peserta"}.pdf`);
};
