import { departments as initialDepartments } from "@/data/departments";
import { BaseService } from "./base.service";
import type { Department, PaginatedResponse, QueryParams } from "@/types";

let departments = [...initialDepartments];

export class DepartmentService extends BaseService {
  static async getAll(params?: QueryParams): Promise<PaginatedResponse<Department>> {
    await this.simulateRequest();
    const filtered = this.applyFilters(departments as unknown as Record<string, unknown>[], params) as unknown as Department[];
    return this.paginateResults(filtered, params);
  }

  static async getById(id: string): Promise<Department | null> {
    await this.simulateRequest();
    return departments.find((d) => d.id === id) || null;
  }

  static async create(data: Omit<Department, "id" | "createdAt" | "updatedAt">): Promise<Department> {
    await this.simulateRequest();
    const newDepartment: Department = {
      ...data,
      id: this.generateNewId("DEP", departments),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    departments = [newDepartment, ...departments];
    return newDepartment;
  }

  static async update(id: string, data: Partial<Department>): Promise<Department> {
    await this.simulateRequest();
    const index = departments.findIndex((d) => d.id === id);
    if (index === -1) throw new Error("Departemen tidak ditemukan");
    departments[index] = { ...departments[index], ...data, updatedAt: new Date().toISOString() };
    return departments[index];
  }

  static async delete(id: string): Promise<void> {
    await this.simulateRequest();
    departments = departments.filter((d) => d.id !== id);
  }
}
