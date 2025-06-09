import { useEffect, useState } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface EditPaymentDialogProps {
    editForm: { amountPaid: number; remainingAmount: number };
    handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEditSubmit: (e: React.FormEvent) => void;
    closeEditDialog: () => void;
    updatePayment: {
        isPending: boolean;
        isError: boolean;
    };
}

const EditPaymentDialog = ({
    editForm,
    handleEditChange,
    handleEditSubmit,
    closeEditDialog,
    updatePayment,
}: EditPaymentDialogProps) => {
    const [oldAmount, setOldAmount] = useState(0);

    useEffect(() => {
        setOldAmount(editForm.amountPaid);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            >
                <motion.form
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
                    onSubmit={(e) => {
                        if (
                            oldAmount === editForm.amountPaid ||
                            editForm.amountPaid <= oldAmount ||
                            editForm.amountPaid < 0 ||
                            editForm.amountPaid >
                                Number(editForm.remainingAmount || 0) +
                                    Number(oldAmount || 0)
                        )
                            return;

                        handleEditSubmit(e);
                    }}
                >
                    <motion.button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        onClick={closeEditDialog}
                        type="button"
                        aria-label="Close"
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiX size={22} />
                    </motion.button>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FiEdit2 className="text-blue-500" /> Edit Payment
                    </h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Amount Paid
                        </label>
                        <input
                            type="number"
                            name="amountPaid"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={editForm.amountPaid}
                            onChange={handleEditChange}
                            min={0}
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <motion.button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 flex items-center gap-2"
                            onClick={closeEditDialog}
                            disabled={updatePayment.isPending}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiX /> Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                            disabled={
                                updatePayment.isPending ||
                                editForm.amountPaid <= oldAmount ||
                                editForm.amountPaid < 0 ||
                                editForm.amountPaid >
                                    Number(editForm.remainingAmount || 0) +
                                        Number(oldAmount || 0)
                            }
                            whileTap={{ scale: 0.9 }}
                        >
                            <FiSave />
                            {updatePayment.isPending
                                ? "Saving..."
                                : "Save Changes"}
                        </motion.button>
                    </div>
                    {updatePayment.isError && (
                        <div className="text-red-500 mt-2 text-sm">
                            Failed to update payment.
                        </div>
                    )}
                </motion.form>
            </motion.div>
        </AnimatePresence>
    );
};

export default EditPaymentDialog;
