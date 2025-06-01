import { FiTrash2 } from "react-icons/fi";

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
                <h2 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
                    <FiTrash2 /> Delete User
                </h2>
                <p className="mb-4">
                    Are you sure you want to delete this user?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        onClick={onDelete}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
                {isError && (
                    <div className="text-red-500 mt-2 text-sm">
                        Failed to delete user.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeleteUserDialog;
