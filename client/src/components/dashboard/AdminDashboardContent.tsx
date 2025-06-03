import StatCard from "./StatCard";
import DashboardCharts from "./DashboardCharts";
import { FiTrendingUp } from "react-icons/fi";
import type { AdminDashboardData } from "../../types/api.types";
import {
    formatDateTime,
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
                                    Entity ID
                                </th>
                                <th className="text-left font-semibold pb-3 px-4 whitespace-nowrap bg-white">
                                    Details
                                </th>
                                <th className="text-left font-semibold pb-3 px-4 whitespace-nowrap bg-white">
                                    Timestamp
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentActions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-4 text-center text-gray-400"
                                    >
                                        No recent actions found.
                                    </td>
                                </tr>
                            ) : (
                                data.recentActions.map((act, idx) => (
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
                                            {act.entityType}
                                        </td>
                                        <td className="py-2 px-4">
                                            {act.entityId}
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
                                        <td className="py-2 px-4 text-gray-400 whitespace-nowrap">
                                            {formatDateTime(act.timestamp)}
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
