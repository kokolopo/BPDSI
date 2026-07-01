import { MemberService } from "./member.service";
import { BaseService } from "./base.service";
import type { Member, PaginatedResponse, QueryParams } from "@/types";

export type ApprovalRequest = {
  id: string;
  type: "REGISTRATION" | "MUTATION";
  memberId: string;
  memberInfo: Member;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
};

export class ApprovalService extends BaseService {
  static async getPendingApprovals(params?: QueryParams): Promise<PaginatedResponse<ApprovalRequest>> {
    await this.simulateRequest();
    
    // We mock the approvals based on the members that are 'pending'
    // Some are registrations (no join date yet or new), some might be mutations.
    // For simplicity, all pending members are treated as Registration Approvals here.
    
    const membersData = await MemberService.getAll({ pageSize: 500, filters: { status: "pending" } });
    
    const requests: ApprovalRequest[] = membersData.data.map(m => ({
      id: `APP-${m.id}`,
      type: "REGISTRATION",
      memberId: m.id,
      memberInfo: m,
      requestDate: m.createdAt,
      status: "pending",
    }));

    const filtered = this.applyFilters(requests as unknown as Record<string, unknown>[], params) as unknown as ApprovalRequest[];
    return this.paginateResults(filtered, params);
  }

  static async approve(approvalId: string, memberId: string, notes?: string): Promise<void> {
    await this.simulateRequest();
    await MemberService.update(memberId, { status: "active" });
    // In a real app, we'd also record the approval history and notes
  }

  static async reject(approvalId: string, memberId: string, notes?: string): Promise<void> {
    await this.simulateRequest();
    await MemberService.update(memberId, { status: "rejected" as any }); // Or inactive
  }
}
