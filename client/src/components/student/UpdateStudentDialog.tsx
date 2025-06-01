import React, { useMemo, useState } from "react";
import type { Student } from "../../types/index";
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiX,
    FiSave,
} from "react-icons/fi";

interface UpdateStudentDialogProps {
    open: boolean;
    form: Omit<Student, "createdAt" | "createdBy"> | null;
    isPending: boolean;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    initialData?: Omit<Student, "createdAt" | "createdBy">;
}

const UpdateStudentDialog: React.FC<UpdateStudentDialogProps> = ({
    open,
    form,
    isPending,
    onClose,
    onChange,
    onSubmit,
    initialData,
}) => {
    const [showNoChangeMsg, setShowNoChangeMsg] = useState(false);

    // Compare form and initialData to check if any field has changed
    const isChanged = useMemo(() => {
        if (!form || !initialData) return false;
        return (
            form.id !== initialData.id ||
            form.fullName !== initialData.fullName ||
            form.email !== initialData.email ||
            form.phone !== initialData.phone ||
            form.address !== initialData.address ||
            form.dateOfBirth !== initialData.dateOfBirth
        );
    }, [form, initialData]);

    if (!open || !form) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isChanged) {
            setShowNoChangeMsg(true);
            return;
        }
        setShowNoChangeMsg(false);
        onSubmit(e);
    };

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
                    <FiUser className="text-blue-500" /> Update Profile
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FiUser /> Student ID
                        </label>
                        <input
                            type="text"
                            name="id"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={form.id}
                            onChange={onChange}
                            disabled
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FiUser /> Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={form.fullName}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FiMail /> Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={form.email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FiPhone /> Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={form.phone}
                            onChange={onChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FiMapPin /> Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={form.address}
                            onChange={onChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FiCalendar /> Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={
                                new Date(form.dateOfBirth)
                                    .toISOString()
                                    .split("T")[0]
                            }
                            onChange={onChange}
                        />
                    </div>
                    {showNoChangeMsg && (
                        <div className="mb-4 text-red-500 text-sm">
                            Please change at least one field before saving.
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2 flex items-center gap-2"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            <FiX /> Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                            disabled={isPending || !isChanged}
                        >
                            <FiSave />
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateStudentDialog;
