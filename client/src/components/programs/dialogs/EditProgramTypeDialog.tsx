import type { UseMutationResult } from "@tanstack/react-query";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import type { MajorType } from "../../../types";

const EditProgramTypeDialog = ({
    showEdit,
    setShowEdit,
    editId,
    form,
    handleFormChange,
    updateProgramType,
    handleEditSubmit,
}: {
    showEdit: boolean;
    setShowEdit: (show: boolean) => void;
    editId: number | undefined;
    form: { name: string; description: string };
    handleFormChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    updateProgramType: UseMutationResult<MajorType, Error, Partial<MajorType>>;
    handleEditSubmit: () => void;
}) => (
    <>
        {showEdit && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <form
                    className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
                    onSubmit={(e) => {
                        if (!editId) return;
                        e.preventDefault();

                        updateProgramType.mutate(
                            { ...form, id: editId },
                            {
                                onSuccess: () => {
                                    handleEditSubmit();
                                    setShowEdit(false);
                                },
                            }
                        );
                    }}
                >
                    <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowEdit(false)}
                        type="button"
                        aria-label="Close"
                    >
                        <FiX size={22} />
                    </button>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FiEdit2 className="text-blue-500" /> Edit Program Type
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
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center"
                        disabled={updateProgramType.isPending}
                    >
                        <FiSave />{" "}
                        {updateProgramType.isPending ? "Saving..." : "Save"}
                    </button>
                    {updateProgramType.isError && (
                        <div className="text-red-500 mt-2 text-sm">
                            Failed to update program type.
                        </div>
                    )}
                </form>
            </div>
        )}
    </>
);

export default EditProgramTypeDialog;
