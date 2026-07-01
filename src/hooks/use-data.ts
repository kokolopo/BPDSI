"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnnouncementService } from "@/services/announcement.service";
import { LetterService } from "@/services/letter.service";
import { CompanyService } from "@/services/company.service";
import { BranchService } from "@/services/branch.service";
import { AuditService } from "@/services/audit.service";
import type { QueryParams } from "@/types";

// ===== Announcements =====
export function useAnnouncements(params?: QueryParams) {
  return useQuery({
    queryKey: ["announcements", params],
    queryFn: () => AnnouncementService.getAll(params),
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => AnnouncementService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

// ===== Letters =====
export function useLetters(params?: QueryParams) {
  return useQuery({
    queryKey: ["letters", params],
    queryFn: () => LetterService.getAll(params),
  });
}

export function useCreateLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => LetterService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letters"] });
    },
  });
}

// ===== Companies =====
export function useCompanies(params?: QueryParams) {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => CompanyService.getAll(params),
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => CompanyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

// ===== Branches =====
export function useBranches(params?: QueryParams) {
  return useQuery({
    queryKey: ["branches", params],
    queryFn: () => BranchService.getAll(params),
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => BranchService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}

// ===== Audit Logs =====
export function useAuditLogs(params?: QueryParams) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => AuditService.getAll(params),
  });
}
