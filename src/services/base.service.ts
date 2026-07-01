import { delay, randomDelay, maybeThrowError, paginate, generateId } from "@/lib/utils";
import type { PaginatedResponse, QueryParams } from "@/types";

/**
 * Base service class providing common CRUD simulation patterns.
 * All data access goes through services to enable easy migration to real API.
 */
export class BaseService {
  protected static async simulateRequest(): Promise<void> {
    await randomDelay(200, 600);
    maybeThrowError(0.02);
  }

  protected static applyFilters<T extends Record<string, unknown>>(
    items: T[],
    params?: QueryParams
  ): T[] {
    let filtered = [...items];

    // Search
    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (val) => typeof val === "string" && val.toLowerCase().includes(search)
        )
      );
    }

    // Filters
    if (params?.filters) {
      for (const [key, value] of Object.entries(params.filters)) {
        if (value && value !== "all") {
          filtered = filtered.filter((item) => {
            const itemValue = item[key];
            if (Array.isArray(value)) {
              return value.includes(String(itemValue));
            }
            return String(itemValue) === value;
          });
        }
      }
    }

    // Sort
    if (params?.sortBy) {
      const sortKey = params.sortBy;
      const order = params.sortOrder === "desc" ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === "string" && typeof bVal === "string") {
          return aVal.localeCompare(bVal) * order;
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
          return (aVal - bVal) * order;
        }
        return 0;
      });
    }

    return filtered;
  }

  protected static paginateResults<T>(
    items: T[],
    params?: QueryParams
  ): PaginatedResponse<T> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    return paginate(items, page, pageSize);
  }

  protected static generateNewId(prefix: string, items: { id: string }[]): string {
    const maxNum = items.reduce((max, item) => {
      const num = parseInt(item.id.replace(prefix, ""), 10);
      return num > max ? num : max;
    }, 0);
    return `${prefix}${String(maxNum + 1).padStart(3, "0")}`;
  }
}
