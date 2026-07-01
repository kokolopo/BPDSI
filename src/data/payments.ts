import type { Payment } from "@/types";

// Helper to generate 300 payments across members and months
function generatePayments(): Payment[] {
  const methods: Array<"transfer" | "cash" | "payroll_deduction"> = ["transfer", "cash", "payroll_deduction"];
  const statuses: Array<"pending" | "verified" | "rejected"> = ["verified", "verified", "verified", "verified", "pending", "rejected"];
  const verifiers = ["Admin Pusat", "Bendahara Cabang", "Sistem Payroll", "Dewi Lestari", "Ahmad Fauzi"];
  const payments: Payment[] = [];

  let counter = 1;
  // Generate payments for members MBR001-MBR080 across months Jan-Dec 2024
  for (let month = 1; month <= 12; month++) {
    // Each month ~25 members pay
    const memberCount = month <= 6 ? 22 : 28;
    for (let m = 0; m < memberCount && counter <= 300; m++) {
      const memberId = `MBR${String((m % 80) + 1).padStart(3, "0")}`;
      const status = statuses[counter % statuses.length];
      const method = methods[counter % methods.length];
      const day = Math.min((counter % 28) + 1, 28);
      const paymentDate = `2024-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(8 + (counter % 10)).padStart(2, "0")}:${String((counter * 7) % 60).padStart(2, "0")}:00Z`;

      const payment: Payment = {
        id: `PAY${String(counter).padStart(3, "0")}`,
        paymentNumber: `INV-2024${String(month).padStart(2, "0")}-${String(counter).padStart(3, "0")}`,
        memberId,
        amount: 50000,
        periodMonth: month,
        periodYear: 2024,
        paymentDate,
        paymentMethod: method,
        status,
        createdAt: paymentDate,
        updatedAt: paymentDate,
      };

      if (status === "verified") {
        payment.verifiedBy = verifiers[counter % verifiers.length];
        payment.verifiedAt = paymentDate;
      }
      if (method === "transfer" && counter % 3 === 0) {
        payment.proofUrl = `/dummies/proofs/pay${String(counter).padStart(3, "0")}.jpg`;
      }
      if (status === "rejected") {
        payment.notes = "Bukti transfer buram atau tidak sesuai nominal. Mohon upload ulang.";
      }

      payments.push(payment);
      counter++;
    }
  }

  return payments;
}

export const payments: Payment[] = generatePayments();
