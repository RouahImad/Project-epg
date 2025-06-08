import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
} from "recharts";
import React from "react";
import type {
    AdminDashboardData,
    SuperDashboardData,
} from "../../types/api.types";

interface Props {
    role: "admin" | "super_admin";
    data: AdminDashboardData | SuperDashboardData;
}

const DashboardCharts: React.FC<Props> = ({ role, data }) => {
    if (role === "super_admin") {
        const superData = data as SuperDashboardData;
        const incomeData = [...superData.charts.incomeOverTime].sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
        );
        const programData = superData.charts.paymentsByProgram;
        const studentsData = [...superData.charts.studentsOverTime].sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
        );

        const hasIncomeData =
            Array.isArray(incomeData) && incomeData.length > 1;
        const hasProgramData =
            Array.isArray(programData) && programData.length > 0;
        const hasStudentsData =
            Array.isArray(studentsData) && studentsData.length > 0;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
                <div className="bg-white rounded-xl shadow p-6 h-fit">
                    <h3 className="font-semibold mb-4">Income Over Time</h3>
                    {hasIncomeData ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={incomeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-gray-400 text-center py-12 text-pretty">
                            Not enough data to display chart.
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="font-semibold mb-4">Students Over Time</h3>
                    {hasStudentsData ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={studentsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#ffc658"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-gray-400 text-center py-12 text-pretty">
                            No student registration data available.
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-xl shadow p-6 md:col-span-2 xl:col-span-1">
                    <h3 className="font-semibold mb-4">Payments by Major</h3>
                    {hasProgramData ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={programData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="program"
                                    tickFormatter={(name: string) => {
                                        const maxLength = Math.max(
                                            10,
                                            24 / programData.length
                                        );
                                        return name.length > maxLength
                                            ? name.slice(0, maxLength - 2) + "…"
                                            : name;
                                    }}
                                    interval={0}
                                />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number) =>
                                        value.toLocaleString()
                                    }
                                    labelFormatter={(label: string) => label}
                                />
                                <Bar dataKey="total" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-gray-400 text-center py-12 text-pretty">
                            No program payment data available.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // admin
    const adminData = data as AdminDashboardData;
    const paymentsByMonthArr = Object.entries(adminData.charts.paymentsByMonth)
        .map(([month, amount]) => ({ month, amount }))
        .sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
        );
    const outstandingByMonthArr = Object.entries(
        adminData.charts.outstandingByMonth
    )
        .map(([month, amount]) => ({ month, amount }))
        .sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
        );
    const studentsByMonthArr = Object.entries(adminData.charts.studentsByMonth)
        .map(([month, count]) => ({ month, count }))
        .sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
        );

    const hasPayments = paymentsByMonthArr.length > 1;
    const hasOutstanding = outstandingByMonthArr.length > 0;
    const hasStudents = studentsByMonthArr.length > 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Payments by Month</h3>
                {hasPayments ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={paymentsByMonthArr}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#8884d8"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-gray-400 text-center py-12 text-pretty">
                        Not enough payment data.
                    </div>
                )}
            </div>
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Students by Month</h3>
                {hasStudents ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={studentsByMonthArr}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#ffc658"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-gray-400 text-center py-12 text-pretty">
                        No student data.
                    </div>
                )}
            </div>
            <div className="bg-white rounded-xl shadow p-6 md:col-span-2 xl:col-span-1">
                <h3 className="font-semibold mb-4">Outstanding by Month</h3>
                {hasOutstanding ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={outstandingByMonthArr}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-gray-400 text-center py-12 text-pretty">
                        No outstanding data.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCharts;
