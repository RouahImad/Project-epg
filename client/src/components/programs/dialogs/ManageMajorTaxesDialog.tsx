import React, { useState } from "react";
import { FiDollarSign, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import type { Major } from "../../../types";
import {
    useTaxes,
    useAddTaxToMajor,
    useRemoveTaxFromMajor,
    useMajorTaxes,
} from "../../../hooks/api";
import { formatMoney } from "../../../utils/helpers";

export interface ManageMajorTaxesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    major: Major | null;
}

const ManageMajorTaxesDialog: React.FC<ManageMajorTaxesDialogProps> = ({
    isOpen,
    onClose,
    major,
}) => {
    const [selectedTaxId, setSelectedTaxId] = useState<string>("");

    // Use the custom hooks instead of direct useQuery/useMutation
    const { data: allTaxes, isLoading: loadingTaxes } = useTaxes();

    const {
        data: majorTaxes,
        isLoading: loadingMajorTaxes,
        refetch: refetchMajorTaxes,
    } = useMajorTaxes(major?.id || 0);

    // Use custom hooks for mutations
    const addTaxMutation = useAddTaxToMajor();
    const removeTaxMutation = useRemoveTaxFromMajor();

    // Filter out taxes that are already assigned to the major
    const availableTaxes =
        allTaxes?.filter(
            (tax) => !majorTaxes?.some((majorTax) => majorTax.id === tax.id)
        ) || [];

    const handleAddTax = () => {
        if (!major || !selectedTaxId) return;

        addTaxMutation.mutate(
            { majorId: major.id, taxId: parseInt(selectedTaxId) },
            {
                onSuccess: () => {
                    refetchMajorTaxes();
                    setSelectedTaxId("");
                },
            }
        );
    };

    const handleRemoveTax = (taxId: number) => {
        if (!major) return;

        removeTaxMutation.mutate(
            { majorId: major.id, taxId },
            {
                onSuccess: () => {
                    refetchMajorTaxes();
                },
            }
        );
    };

    if (!isOpen || !major) return null;

    const isLoading = loadingTaxes || loadingMajorTaxes;

    // Calculate total tax amount
    const totalTaxAmount = (majorTaxes || []).reduce(
        (sum, tax) =>
            sum +
            (typeof tax.amount === "number"
                ? tax.amount
                : parseFloat(tax.amount)),
        0
    );

    // Calculate total cost safely
    const majorPrice =
        typeof major.price === "number" ? major.price : parseFloat(major.price);
    const totalCost = majorPrice + totalTaxAmount;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <FiDollarSign className="text-green-500" />
                        Manage Taxes for {major.name}
                    </h3>
                    <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                        type="button"
                        aria-label="Close"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Price summary */}
                <div className="mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <p className="text-sm text-blue-800">
                            Major Price:{" "}
                            <span className="font-bold">
                                {formatMoney(majorPrice)}
                            </span>
                        </p>
                        <p className="text-sm text-blue-800">
                            Tax Amount:{" "}
                            <span className="font-bold">
                                {formatMoney(totalTaxAmount)}
                            </span>
                        </p>
                        <p className="text-sm text-blue-800 font-bold mt-2">
                            Total Cost: {formatMoney(totalCost)}
                        </p>
                    </div>

                    {/* Tax selection */}
                    <div className="flex items-end gap-2 mb-4">
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Add Tax
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={selectedTaxId}
                                onChange={(e) =>
                                    setSelectedTaxId(e.target.value)
                                }
                                disabled={
                                    isLoading || availableTaxes.length === 0
                                }
                            >
                                <option value="">Select a tax</option>
                                {availableTaxes.map((tax) => (
                                    <option key={tax.id} value={tax.id}>
                                        {tax.name} ({formatMoney(tax.amount)} )
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md flex items-center"
                            onClick={handleAddTax}
                            disabled={
                                !selectedTaxId || addTaxMutation.isPending
                            }
                        >
                            <FiPlus />
                        </button>
                    </div>
                </div>

                {/* Applied taxes list */}
                <div>
                    <h4 className="font-medium mb-2">Applied Taxes</h4>
                    {isLoading ? (
                        <p className="text-gray-500">Loading taxes...</p>
                    ) : majorTaxes && majorTaxes.length > 0 ? (
                        <ul className="space-y-2">
                            {majorTaxes.map((tax) => (
                                <li
                                    key={tax.id}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                                >
                                    <div>
                                        <span className="font-medium">
                                            {tax.name}
                                        </span>
                                        <p className="text-sm text-gray-600">
                                            {formatMoney(
                                                typeof tax.amount === "number"
                                                    ? tax.amount
                                                    : parseFloat(tax.amount)
                                            )}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveTax(tax.id)}
                                        disabled={removeTaxMutation.isPending}
                                        aria-label={`Remove ${tax.name}`}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">
                            No taxes applied to this major.
                        </p>
                    )}
                </div>

                {/* Close button */}
                <div className="mt-6">
                    <button
                        type="button"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={onClose}
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageMajorTaxesDialog;
