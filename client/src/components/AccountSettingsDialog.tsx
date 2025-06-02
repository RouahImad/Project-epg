import React, { useState, useMemo } from "react";
import { FiX, FiUser, FiLock } from "react-icons/fi";
import { authApi } from "../services/api";
import type { User } from "../types/";

interface Props {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

const AccountSettingsDialog: React.FC<Props> = ({ open, onClose, user }) => {
    const [form, setForm] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        password: "",
    });
    const [isPending, setIsPending] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    React.useEffect(() => {
        if (user) {
            setForm({
                fullName: user.fullName || "",
                email: user.email || "",
                password: "",
            });
        }
    }, [user, open]);

    const isChanged = useMemo(() => {
        return (
            (form.fullName && form.fullName !== user?.fullName) ||
            (form.email && form.email !== user?.email) ||
            form.password.length > 0
        );
    }, [form, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrorMsg("");
        setSuccessMsg("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isChanged) {
            setErrorMsg("Please change at least one field before saving.");
            return;
        }
        setIsPending(true);
        setErrorMsg("");
        setSuccessMsg("");
        try {
            await authApi.updateProfile({
                fullName: form.fullName,
                email: form.email,
                ...(form.password ? { password: form.password } : {}),
            });
            setSuccessMsg("Account updated successfully.");
            setForm((prev) => ({ ...prev, password: "" }));
        } catch (err: any) {
            setErrorMsg(
                err?.response?.data?.message ||
                    "Failed to update account. Please try again."
            );
        } finally {
            setIsPending(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                    aria-label="Close"
                    type="button"
                >
                    <FiX size={22} />
                </button>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FiUser className="text-blue-500" />
                    Account Settings
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-1">
                            <FiLock className="text-gray-400" />
                            New Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                    {errorMsg && (
                        <div className="mb-4 text-red-500 text-sm">
                            {errorMsg}
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-4 text-green-600 text-sm">
                            {successMsg}
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            disabled={isPending || !isChanged}
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountSettingsDialog;
