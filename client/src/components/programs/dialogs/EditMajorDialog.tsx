import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import type { Major, MajorType } from "../../../types";
import type { UseMutationResult } from "@tanstack/react-query";

const EditMajorDialog = ({
    showEditMajor,
    setShowEditMajor,
    majorForm,
    handleMajorFormChange,
    updateMajor,
    editMajor,
    handleEditMajorSubmit,
    majorTypes,
}: {
    showEditMajor: boolean;
    setShowEditMajor: (show: boolean) => void;
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
    updateMajor: UseMutationResult<Major, Error, Partial<Major>>;
    editMajor: Major | null;
    handleEditMajorSubmit: () => void;
    majorTypes: MajorType[] | undefined;
}) => (
    <>
        {showEditMajor && editMajor && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-colors">
                <form
                    className="bg-white rounded-xl p-8 w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto"
                    style={{
                        minHeight: "420px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!majorForm.majorTypeId) return;

                        if (
                            majorForm.name === editMajor.name &&
                            majorForm.price === String(editMajor.price) &&
                            majorForm.duration === editMajor.duration &&
                            majorForm.description === editMajor.description &&
                            majorForm.majorTypeId ===
                                String(editMajor.majorTypeId)
                        ) {
                            setShowEditMajor(false);
                            return;
                        }

                        updateMajor.mutate(
                            {
                                ...majorForm,
                                id: editMajor.id,
                                price: Number(majorForm.price),
                                majorTypeId: Number(majorForm.majorTypeId),
                            },
                            {
                                onSuccess: () => {
                                    handleEditMajorSubmit();
                                    setShowEditMajor(false);
                                },
                            }
                        );
                    }}
                >
                    <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                        onClick={() => setShowEditMajor(false)}
                        type="button"
                        aria-label="Close"
                    >
                        <FiX size={24} />
                    </button>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-700">
                        <FiEdit2 className="text-blue-500" /> Edit Major
                    </h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">
                            Major Type
                        </label>
                        <select
                            name="majorTypeId"
                            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
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
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            value={majorForm.name}
                            onChange={handleMajorFormChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">
                            Price
                        </label>
                        <input
                            name="price"
                            type="number"
                            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            value={majorForm.price}
                            onChange={handleMajorFormChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">
                            Duration
                        </label>
                        <input
                            name="duration"
                            type="text"
                            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            value={majorForm.duration}
                            onChange={handleMajorFormChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">
                            Description
                        </label>
                        <textarea
                            name="description"
                            className="border rounded-lg px-3 py-2 w-full min-h-[70px] focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            value={majorForm.description || ""}
                            onChange={handleMajorFormChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 w-full justify-center font-semibold shadow transition"
                        disabled={
                            updateMajor.isPending || !majorForm.majorTypeId
                        }
                    >
                        <FiSave />{" "}
                        {updateMajor.isPending ? "Saving..." : "Save"}
                    </button>
                    {!majorForm.majorTypeId && (
                        <div className="text-red-500 mt-3 text-sm text-center">
                            Please select a program type.
                        </div>
                    )}
                    {updateMajor.isError && (
                        <div className="text-red-500 mt-3 text-sm text-center">
                            Failed to update major.
                        </div>
                    )}
                </form>
            </div>
        )}
    </>
);

export default EditMajorDialog;
