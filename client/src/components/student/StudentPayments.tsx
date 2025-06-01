import React from "react";
import { FiDollarSign } from "react-icons/fi";
import type { Payment } from "../../types";

interface StudentPaymentsProps {
    isLoading: boolean;
    payments: Payment[];
}

const StudentPayments: React.FC<StudentPaymentsProps> = ({
    isLoading,
    payments,
}) => (
    <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiDollarSign className="text-green-500" />
            Payments History
        </h2>
        {isLoading ? (
            <p>Loading payments...</p>
        ) : payments && payments.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Major
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
                    {payments.map((payment: Payment) => (
                        <tr key={payment.id}>
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
        ) : (
            <p className="text-gray-500">No payments recorded yet</p>
        )}
    </div>
);

export default StudentPayments;
