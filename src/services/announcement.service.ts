import { announcements as initialAnnouncements } from "@/data/announcements";
import { BaseService } from "./base.service";
import type { Announcement, PaginatedResponse, QueryParams } from "@/types";

let announcements = [...initialAnnouncements];

export class AnnouncementService extends BaseService {
  static async getAll(params?: QueryParams): Promise<PaginatedResponse<Announcement>> {
    await this.simulateRequest();
    const filtered = this.applyFilters(announcements as unknown as Record<string, unknown>[], params) as unknown as Announcement[];
    return this.paginateResults(filtered, params);
  }

  static async getById(id: string): Promise<Announcement | null> {
    await this.simulateRequest();
    return announcements.find((a) => a.id === id) || null;
  }

  static async create(data: Omit<Announcement, "id" | "createdAt" | "updatedAt">): Promise<Announcement> {
    await this.simulateRequest();
    
    const newAnnouncement: Announcement = {
      ...data,
      id: this.generateNewId("ANN", announcements),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Put new announcements at the front
    announcements = [newAnnouncement, ...announcements];
    return newAnnouncement;
  }

  static async update(id: string, data: Partial<Announcement>): Promise<Announcement> {
    await this.simulateRequest();
    const index = announcements.findIndex((a) => a.id === id);
    if (index === -1) throw new Error("Pengumuman tidak ditemukan");
    
    announcements[index] = { ...announcements[index], ...data, updatedAt: new Date().toISOString() };
    return announcements[index];
  }

  static async delete(id: string): Promise<void> {
    await this.simulateRequest();
    announcements = announcements.filter((a) => a.id !== id);
  }
}
