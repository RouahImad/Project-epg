import { FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    isPending: boolean;
    isError: boolean;
}

const DeleteUserDialog = ({
    open,
    onClose,
    onDelete,
    isPending,
    isError,
}: Props) => {
    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg"
                >
                    <h2 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
                        <FiTrash2 /> Delete User
                    </h2>
                    <p className="mb-4">
                        Are you sure you want to delete this user?
                    </p>
                    <div className="flex justify-end gap-2">
                        <motion.button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                            onClick={onClose}
                            disabled={isPending}
                            whileTap={{ scale: 0.9 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            onClick={onDelete}
                            disabled={isPending}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </motion.button>
                    </div>
                    {isError && (
                        <div className="text-red-500 mt-2 text-sm">
                            Failed to delete user.
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DeleteUserDialog;
