import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../services/api";
import { useNavigate } from "react-router";
import type { Payment } from "../types";
import { FiArrowLeft, FiDollarSign } from "react-icons/fi";

const Payments = () => {
    const { user, userRole } = useAuth();
    const navigate = useNavigate();

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
            {paymentsQuery.isLoading ? (
                <p>Loading payments...</p>
            ) : paymentsQuery.data && paymentsQuery.data.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Major ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount Paid
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Paid At
                                </th>
                            </tr>
                        </thead>{" "}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paymentsQuery.data.map((payment: Payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payment.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payment.studentId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payment.majorId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payment.amountPaid}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {payment.paidAt
                                            ? new Date(
                                                  payment.paidAt
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">No payments found</p>
            )}
        </div>
    );
};

export default Payments;
