import React, { useState } from "react";
import { FiDollarSign, FiSearch } from "react-icons/fi";
import type { PaymentWithTaxes } from "../../types";
import { formatDate, formatMoney } from "../../utils/helpers";

interface StudentPaymentsProps {
    isLoading: boolean;
    payments: PaymentWithTaxes[];
}

const StudentPayments: React.FC<StudentPaymentsProps> = ({
    isLoading,
    payments,
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPayments = payments.filter(
        (payment) =>
            payment.majorName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            payment.handledByUserName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiDollarSign className="text-green-500" />
                Payments History
            </h2>

            {!isLoading && payments && payments.length > 0 && (
                <div className="mb-4 relative">
                    <div className="flex items-center border rounded overflow-hidden">
                        <div className="pl-3 text-gray-400">
                            <FiSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Search payments by major or handler..."
                            className="w-full p-2 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {isLoading ? (
                <p>Loading payments...</p>
            ) : payments && payments.length > 0 ? (
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                            Major
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                            Amount Paid
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                            Remaining Balance
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                            Handled By
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                            Paid At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPayments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap truncate">
                                                {payment.majorName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatMoney(
                                                    payment.amountPaid
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatMoney(
                                                    payment.remainingAmount || 0
                                                )}
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
                <p className="text-gray-500">No payments recorded yet</p>
            )}
        </div>
    );
};

export default StudentPayments;
