import { letters as initialLetters } from "@/data/letters";
import { BaseService } from "./base.service";
import type { Letter, PaginatedResponse, QueryParams } from "@/types";

let letters = [...initialLetters];

export class LetterService extends BaseService {
  static async getAll(params?: QueryParams): Promise<PaginatedResponse<Letter>> {
    await this.simulateRequest();
    const filtered = this.applyFilters(letters as unknown as Record<string, unknown>[], params) as unknown as Letter[];
    return this.paginateResults(filtered, params);
  }

  static async getById(id: string): Promise<Letter | null> {
    await this.simulateRequest();
    return letters.find((l) => l.id === id) || null;
  }

  static async create(data: Omit<Letter, "id" | "createdAt" | "updatedAt">): Promise<Letter> {
    await this.simulateRequest();
    
    const newLetter: Letter = {
      ...data,
      id: this.generateNewId("LTR", letters),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    letters = [newLetter, ...letters];
    return newLetter;
  }

  static async update(id: string, data: Partial<Letter>): Promise<Letter> {
    await this.simulateRequest();
    const index = letters.findIndex((l) => l.id === id);
    if (index === -1) throw new Error("Surat tidak ditemukan");
    
    letters[index] = { ...letters[index], ...data, updatedAt: new Date().toISOString() };
    return letters[index];
  }

  static async delete(id: string): Promise<void> {
    await this.simulateRequest();
    letters = letters.filter((l) => l.id !== id);
  }
}
