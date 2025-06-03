import StatCard from "./StatCard";
import DashboardCharts from "./DashboardCharts";
import { FiTrendingUp } from "react-icons/fi";
import type { AdminDashboardData } from "../../types/api.types";
import {
    formatLargeNumber,
    formatMoney,
    formatMoneyCompact,
} from "../../utils/helpers";

interface Props {
    data: AdminDashboardData;
}

const AdminDashboardContent = ({ data }: Props) => {
    return (
        <div className="container mx-auto px-4 py-8 md:max-w-[85vw]">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-indigo-500" /> Dashboard
            </h2>
            <div className="grid max-[486px]:grid-cols-1 max-[886px]:grid-cols-2 min-[886px]:grid-cols-4 gap-6 mb-8">
                {/* md:grid-cols-4  */}
                <StatCard
                    icon="dollar"
                    label="My Income"
                    value={formatMoneyCompact(data.myIncome, 1)}
                    tooltip={formatMoney(data.myIncome)}
                    className="hover:shadow-md transition-shadow duration-200 border border-gray-100 bg-gradient-to-br from-green-50 to-white"
                />
                <StatCard
                    icon="users"
                    label="My Students"
                    value={formatLargeNumber(data.myStudentsCount)}
                    tooltip={data.myStudentsCount.toLocaleString()}
                    className="hover:shadow-md transition-shadow duration-200 border border-gray-100 bg-gradient-to-br from-blue-50 to-white"
                />
                <StatCard
                    icon="activity"
                    label="Outstanding"
                    value={formatMoneyCompact(data.myOutstandingPayments, 1)}
                    tooltip={formatMoney(data.myOutstandingPayments)}
                    className="hover:shadow-md transition-shadow duration-200 border border-gray-100 bg-gradient-to-br from-yellow-50 to-white"
                />
                <StatCard
                    icon="user"
                    label="My Activity"
                    value={formatLargeNumber(data.myActivityCount)}
                    tooltip={data.myActivityCount.toLocaleString()}
                    className="hover:shadow-md transition-shadow duration-200 border border-gray-100 bg-gradient-to-br from-indigo-50 to-white"
                />
            </div>

            <DashboardCharts role="admin" data={data} />
            <div className="bg-white rounded-xl shadow p-6 mb-8">
                <h3 className="font-semibold mb-4">Recent Actions</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-3 py-2 text-left font-semibold">
                                    User
                                </th>
                                <th className="px-3 py-2 text-left font-semibold">
                                    Action
                                </th>
                                <th className="px-3 py-2 text-left font-semibold">
                                    Entity
                                </th>
                                <th className="px-3 py-2 text-left font-semibold">
                                    Entity ID
                                </th>
                                <th className="px-3 py-2 text-left font-semibold">
                                    Details
                                </th>
                                <th className="px-3 py-2 text-left font-semibold">
                                    Timestamp
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentActions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-3 py-4 text-center text-gray-400"
                                    >
                                        No recent actions found.
                                    </td>
                                </tr>
                            ) : (
                                data.recentActions.map((act, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b last:border-b-0 hover:bg-gray-50 transition"
                                    >
                                        <td className="px-3 py-2">
                                            {act.userName}
                                        </td>
                                        <td className="px-3 py-2">
                                            {act.action}
                                        </td>
                                        <td className="px-3 py-2">
                                            {act.entityType}
                                        </td>
                                        <td className="px-3 py-2">
                                            {act.entityId}
                                        </td>
                                        <td className="px-3 py-2">
                                            {act.details || (
                                                <span className="text-gray-400 italic">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-gray-400">
                                            {act.timestamp}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardContent;
