import { useQuery } from "@tanstack/react-query";
import type { DashboardMetrics, Transaction, Activity, RevenueData } from "@shared/schema";

export function useDashboardMetrics() {
  return useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useTransactions(limit: number = 10) {
  return useQuery<Transaction[]>({
    queryKey: ["/api/dashboard/transactions", { limit }],
    refetchInterval: 30000,
  });
}

export function useActivities(limit: number = 10) {
  return useQuery<Activity[]>({
    queryKey: ["/api/dashboard/activities", { limit }],
    refetchInterval: 30000,
  });
}

export function useRevenueData(days: number = 7) {
  return useQuery<RevenueData[]>({
    queryKey: ["/api/dashboard/revenue", { days }],
    refetchInterval: 30000,
  });
}
