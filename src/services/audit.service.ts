import { audits as initialAudits } from "@/data/audits";
import { BaseService } from "./base.service";
import type { PaginatedResponse, QueryParams, AuditLog } from "@/types";

let audits = [...initialAudits];

export class AuditService extends BaseService {
  static async getAll(params?: QueryParams): Promise<PaginatedResponse<AuditLog>> {
    await this.simulateRequest(); // Fast response for logs
    const filtered = this.applyFilters(audits as unknown as Record<string, unknown>[], params) as unknown as AuditLog[];
    return this.paginateResults(filtered, params);
  }

  static async log(action: import("@/types").AuditAction, module: string, userId: string, userName: string, description: string): Promise<void> {
    const newLog: AuditLog = {
      id: `LOG${Date.now()}`,
      action,
      module,
      userId,
      userName,
      description,
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
      createdAt: new Date().toISOString(),
    };
    audits = [newLog, ...audits];
  }
}
