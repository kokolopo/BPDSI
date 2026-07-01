import { payments as initialPayments } from "@/data/payments";
import { BaseService } from "./base.service";
import type { Payment, PaginatedResponse, QueryParams } from "@/types";

let payments = [...initialPayments];

export class PaymentService extends BaseService {
  static async getAll(params?: QueryParams): Promise<PaginatedResponse<Payment>> {
    await this.simulateRequest();
    const filtered = this.applyFilters(payments as unknown as Record<string, unknown>[], params) as unknown as Payment[];
    return this.paginateResults(filtered, params);
  }

  static async getById(id: string): Promise<Payment | null> {
    await this.simulateRequest();
    return payments.find((p) => p.id === id) || null;
  }

  static async create(data: Omit<Payment, "id" | "paymentNumber" | "status" | "createdAt" | "updatedAt">): Promise<Payment> {
    await this.simulateRequest();
    
    // Generate Invoice Number
    const date = new Date();
    const yyyymm = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    const countThisMonth = payments.filter(p => p.paymentNumber.includes(yyyymm)).length + 1;
    const paymentNumber = `INV-${yyyymm}-${String(countThisMonth).padStart(3, "0")}`;
    
    const newPayment: Payment = {
      ...data,
      id: this.generateNewId("PAY", payments),
      paymentNumber,
      status: "pending",
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    };
    
    payments = [newPayment, ...payments];
    return newPayment;
  }

  static async verify(id: string, verifierName: string, status: "verified" | "rejected", notes?: string): Promise<Payment> {
    await this.simulateRequest();
    const index = payments.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Data pembayaran tidak ditemukan");
    
    payments[index] = {
      ...payments[index],
      status,
      verifiedBy: verifierName,
      verifiedAt: new Date().toISOString(),
      notes,
      updatedAt: new Date().toISOString()
    };
    return payments[index];
  }

  static async delete(id: string): Promise<void> {
    await this.simulateRequest();
    payments = payments.filter((p) => p.id !== id);
  }
}
