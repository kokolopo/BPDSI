"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentService } from "@/services/payment.service";
import type { Payment, QueryParams } from "@/types";

export function usePayments(params?: QueryParams) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => PaymentService.getAll(params),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => PaymentService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Payment, "id" | "paymentNumber" | "status" | "createdAt" | "updatedAt">) =>
      PaymentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, verifierName, status, notes }: { id: string; verifierName: string; status: "verified" | "rejected"; notes?: string }) =>
      PaymentService.verify(id, verifierName, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PaymentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
