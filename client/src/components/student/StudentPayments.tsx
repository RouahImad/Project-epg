import React, { useState } from "react";
import { FiDollarSign, FiSearch, FiEdit2, FiPrinter } from "react-icons/fi";
import { motion } from "framer-motion";
import type { PaymentDetails } from "../../types";
import { formatDate, formatMoney } from "../../utils/helpers";
import { useUpdatePayment } from "../../hooks/api/";
import EditPaymentDialog from "./dialogs/EditPaymentDialog";
import ReceiptPrintDialog from "../common/ReceiptPrintDialog";

interface StudentPaymentsProps {
    isLoading: boolean;
    payments: PaymentDetails[];
}

const StudentPayments: React.FC<StudentPaymentsProps> = ({
    isLoading,
    payments,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [editPayment, setEditPayment] = useState<PaymentDetails | null>(null);
    const [editForm, setEditForm] = useState<{
        amountPaid: number;
        remainingAmount: number;
    }>({
        amountPaid: 0,
        remainingAmount: 0,
    });
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<{
        payment: PaymentDetails;
        taxes: any[];
    } | null>(null);

    const updatePayment = useUpdatePayment();

    const filteredPayments = payments.filter(
        (payment) =>
            payment.majorName
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            payment.handledByUserName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const openEditDialog = (payment: PaymentDetails) => {
        setEditPayment(payment);
        setEditForm({
            amountPaid: payment.amountPaid,
            remainingAmount: payment.remainingAmount || 0,
        });
    };

    const closeEditDialog = () => {
        setEditPayment(null);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: name === "amountPaid" ? Number(value || 0) : value,
        }));
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editPayment) return;
        updatePayment.mutate(
            {
                id: editPayment.id,
                amountPaid: editForm.amountPaid,
            },
            {
                onSuccess: () => {
                    closeEditDialog();
                },
            }
        );
    };

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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                            Actions
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
                                            <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                                <motion.button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit Payment"
                                                    type="button"
                                                    onClick={() =>
                                                        openEditDialog(payment)
                                                    }
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiEdit2 />
                                                </motion.button>
                                                <motion.button
                                                    className="text-green-600 hover:text-green-800"
                                                    title="Print Receipt"
                                                    type="button"
                                                    onClick={() => {
                                                        setReceiptData({
                                                            payment,
                                                            taxes: [],
                                                        });
                                                        setShowReceipt(true);
                                                    }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiPrinter />
                                                </motion.button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {/* Edit Payment Dialog */}
                    {editPayment && (
                        <EditPaymentDialog
                            editForm={editForm}
                            handleEditChange={handleEditChange}
                            handleEditSubmit={handleEditSubmit}
                            closeEditDialog={closeEditDialog}
                            updatePayment={updatePayment}
                        />
                    )}
                    {/* Receipt Print Dialog */}
                    {showReceipt && receiptData && (
                        <ReceiptPrintDialog
                            open={showReceipt}
                            onClose={() => setShowReceipt(false)}
                            studentId={receiptData.payment.studentId}
                            studentName={receiptData.payment.studentName}
                            major={{
                                name: receiptData.payment.majorName,
                                price:
                                    Number(
                                        receiptData.payment.amountPaid || 0
                                    ) +
                                    Number(
                                        receiptData.payment.remainingAmount || 0
                                    ),
                            }}
                            paidAmount={receiptData.payment.amountPaid}
                            taxes={receiptData.payment.taxes || []}
                        />
                    )}
                </>
            ) : (
                <p className="text-gray-500">No payments recorded yet</p>
            )}
        </div>
    );
};

export default StudentPayments;
