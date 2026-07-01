import { members as initialMembers } from "@/data/members";
import { BaseService } from "./base.service";
import type { Member, PaginatedResponse, QueryParams } from "@/types";
import { randomDelay } from "@/lib/utils";

let members = [...initialMembers];

export class MemberService extends BaseService {
  static async getAll(params?: QueryParams): Promise<PaginatedResponse<Member>> {
    await this.simulateRequest();
    const filtered = this.applyFilters(members as unknown as Record<string, unknown>[], params) as unknown as Member[];
    return this.paginateResults(filtered, params);
  }

  static async getById(id: string): Promise<Member | null> {
    await this.simulateRequest();
    return members.find((m) => m.id === id) || null;
  }

  static async create(data: Omit<Member, "id" | "registrationNumber" | "createdAt" | "updatedAt">): Promise<Member> {
    await this.simulateRequest();
    
    // Generate Registration Number (e.g. YYYYMMXXX)
    const date = new Date();
    const yyyymm = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    const countThisMonth = members.filter(m => m.registrationNumber.startsWith(yyyymm)).length + 1;
    const registrationNumber = `${yyyymm}${String(countThisMonth).padStart(3, "0")}`;
    
    const newMember: Member = {
      ...data,
      id: this.generateNewId("MBR", members),
      registrationNumber,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    };
    
    members = [newMember, ...members];
    return newMember;
  }

  static async update(id: string, data: Partial<Member>): Promise<Member> {
    await this.simulateRequest();
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Anggota tidak ditemukan");
    
    members[index] = { ...members[index], ...data, updatedAt: new Date().toISOString() };
    return members[index];
  }

  static async delete(id: string): Promise<void> {
    await this.simulateRequest();
    members = members.filter((m) => m.id !== id);
  }

  // Simulate file upload (returns a fake URL)
  static async uploadDocument(file: File): Promise<string> {
    await randomDelay(1000, 2000); // Slower for file upload
    // Fake error occasionally
    if (Math.random() < 0.05) throw new Error("Gagal mengunggah file");
    
    return `/dummies/uploads/${file.name.replace(/\s+/g, '_')}`;
  }
}
