import React from "react";
import { FiDollarSign, FiX, FiPlus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import type { UseMutationResult } from "@tanstack/react-query";

interface AddTaxDialogProps {
    showAddTax: boolean;
    setShowAddTax: (show: boolean) => void;
    taxForm: {
        name: string;
        amount: string | number;
        description: string;
    };
    handleTaxFormChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    addTax: UseMutationResult<any, Error, any, unknown>;
    onSuccess?: () => void;
}

const AddTaxDialog: React.FC<AddTaxDialogProps> = ({
    showAddTax,
    setShowAddTax,
    taxForm,
    handleTaxFormChange,
    addTax,
    onSuccess,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTax.mutate(
            {
                name: taxForm.name,
                amount: parseFloat(taxForm.amount as string),
                description: taxForm.description,
            },
            {
                onSuccess: () => {
                    setShowAddTax(false);
                    if (onSuccess) onSuccess();
                },
            }
        );
    };

    return (
        <AnimatePresence>
            {showAddTax && (
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
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}
                        className="bg-white rounded-lg p-6 w-full max-w-md"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <FiDollarSign className="text-green-500" /> Add
                                New Tax
                            </h3>
                            <motion.button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => setShowAddTax(false)}
                                type="button"
                                aria-label="Close"
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiX size={20} />
                            </motion.button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Tax Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., VAT, Income Tax"
                                        value={taxForm.name}
                                        onChange={handleTaxFormChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="amount"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Amount (DH)
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        min="0"
                                        step="0.01"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., 100"
                                        value={taxForm.amount}
                                        onChange={handleTaxFormChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Optional description"
                                        value={taxForm.description}
                                        onChange={handleTaxFormChange}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <motion.button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    onClick={() => setShowAddTax(false)}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
                                    disabled={addTax.isPending}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiPlus />
                                    {addTax.isPending ? "Adding..." : "Add Tax"}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddTaxDialog;
