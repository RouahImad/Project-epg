import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import type { Major, Tax } from "../../types";
import ReceiptTemplate from "./ReceiptTemplate";

export interface ReceiptPrintDialogProps {
    open: boolean;
    onClose: () => void;
    studentId: string;
    studentName: string;
    major: {
        name: Major["name"];
        price: Major["price"];
    };
    paidAmount: number;
    taxes: Pick<Tax, "name" | "amount">[];
    date?: Date | string;
}

const ReceiptPrintDialog: React.FC<ReceiptPrintDialogProps> = (props) => {
    const { open, onClose, ...receiptProps } = props;
    console.log("ReceiptPrintDialog props:", receiptProps);
    const printRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Payment Receipt",
        onAfterPrint: onClose,
    });

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
                <div
                    className="receipt-container"
                    style={{
                        width: "100%",
                        overflow: "auto",
                        maxHeight: "70vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        padding: 0,
                        margin: "0 auto",
                    }}
                >
                    <div
                        ref={printRef}
                        className="w-full 
                    h-full flex justify-center items-start"
                    >
                        <ReceiptTemplate {...receiptProps} />
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2.5 py-1.5 rounded mr-2"
                        onClick={onClose}
                        type="button"
                        aria-label="Close"
                    >
                        Close
                    </button>

                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded"
                        onClick={handlePrint}
                        type="button"
                    >
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPrintDialog;
