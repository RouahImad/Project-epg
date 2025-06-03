import { useAuth } from "../contexts/AuthContext";
import SuperAdminDashboardContent from "../components/dashboard/SuperAdminDashboardContent";
import AdminDashboardContent from "../components/dashboard/AdminDashboardContent";
import type {
    AdminDashboardData,
    SuperDashboardData,
} from "../types/api.types";
import { useAdminDashboardStats, useSuperDashboardStats } from "../hooks/api/";

const Dashboard = () => {
    const { userRole } = useAuth();

    const dashboardQuery =
        userRole === "super_admin"
            ? useSuperDashboardStats()
            : useAdminDashboardStats();

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
