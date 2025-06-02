import { useEffect, useState } from "react";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
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
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={closeEditDialog}
                    type="button"
                    aria-label="Close"
                >
                    <FiX size={22} />
                </button>
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
                    <button
                        type="button"
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 flex items-center gap-2"
                        onClick={closeEditDialog}
                        disabled={updatePayment.isPending}
                    >
                        <FiX /> Cancel
                    </button>
                    <button
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
                    >
                        <FiSave />
                        {updatePayment.isPending ? "Saving..." : "Save Changes"}
                    </button>
                </div>
                {updatePayment.isError && (
                    <div className="text-red-500 mt-2 text-sm">
                        Failed to update payment.
                    </div>
                )}
            </form>
        </div>
    );
};

export default EditPaymentDialog;
