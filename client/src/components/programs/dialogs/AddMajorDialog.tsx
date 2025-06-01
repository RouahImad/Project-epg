import { FiPlus, FiSave, FiX } from "react-icons/fi";
import type { Major, MajorType } from "../../../types";
import type { UseMutationResult } from "@tanstack/react-query";

const AddMajorDialog = ({
    showAddMajor,
    setShowAddMajor,
    majorForm,
    handleMajorFormChange,
    addMajor,
    handleAddMajorSubmit,
    majorTypes,
}: {
    showAddMajor: boolean;
    setShowAddMajor: (show: boolean) => void;
    majorForm:
        | Omit<Major, "id" | "createdAt">
        | {
              name: string;
              price: string;
              duration: any;
              description: string;
              majorTypeId: string;
          };

    handleMajorFormChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => void;
    addMajor: UseMutationResult<Major, Error, Partial<Major>>;
    handleAddMajorSubmit: () => void;
    majorTypes: MajorType[] | undefined;
}) => (
    <>
        {showAddMajor && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <form
                    className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!majorForm.majorTypeId) return;
                        addMajor.mutate(
                            {
                                ...majorForm,
                                price: Number(majorForm.price),
                                duration: majorForm.duration,
                                majorTypeId: Number(majorForm.majorTypeId),
                            },
                            {
                                onSuccess: () => {
                                    handleAddMajorSubmit();
                                    setShowAddMajor(false);
                                },
                            }
                        );
                    }}
                >
                    <button
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowAddMajor(false)}
                        type="button"
                        aria-label="Close"
                    >
                        <FiX size={22} />
                    </button>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FiPlus className="text-blue-500" /> Add Major
                    </h2>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">
                            Major Type
                        </label>
                        <select
                            name="majorTypeId"
                            className="border rounded px-3 py-2 w-full"
                            value={majorForm.majorTypeId || ""}
                            onChange={handleMajorFormChange}
                            required
                        >
                            <option value="" disabled>
                                Select major type
                            </option>
                            {majorTypes &&
                                majorTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">Name</label>
                        <input
                            name="name"
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={majorForm.name}
                            onChange={handleMajorFormChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">
                            Price
                        </label>
                        <input
                            name="price"
                            type="number"
                            className="border rounded px-3 py-2 w-full"
                            value={majorForm.price}
                            onChange={handleMajorFormChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">
                            Duration
                        </label>
                        <input
                            name="duration"
                            type="text"
                            className="border rounded px-3 py-2 w-full"
                            value={majorForm.duration}
                            onChange={handleMajorFormChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            className="border rounded px-3 py-2 w-full"
                            value={majorForm.description}
                            onChange={handleMajorFormChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center"
                        disabled={addMajor.isPending || !majorForm.majorTypeId}
                    >
                        <FiSave /> {addMajor.isPending ? "Saving..." : "Save"}
                    </button>
                    {!majorForm.majorTypeId && (
                        <div className="text-red-500 mt-2 text-sm">
                            Please select a program type to add a major.
                        </div>
                    )}
                    {addMajor.isError && (
                        <div className="text-red-500 mt-2 text-sm">
                            Failed to add major.
                        </div>
                    )}
                </form>
            </div>
        )}
    </>
);

export default AddMajorDialog;
