import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../services/api";
import SuperAdminDashboardContent from "../components/dashboard/SuperAdminDashboardContent";
import AdminDashboardContent from "../components/dashboard/AdminDashboardContent";
import type {
    AdminDashboardData,
    SuperDashboardData,
} from "../types/api.types";

const Dashboard = () => {
    const { userRole } = useAuth();

    // Fetch dashboard data based on role
    const dashboardQuery = useQuery<SuperDashboardData | AdminDashboardData>({
        queryKey: ["dashboard", userRole],
        queryFn: () =>
            userRole === "super_admin"
                ? dashboardApi.getSuperStats()
                : dashboardApi.getAdminStats(),
    });

    if (dashboardQuery.isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <span className="ml-4 text-indigo-600 font-semibold">
                    Loading dashboard...
                </span>
            </div>
        );
    }

    if (dashboardQuery.isError || !dashboardQuery.data) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <span className="text-red-500 font-semibold">
                    Failed to load dashboard data.
                </span>
            </div>
        );
    }

    if (userRole === "super_admin") {
        return (
            <SuperAdminDashboardContent
                data={dashboardQuery.data as SuperDashboardData}
            />
        );
    }

    return (
        <AdminDashboardContent
            data={dashboardQuery.data as AdminDashboardData}
        />
    );
};

export default Dashboard;
