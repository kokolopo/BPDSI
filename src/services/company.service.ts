import { companies as initialCompanies } from "@/data/companies";
import { BaseService } from "./base.service";
import type { Company, PaginatedResponse, QueryParams } from "@/types";

let companies = [...initialCompanies];

export class CompanyService extends BaseService {
  static async getAll(params?: QueryParams): Promise<PaginatedResponse<Company>> {
    await this.simulateRequest();
    const filtered = this.applyFilters(companies as unknown as Record<string, unknown>[], params) as unknown as Company[];
    return this.paginateResults(filtered, params);
  }

  static async getById(id: string): Promise<Company | null> {
    await this.simulateRequest();
    return companies.find((c) => c.id === id) || null;
  }

  static async create(data: Omit<Company, "id" | "createdAt" | "updatedAt">): Promise<Company> {
    await this.simulateRequest();
    const newCompany: Company = {
      ...data,
      id: this.generateNewId("CMP", companies),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    companies = [newCompany, ...companies];
    return newCompany;
  }

  static async update(id: string, data: Partial<Company>): Promise<Company> {
    await this.simulateRequest();
    const index = companies.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Perusahaan tidak ditemukan");
    companies[index] = { ...companies[index], ...data, updatedAt: new Date().toISOString() };
    return companies[index];
  }

  static async delete(id: string): Promise<void> {
    await this.simulateRequest();
    companies = companies.filter((c) => c.id !== id);
  }
}
