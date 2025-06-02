import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../services/api";
import { useNavigate } from "react-router";
import { FiArrowLeft, FiDollarSign, FiSearch } from "react-icons/fi";
import { formatDate } from "../utils/helpers";

const Payments = () => {
    const { user, userRole } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const paymentsQuery = useQuery({
        queryKey: ["allPayments", userRole, user?.id],
        queryFn: async () => {
            if (!user) return [];
            if (userRole === "super_admin") {
                return paymentsApi.getPayments();
            } else {
                return paymentsApi.getPaymentsByUser(user.id);
            }
        },
        enabled: !!user,
    });

    // Filter payments based on search term
    const filteredPayments = paymentsQuery.data
        ? paymentsQuery.data.filter(
              (payment) =>
                  payment.majorName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  payment.handledByUserName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  payment.studentId.toString().includes(searchTerm) ||
                  payment.id.toString().includes(searchTerm)
          )
        : [];

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center mb-6">
                <button
                    className="mr-3 text-gray-500 hover:text-blue-600"
                    onClick={() => navigate(-1)}
                    aria-label="Back"
                >
                    <FiArrowLeft size={22} />
                </button>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FiDollarSign className="text-green-500" />
                    Payments
                </h2>
            </div>

            {!paymentsQuery.isLoading &&
                paymentsQuery.data &&
                paymentsQuery.data.length > 0 && (
                    <div className="mb-4 relative">
                        <div className="flex items-center border rounded overflow-hidden max-w-md">
                            <div className="pl-3 text-gray-400">
                                <FiSearch />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by ID, student, major or handler..."
                                className="w-full p-2 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                )}

            {paymentsQuery.isLoading ? (
                <p>Loading payments...</p>
            ) : paymentsQuery.data && paymentsQuery.data.length > 0 ? (
                <>
                    {filteredPayments.length === 0 ? (
                        <p className="text-gray-500">
                            No payments found matching your search
                        </p>
                    ) : (
                        <div className="overflow-x-auto shadow rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                            Payment ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                                            Student ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                                            Major
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                                            Amount Paid
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[13%]">
                                            Remaining
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                                            Handled By
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                                            Paid At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPayments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment.studentId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap truncate">
                                                {payment.majorName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment.amountPaid}DH
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment.remainingAmount}DH
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap truncate">
                                                {payment.handledByUserName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatDate(payment.paidAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500">No payments found</p>
            )}
        </div>
    );
};

export default Payments;
