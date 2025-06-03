import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./types";
import { activityLogsApi, dashboardApi } from "../../services/api";

/**
 * Hook to get dashboard statistics for super admin
 */
export const useSuperDashboardStats = () =>
    useQuery({
        queryKey: QueryKeys.dashboard.super,
        queryFn: dashboardApi.getSuperStats,
    });

/**
 * Hook to get dashboard statistics for admin
 */
export const useAdminDashboardStats = () =>
    useQuery({
        queryKey: QueryKeys.dashboard.admin,
        queryFn: dashboardApi.getAdminStats,
    });

/**
 * Hook to get activity logs
 */
export const useActivityLogs = () =>
    useQuery({
        queryKey: QueryKeys.logs.all,
        queryFn: activityLogsApi.getActivityLogs,
    });
