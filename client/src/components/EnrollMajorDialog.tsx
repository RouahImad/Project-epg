import React from "react";
import { FiBookOpen, FiX } from "react-icons/fi";

interface EnrollMajorDialogProps {
    open: boolean;
    isLoading: boolean;
    majors: any[];
    selectedMajorId: number | null;
    onSelectMajor: (id: number) => void;
    onClose: () => void;
    onSubmit: () => void;
}

const EnrollMajorDialog: React.FC<EnrollMajorDialogProps> = ({
    open,
    isLoading,
    majors,
    selectedMajorId,
    onSelectMajor,
    onClose,
    onSubmit,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                {/* Close button */}
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                    aria-label="Close"
                    type="button"
                >
                    <FiX size={22} />
                </button>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FiBookOpen className="text-blue-500" />
                    Enroll in Major
                </h2>
                {isLoading ? (
                    <p>Loading majors...</p>
                ) : majors && majors.length > 0 ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (selectedMajorId) onSubmit();
                        }}
                    >
                        <select
                            className="w-full border rounded px-3 py-2 mb-4"
                            value={selectedMajorId ?? ""}
                            onChange={(e) =>
                                onSelectMajor(Number(e.target.value))
                            }
                            required
                        >
                            <option value="" disabled>
                                Select a major
                            </option>
                            {majors.map((major: any) => (
                                <option key={major.id} value={major.id}>
                                    {major.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                                onClick={onClose}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                type="submit"
                                disabled={!selectedMajorId}
                            >
                                Enroll
                            </button>
                        </div>
                    </form>
                ) : (
                    <p>No majors available</p>
                )}
            </div>
        </div>
    );
};

export default EnrollMajorDialog;
