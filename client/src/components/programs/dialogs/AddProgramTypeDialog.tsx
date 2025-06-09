import { FiPlus, FiSave, FiX } from "react-icons/fi";
import type { MajorType } from "../../../types";
import type { UseMutationResult } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface AddProgramTypeDialogProps {
    showAdd: boolean;
    setShowAdd: (show: boolean) => void;
    form: Partial<MajorType>;
    handleFormChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    createProgramType: UseMutationResult<MajorType, Error, Partial<MajorType>>;
    handleAddSubmit: () => void;
}

const AddProgramTypeDialog = ({
    showAdd,
    setShowAdd,
    form,
    handleFormChange,
    createProgramType,
    handleAddSubmit,
}: AddProgramTypeDialogProps) => (
    <>
        {showAdd && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <form
                    className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
                    onSubmit={(e) => {
                        e.preventDefault();
                        createProgramType.mutate(form, {
                            onSuccess: () => {
                                handleAddSubmit();
                                setShowAdd(false);
                            },
                        });
                    }}
                >
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowAdd(false)}
                        type="button"
                        aria-label="Close"
                    >
                        <FiX size={22} />
                    </motion.button>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FiPlus className="text-blue-500" /> Add Program Type
                    </h2>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">Name</label>
                        <input
                            name="name"
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={form.name}
                            onChange={handleFormChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            className="border rounded px-3 py-2 w-full"
                            value={form.description}
                            onChange={handleFormChange}
                        />
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center"
                        disabled={createProgramType.isPending}
                    >
                        <FiSave />{" "}
                        {createProgramType.isPending ? "Saving..." : "Save"}
                    </motion.button>
                    {createProgramType.isError && (
                        <div className="text-red-500 mt-2 text-sm">
                            Failed to add program type.
                        </div>
                    )}
                </form>
            </div>
        )}
    </>
);

export default AddProgramTypeDialog;
