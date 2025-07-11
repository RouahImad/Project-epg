import StatCard from "./StatCard";
import DashboardCharts from "./DashboardCharts";
import { FiTrendingUp, FiUsers, FiActivity, FiAward } from "react-icons/fi";
import type { SuperDashboardData } from "../../types/api.types";
import { useNavigate } from "react-router";
import {
    formatDateTime,
    formatLargeNumber,
    formatMoney,
    formatMoneyCompact,
} from "../../utils/helpers";

interface Props {
    data: SuperDashboardData;
}

const SuperAdminDashboardContent = ({ data }: Props) => {
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-8 md:max-w-[85vw]">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-indigo-500" /> Dashboard
            </h2>
            <div className="grid max-[486px]:grid-cols-1 max-[886px]:grid-cols-2 min-[886px]:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon="dollar"
                    label="Total Income"
                    value={formatMoneyCompact(data.totalIncome, 1)}
                    tooltip={formatMoney(data.totalIncome)}
                    className="hover:shadow-md transition-shadow duration-200 border border-gray-100 bg-gradient-to-br from-green-50 to-white"
                />
                <StatCard
                    icon="users"
                    label="Students"
                    value={formatLargeNumber(data.studentCount)}
                    tooltip={data.studentCount.toLocaleString()}
                    className="hover:shadow-md transition-shadow duration-200 border border-gray-100 bg-gradient-to-br from-blue-50 to-white"
                />
                <StatCard
                    icon="user"
                    label="Staff"
                    value={formatLargeNumber(data.staffCount)}
                    tooltip={data.staffCount.toLocaleString()}
                    className="hover:shadow-md transition-shadow duration-200 border border-gray-100 bg-gradient-to-br from-indigo-50 to-white"
                />
                <StatCard
                    icon="activity"
                    label="Outstanding"
                    value={formatMoneyCompact(data.outstandingBalance, 1)}
                    tooltip={formatMoney(data.outstandingBalance)}
                    className="hover:shadow-md transition-shadow duration-200 border border-gray-100 bg-gradient-to-br from-yellow-50 to-white"
                />
            </div>
            <DashboardCharts role="super_admin" data={data} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* System Stats */}
                <div className="bg-white rounded-xl shadow p-6 h-fit">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <FiUsers className="text-indigo-400" /> System Stats
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Total Users */}
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition">
                            <div className="bg-indigo-200 text-indigo-700 rounded-full p-2">
                                <FiUsers size={22} />
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs">
                                    Total Users
                                </span>
                                <div className="font-bold text-lg">
                                    {data.systemStats.totalUsers}
                                </div>
                            </div>
                        </div>
                        {/* Active Users */}
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition">
                            <div className="bg-green-200 text-green-700 rounded-full p-2">
                                <FiActivity size={22} />
                            </div>
                            <div className="flex-1">
                                <span className="text-gray-500 text-xs">
                                    Active Users
                                </span>
                                <div className="font-bold text-lg">
                                    {data.systemStats.activeUsers}
                                </div>
                                {/* Progress bar */}
                                <div className="w-full bg-green-100 rounded-full h-2 mt-1">
                                    <div
                                        className="bg-green-400 h-2 rounded-full transition-all"
                                        style={{
                                            width: `${Math.min(
                                                (data.systemStats.activeUsers /
                                                    Math.max(
                                                        data.systemStats
                                                            .totalUsers,
                                                        1
                                                    )) *
                                                    100,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        {/* Majors */}
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition">
                            <div className="bg-yellow-200 text-yellow-700 rounded-full p-2">
                                <FiAward size={22} />
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs">
                                    Majors
                                </span>
                                <div className="font-bold text-lg">
                                    {data.systemStats.totalMajors}
                                </div>
                            </div>
                        </div>
                        {/* Avg Payment */}
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-pink-50 hover:bg-pink-100 transition">
                            <div className="bg-pink-200 text-pink-700 rounded-full p-2">
                                <FiTrendingUp size={22} />
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs">
                                    Avg Payment
                                </span>
                                <div className="font-bold text-lg">
                                    {data.systemStats.averagePaymentAmount.toLocaleString(
                                        undefined,
                                        { maximumFractionDigits: 2 }
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Top Staff */}
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <FiAward className="text-yellow-500" /> Top Staff by
                        Income
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left font-semibold pb-2">
                                        #
                                    </th>
                                    <th className="text-left font-semibold pb-2">
                                        Name
                                    </th>
                                    <th className="text-left font-semibold pb-2">
                                        Income
                                    </th>
                                    <th className="text-left font-semibold pb-2">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.sortedStaff
                                    .slice(0, 5)
                                    .map((staff, idx) => (
                                        <tr
                                            key={staff.userId}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="py-1 pr-2">
                                                {idx + 1}
                                            </td>
                                            <td className="py-1 pr-2">
                                                {staff.userName}
                                            </td>
                                            <td
                                                className="py-1 pr-2"
                                                title={formatMoney(
                                                    staff.income
                                                )}
                                            >
                                                {formatMoneyCompact(
                                                    staff.income
                                                )}
                                            </td>
                                            <td className="py-1">
                                                {staff.joinedAt}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <FiActivity className="text-pink-500" /> Recent Activity
                    </h3>
                    <button
                        type="button"
                        onClick={() => navigate("/admin/logs")}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline bg-transparent border-0 p-0"
                    >
                        View all
                    </button>
                </div>
                {data.recentActivity.length === 0 ? (
                    <div className="px-1.5 py-2 text-gray-500 text-center italic">
                        No recent activity
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-separate border-spacing-y-1">
                            <thead>
                                <tr>
                                    <th className="text-left font-semibold pb-3 px-4 whitespace-nowrap bg-white">
                                        User
                                    </th>
                                    <th className="text-left font-semibold pb-3 px-4 whitespace-nowrap bg-white">
                                        Action
                                    </th>
                                    <th className="text-left font-semibold pb-3 px-4 whitespace-nowrap bg-white">
                                        Entity
                                    </th>
                                    <th className="text-left font-semibold pb-3 px-4 whitespace-nowrap bg-white">
                                        Timestamp
                                    </th>
                                    <th className="text-left font-semibold pb-3 px-4 whitespace-nowrap bg-white">
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentActivity.map((act, idx) => (
                                    <tr
                                        key={idx}
                                        className="bg-gray-50 hover:bg-indigo-50 transition rounded-lg shadow-sm"
                                    >
                                        <td className="py-2 px-4 font-medium text-gray-700 max-w-[160px] truncate">
                                            {act.username}
                                        </td>
                                        <td className="py-2 px-4 whitespace-nowrap">
                                            {act.action}
                                        </td>
                                        <td className="py-2 px-4 whitespace-nowrap">
                                            {act.entityType} (#{act.entityId})
                                        </td>
                                        <td className="py-2 px-4 text-gray-400 whitespace-nowrap">
                                            {formatDateTime(act.timestamp)}
                                        </td>
                                        <td className="py-2 px-4">
                                            {act.details ? (
                                                <span className="text-gray-500 italic">
                                                    {act.details}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminDashboardContent;
