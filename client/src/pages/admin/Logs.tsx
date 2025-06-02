import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { activityLogsApi } from "../../services/api";
import { FiActivity, FiSearch, FiX } from "react-icons/fi";
import type { LogsWithUserName } from "../../types";

const Logs = () => {
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    const [entityFilter, setEntityFilter] = useState("");
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["activityLogs"],
        queryFn: activityLogsApi.getActivityLogs,
    });

    // Get unique actions and entities for filter dropdowns
    const actions =
        data && Array.isArray(data)
            ? data.reduce<string[]>((acc, log) => {
                  if (log.action && !acc.includes(log.action))
                      acc.push(log.action);
                  return acc;
              }, [])
            : [];
    const entities =
        data && Array.isArray(data)
            ? data.reduce<string[]>((acc, log) => {
                  if (log.entityType && !acc.includes(log.entityType))
                      acc.push(log.entityType);
                  return acc;
              }, [])
            : [];

    // Filtered logs
    const filteredLogs =
        data?.filter((log) => {
            const matchesSearch =
                !search ||
                [
                    log.username,
                    log.action,
                    log.entityType,
                    log.entityId,
                    log.timestamp,
                ]
                    .filter(Boolean)
                    .some((field) =>
                        String(field)
                            .toLowerCase()
                            .includes(search.toLowerCase())
                    );
            const matchesAction = !actionFilter || log.action === actionFilter;
            const matchesEntity =
                !entityFilter || log.entityType === entityFilter;
            return matchesSearch && matchesAction && matchesEntity;
        }) || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FiActivity className="text-pink-500" /> Logs
            </h2>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                <div className="relative w-full md:w-1/3 mr-auto">
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    {search && (
                        <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                            type="button"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    )}
                </div>
                <select
                    className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                >
                    <option value="">All Actions</option>
                    {actions.map((action) => (
                        <option key={action} value={action}>
                            {action}
                        </option>
                    ))}
                </select>
                <select
                    className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    value={entityFilter}
                    onChange={(e) => setEntityFilter(e.target.value)}
                >
                    <option value="">All Entities</option>
                    {entities.map((entity) => (
                        <option key={entity} value={entity}>
                            {entity}
                        </option>
                    ))}
                </select>
            </div>
            {isLoading && (
                <div className="flex items-center gap-2 text-gray-500">
                    <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-400"></span>
                    Loading logs...
                </div>
            )}
            {isError && (
                <div className="text-red-600 mb-4">
                    {error?.message || "Failed to load activity logs."}
                </div>
            )}
            {!isLoading && !isError && (
                <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
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
                                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap">
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
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map(
                                    (log: LogsWithUserName, idx: number) => (
                                        <tr
                                            key={idx}
                                            className="border-b last:border-b-0 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-3 py-2">
                                                {log.username}
                                            </td>
                                            <td className="px-3 py-2">
                                                {log.action}
                                            </td>
                                            <td className="px-3 py-2">
                                                {log.entityType}
                                            </td>
                                            <td className="px-3 py-2">
                                                {log.entityId}
                                            </td>
                                            <td className="px-3 py-2">
                                                {log.details ? (
                                                    log.details
                                                ) : (
                                                    <span className="text-gray-400 italic">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-gray-400">
                                                {log.timestamp.toLocaleString()}
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-center text-gray-500 py-8"
                                    >
                                        No activity logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Logs;
