import { FiUser, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "../../types";

interface Props {
    open: boolean;
    isEdit: boolean;
    form: Partial<User>;
    setForm: (form: any) => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isPending: boolean;
    isError: boolean;
}

const UserFormDialog = ({
    open,
    isEdit,
    form,
    setForm,
    onClose,
    onSubmit,
    isPending,
    isError,
}: Props) => {
    if (!open) return null;

    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const type = e.target.type;
        const checked = (e.target as HTMLInputElement).checked;
        setForm((prev: any) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <AnimatePresence>
            <motion.form
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                onSubmit={onSubmit}
            >
                <motion.div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                    <motion.button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        onClick={onClose}
                        type="button"
                        aria-label="Close"
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiX size={22} />
                    </motion.button>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        {isEdit ? (
                            <FiEdit2 className="text-blue-500" />
                        ) : (
                            <FiUser className="text-blue-500" />
                        )}
                        {isEdit ? "Edit User" : "Add User"}
                    </h2>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            name="fullName"
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={form.fullName}
                            onChange={handleFormChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            className="border rounded px-3 py-2 w-full"
                            value={form.email}
                            onChange={handleFormChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">
                            {isEdit
                                ? "Password (leave blank to keep current)"
                                : "Password"}
                        </label>
                        <input
                            name="password"
                            type="password"
                            className="border rounded px-3 py-2 w-full"
                            value={form.password}
                            onChange={handleFormChange}
                            required={!isEdit}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            className="border rounded px-3 py-2 w-full"
                            value={form.role}
                            onChange={handleFormChange}
                            required
                        >
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                    </div>
                    <div className="mb-3 flex items-center gap-2">
                        <input
                            name="banned"
                            type="checkbox"
                            checked={form.banned}
                            onChange={handleFormChange}
                            id={isEdit ? "banned-edit" : "banned"}
                        />
                        <label
                            htmlFor={isEdit ? "banned-edit" : "banned"}
                            className="text-gray-700"
                        >
                            Banned
                        </label>
                    </div>
                    <motion.button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center"
                        disabled={isPending}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiSave /> {isPending ? "Saving..." : "Save"}
                    </motion.button>
                    {isError && (
                        <div className="text-red-500 mt-2 text-sm">
                            Failed to {isEdit ? "update" : "add"} user.
                        </div>
                    )}
                </motion.div>
            </motion.form>
        </AnimatePresence>
    );
};

export default UserFormDialog;
