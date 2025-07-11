import React from "react";
import { FiAlertTriangle, FiX, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import type { UseMutationResult } from "@tanstack/react-query";

interface DeleteTaxDialogProps {
    deleteTaxId: number | null;
    setDeleteTaxId: (id: number | null) => void;
    deleteTax: UseMutationResult<any, Error, number, unknown>;
    onSuccess?: () => void;
}

const DeleteTaxDialog: React.FC<DeleteTaxDialogProps> = ({
    deleteTaxId,
    setDeleteTaxId,
    deleteTax,
    onSuccess,
}) => {
    const handleDelete = () => {
        if (deleteTaxId === null) return;

        deleteTax.mutate(deleteTaxId, {
            onSuccess: () => {
                setDeleteTaxId(null);
                if (onSuccess) onSuccess();
            },
        });
    };

    if (deleteTaxId === null) return null;

    return (
        <AnimatePresence>
            {deleteTaxId !== null && (
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
                            <h3 className="text-xl font-bold flex items-center gap-2 text-red-600">
                                <FiAlertTriangle /> Delete Tax
                            </h3>
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => setDeleteTaxId(null)}
                                type="button"
                                aria-label="Close"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="py-4">
                            <p className="text-gray-700">
                                Are you sure you want to delete this tax? This
                                action cannot be undone.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <motion.button
                                type="button"
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                onClick={() => setDeleteTaxId(null)}
                                whileTap={{ scale: 0.9 }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                type="button"
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center gap-2"
                                onClick={handleDelete}
                                disabled={deleteTax.isPending}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiTrash2 />
                                {deleteTax.isPending
                                    ? "Deleting..."
                                    : "Delete Tax"}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeleteTaxDialog;
