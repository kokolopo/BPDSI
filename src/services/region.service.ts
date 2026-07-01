import { provinces as initialProvinces, districts as initialDistricts, villages as initialVillages } from "@/data/regions";
import { BaseService } from "./base.service";
import type { Province, District, Village, PaginatedResponse, QueryParams } from "@/types";

export class RegionService extends BaseService {
  static async getProvinces(params?: QueryParams): Promise<PaginatedResponse<Province>> {
    await this.simulateRequest();
    const filtered = this.applyFilters(initialProvinces as unknown as Record<string, unknown>[], params) as unknown as Province[];
    return this.paginateResults(filtered, params);
  }

  static async getDistricts(provinceId?: string, params?: QueryParams): Promise<PaginatedResponse<District>> {
    await this.simulateRequest();
    let data = initialDistricts;
    if (provinceId) {
      data = data.filter((d) => d.provinceId === provinceId);
    }
    const filtered = this.applyFilters(data as unknown as Record<string, unknown>[], params) as unknown as District[];
    return this.paginateResults(filtered, params);
  }

  static async getVillages(districtId?: string, params?: QueryParams): Promise<PaginatedResponse<Village>> {
    await this.simulateRequest();
    let data = initialVillages;
    if (districtId) {
      data = data.filter((v) => v.districtId === districtId);
    }
    const filtered = this.applyFilters(data as unknown as Record<string, unknown>[], params) as unknown as Village[];
    return this.paginateResults(filtered, params);
  }
}
