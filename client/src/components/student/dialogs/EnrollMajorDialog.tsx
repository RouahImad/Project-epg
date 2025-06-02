import React, { useState } from "react";
import { FiBookOpen, FiX } from "react-icons/fi";
import type { Major } from "../../types/";

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
    const [step, setStep] = useState(1);
    const [paidAmount, setPaidAmount] = useState<number>(0);
    React.useEffect(() => {
        if (!open) {
            setStep(1);
            setPaidAmount(0);
        }
    }, [open]);

    if (!open) return null;

    const selectedMajor =
        selectedMajorId != null
            ? majors.find((m) => m.id === selectedMajorId)
            : null;

    const price = selectedMajor ? Number(selectedMajor.price) : 0;
    const outstanding = Math.max(price - paidAmount, 0);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div
                className="bg-white rounded-xl p-8 w-full max-w-lg relative shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
                style={{
                    border: "1px solid #e5e7eb",
                }}
            >
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                    onClick={onClose}
                    aria-label="Close"
                    type="button"
                >
                    <FiX size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-700">
                    <FiBookOpen className="text-blue-500" />
                    Enroll in Major
                </h2>
                {isLoading ? (
                    <p className="text-gray-500">Loading majors...</p>
                ) : majors && majors.length > 0 ? (
                    <form
                        onSubmit={(e) => {
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
                        }}
                    >
                        {step === 1 && (
                            <>
                                <select
                                    className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                    value={selectedMajorId ?? ""}
                                    onChange={(e) =>
                                        onSelectMajor(Number(e.target.value))
                                    }
                                    required
                                >
                                    <option value="" disabled>
                                        Select a major
                                    </option>
                                    {majors.map((major: any) => (
                                        <option key={major.id} value={major.id}>
                                            {major.name}
                                        </option>
                                    ))}
                                </select>
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
                                            {selectedMajor.price}DH
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
                                            selectedMajor.description.length >
                                                200 ? (
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
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                                        type="submit"
                                        disabled={!selectedMajorId}
                                    >
                                        Next
                                    </button>
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
                                        {selectedMajor.price}DH
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Amount Paid
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={price}
                                        step="any"
                                        className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                                        value={paidAmount}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setPaidAmount(
                                                Math.max(0, Number(val))
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
                                                : "text-green-600"
                                        }
                                    >
                                        {outstanding}DH
                                    </span>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                                        type="button"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                                        type="submit"
                                        disabled={
                                            isNaN(paidAmount) ||
                                            paidAmount === 0 ||
                                            paidAmount < 0 ||
                                            paidAmount > price ||
                                            !selectedMajorId
                                        }
                                    >
                                        Confirm Payment
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                ) : (
                    <p className="text-gray-500">No majors available</p>
                )}
            </div>
        </div>
    );
};

export default EnrollMajorDialog;
