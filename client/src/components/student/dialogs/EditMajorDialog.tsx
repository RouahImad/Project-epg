import React, { useState } from "react";
import type { StudentMajor, StudentMajorDetails } from "../../../types";
import { FiEdit2, FiX, FiSave } from "react-icons/fi";

interface EditMajorDialogProps {
    open: boolean;
    major: StudentMajorDetails;
    isPending: boolean;
    onClose: () => void;
    onSubmit: (
        data: Omit<StudentMajor, "studentId" | "majorId" | "enrolledBy">
    ) => void;
}

const EditMajorDialog: React.FC<EditMajorDialogProps> = ({
    open,
    major,
    isPending,
    onClose,
    onSubmit,
}) => {
    const formatDateForInput = (date: Date | string): string => {
        const d = new Date(date);
        return d.toISOString().split("T")[0]; // Returns YYYY-MM-DD
    };

    const [form, setForm] = useState(formatDateForInput(major.enrollmentDate));
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setForm(value);
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (form === formatDateForInput(major.enrollmentDate)) {
            setError("Please change the enrollment date before saving");
            return;
        }

        onSubmit({
            enrollmentDate: new Date(form),
        });
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
                    <FiEdit2 className="text-blue-500" /> Edit Major Enrollment
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            Enrollment Date
                        </label>
                        <input
                            type="date"
                            name="enrollmentDate"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            value={form}
                            onChange={handleChange}
                            required
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-1">{error}</p>
                        )}
                    </div>
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
                            disabled={isPending}
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

export default EditMajorDialog;
