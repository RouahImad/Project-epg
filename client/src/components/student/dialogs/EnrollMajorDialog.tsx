import React, { useState, useMemo } from "react";
import { FiBookOpen, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { formatMoney } from "../../../utils/helpers";
import type { Major } from "../../../types";
import { useMajorTaxes } from "../../../hooks/api/";

interface EnrollMajorDialogProps {
    open: boolean;
    isLoading: boolean;
    majors: Major[] | [];
    selectedMajorId: number | null;
    onSelectMajor: (id: number) => void;
    onClose: () => void;
    onSubmit: (data: { majorId: number; paidAmount: number }) => void;
}

const EnrollMajorDialog: React.FC<EnrollMajorDialogProps> = ({
    open,
    isLoading,
    majors,
    selectedMajorId,
    onSelectMajor,
    onClose,
    onSubmit,
}) => {
    const { data: taxes = [], isLoading: taxesLoading } = useMajorTaxes(
        selectedMajorId ?? 0
    );

    const [step, setStep] = useState(1);
    const [paidAmount, setPaidAmount] = useState<number>(0);
    const [majorSearch, setMajorSearch] = useState("");
    React.useEffect(() => {
        if (!open) {
            setStep(1);
            setPaidAmount(0);
        }
    }, [open]);

    const selectedMajor = useMemo(
        () =>
            selectedMajorId != null
                ? majors.find((m) => m.id === selectedMajorId)
                : null,
        [selectedMajorId, majors]
    );

    const price = useMemo(
        () => Number(selectedMajor?.price || 0),
        [selectedMajor]
    );

    const taxesTotal = useMemo(
        () =>
            taxes.reduce(
                (sum: number, tax) => sum + Number(tax.amount || 0),
                0
            ),
        [taxes]
    );

    const total = useMemo(() => price + taxesTotal, [price, taxesTotal]);

    const outstanding = useMemo(() => total - paidAmount, [total, paidAmount]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (step === 1) {
            if (selectedMajorId) setStep(2);
        } else if (step === 2) {
            if (selectedMajorId && paidAmount >= 0) {
                onSubmit({
                    majorId: selectedMajorId,
                    paidAmount: paidAmount,
                });
                onClose();
            }
        }
    };

    // Filter majors for the input+select
    const filteredMajors = useMemo(
        () =>
            majors.filter((m) =>
                m.name.toLowerCase().includes(majorSearch.toLowerCase())
            ),
        [majors, majorSearch]
    );

    if (!open) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-8 w-full max-w-lg relative shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
                    <p className="text-gray-500">Loading majors...</p>
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white rounded-xl p-8 w-full max-w-lg relative shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
                    style={{
                        border: "1px solid #e5e7eb",
                    }}
                >
                    {/* Close button */}
                    <motion.button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                        onClick={onClose}
                        aria-label="Close"
                        type="button"
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiX size={24} />
                    </motion.button>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-700">
                        <FiBookOpen className="text-blue-500" />
                        Enroll in Major
                    </h2>
                    {majors && majors.length > 0 ? (
                        <form onSubmit={handleSubmit}>
                            {step === 1 && (
                                <>
                                    {/* Input + select for major */}
                                    {/* Input for major with datalist */}
                                    <div className="mb-4">
                                        <input
                                            list="majors-list"
                                            type="text"
                                            placeholder="Type or select a major..."
                                            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                            value={
                                                selectedMajor
                                                    ? selectedMajor.name
                                                    : majorSearch
                                            }
                                            onChange={(e) => {
                                                setMajorSearch(e.target.value);
                                                const found = majors.find(
                                                    (m) =>
                                                        m.name.toLowerCase() ===
                                                        e.target.value.toLowerCase()
                                                );
                                                if (found) {
                                                    onSelectMajor(found.id);
                                                } else {
                                                    onSelectMajor(null as any);
                                                }
                                            }}
                                            required
                                        />
                                        <datalist id="majors-list">
                                            {filteredMajors.map(
                                                (major: any) => (
                                                    <option
                                                        key={major.id}
                                                        value={major.name}
                                                    />
                                                )
                                            )}
                                        </datalist>
                                        {majorSearch &&
                                            !filteredMajors.some(
                                                (m) =>
                                                    m.name.toLowerCase() ===
                                                    majorSearch.toLowerCase()
                                            ) && (
                                                <div className="text-red-500 text-sm mt-1">
                                                    Major not found. Please
                                                    select from the list.
                                                </div>
                                            )}
                                    </div>
                                    {selectedMajor && (
                                        <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm">
                                            <div className="mb-1">
                                                <span className="font-semibold text-blue-700">
                                                    Name:
                                                </span>{" "}
                                                {selectedMajor.name}
                                            </div>
                                            <div className="mb-1">
                                                <span className="font-semibold text-blue-700">
                                                    Price:
                                                </span>{" "}
                                                {formatMoney(
                                                    selectedMajor.price
                                                )}
                                            </div>
                                            <div className="mb-1">
                                                <span className="font-semibold text-blue-700">
                                                    Duration:
                                                </span>{" "}
                                                {selectedMajor.duration}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-blue-700">
                                                    Description:
                                                </span>{" "}
                                                {selectedMajor.description &&
                                                selectedMajor.description
                                                    .length > 200 ? (
                                                    <span
                                                        title={
                                                            selectedMajor.description
                                                        }
                                                    >
                                                        {selectedMajor.description.slice(
                                                            0,
                                                            200
                                                        )}
                                                        ...
                                                    </span>
                                                ) : selectedMajor.description ? (
                                                    selectedMajor.description
                                                ) : (
                                                    <span className="italic text-gray-400">
                                                        No description
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-end mt-4">
                                        <motion.button
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                                            type="submit"
                                            disabled={!selectedMajorId}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            Next
                                        </motion.button>
                                    </div>
                                </>
                            )}
                            {step === 2 && selectedMajor && (
                                <>
                                    <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm">
                                        <div className="mb-2">
                                            <span className="font-semibold text-blue-700">
                                                Major:
                                            </span>{" "}
                                            {selectedMajor.name}
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold text-blue-700">
                                                Price:
                                            </span>{" "}
                                            {formatMoney(selectedMajor.price)}
                                        </div>
                                        <div className="mb-2">
                                            <span className="font-semibold text-blue-700">
                                                Taxes:
                                            </span>{" "}
                                            {taxesLoading ? (
                                                <span className="italic text-gray-400">
                                                    Loading taxes...
                                                </span>
                                            ) : taxes.length === 0 ? (
                                                <span className="italic text-gray-400">
                                                    No taxes
                                                </span>
                                            ) : (
                                                <ul className="list-disc ml-6">
                                                    {taxes.map((tax: any) => (
                                                        <li key={tax.id}>
                                                            <span className="font-medium">
                                                                {tax.name}:
                                                            </span>{" "}
                                                            {formatMoney(
                                                                tax.amount
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        {taxes.length > 0 && (
                                            <div className="mb-2">
                                                <span className="font-semibold text-blue-700">
                                                    Total Taxes:
                                                </span>{" "}
                                                {formatMoney(taxesTotal)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 mb-2 font-medium">
                                            Amount Paid
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            max={total}
                                            step="any"
                                            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                            value={paidAmount}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setPaidAmount(
                                                    Math.max(
                                                        0,
                                                        Number(val || 0)
                                                    )
                                                );
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <span className="font-semibold text-blue-700">
                                            Outstanding Balance:
                                        </span>{" "}
                                        <span
                                            className={
                                                outstanding > 0
                                                    ? "text-red-600"
                                                    : outstanding < 0
                                                    ? "text-green-600"
                                                    : "text-gray-700"
                                            }
                                        >
                                            {formatMoney(outstanding)}
                                            {outstanding < 0 && (
                                                <span className="ml-2 text-xs text-green-700">
                                                    (Overpaid)
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <motion.button
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                                            type="button"
                                            onClick={() => setStep(1)}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            Back
                                        </motion.button>
                                        <motion.button
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                                            type="submit"
                                            disabled={
                                                isNaN(paidAmount) ||
                                                paidAmount === 0 ||
                                                paidAmount < 0 ||
                                                paidAmount > total ||
                                                !selectedMajorId
                                            }
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            Confirm Payment
                                        </motion.button>
                                    </div>
                                </>
                            )}
                        </form>
                    ) : (
                        <p className="text-gray-500">No majors available</p>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EnrollMajorDialog;
