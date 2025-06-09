import React from "react";
import { FiDollarSign, FiX, FiSave } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Tax } from "../../../types";

interface EditTaxDialogProps {
    showEditTax: boolean;
    setShowEditTax: (show: boolean) => void;
    taxForm: {
        name: string;
        amount: string | number;
        description: string;
    };
    handleTaxFormChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    updateTax: UseMutationResult<any, Error, any, unknown>;
    editTax: Tax | null;
    onSuccess?: () => void;
}

const EditTaxDialog: React.FC<EditTaxDialogProps> = ({
    showEditTax,
    setShowEditTax,
    taxForm,
    handleTaxFormChange,
    updateTax,
    editTax,
    onSuccess,
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTax) return;

        if (
            taxForm.name === editTax.name &&
            taxForm.amount === String(editTax.amount) &&
            taxForm.description === editTax.description
        ) {
            setShowEditTax(false);
            return;
        }

        updateTax.mutate(
            {
                name: taxForm.name,
                amount: parseFloat(taxForm.amount as string),
                description: taxForm.description,
            },
            {
                onSuccess: () => {
                    setShowEditTax(false);
                    if (onSuccess) onSuccess();
                },
            }
        );
    };

    return (
        <AnimatePresence>
            {showEditTax && editTax && (
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
                                <FiDollarSign className="text-green-500" /> Edit
                                Tax
                            </h3>
                            <motion.button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => setShowEditTax(false)}
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
                                        value={taxForm.description}
                                        onChange={handleTaxFormChange}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <motion.button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    onClick={() => setShowEditTax(false)}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                                    disabled={updateTax.isPending}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiSave />
                                    {updateTax.isPending
                                        ? "Saving..."
                                        : "Save Changes"}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditTaxDialog;
