import { branches as initialBranches } from "@/data/branches";
import { BaseService } from "./base.service";
import type { Branch, PaginatedResponse, QueryParams } from "@/types";

let branches = [...initialBranches];

export class BranchService extends BaseService {
  static async getAll(params?: QueryParams): Promise<PaginatedResponse<Branch>> {
    await this.simulateRequest();
    const filtered = this.applyFilters(branches as unknown as Record<string, unknown>[], params) as unknown as Branch[];
    return this.paginateResults(filtered, params);
  }

  static async getById(id: string): Promise<Branch | null> {
    await this.simulateRequest();
    return branches.find((b) => b.id === id) || null;
  }

  static async create(data: Omit<Branch, "id" | "createdAt" | "updatedAt">): Promise<Branch> {
    await this.simulateRequest();
    const newBranch: Branch = {
      ...data,
      id: this.generateNewId("BR", branches),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    branches = [newBranch, ...branches];
    return newBranch;
  }

  static async update(id: string, data: Partial<Branch>): Promise<Branch> {
    await this.simulateRequest();
    const index = branches.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Cabang tidak ditemukan");
    branches[index] = { ...branches[index], ...data, updatedAt: new Date().toISOString() };
    return branches[index];
  }

  static async delete(id: string): Promise<void> {
    await this.simulateRequest();
    branches = branches.filter((b) => b.id !== id);
  }
}
