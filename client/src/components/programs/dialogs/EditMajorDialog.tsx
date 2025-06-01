import { FiEdit2, FiSave, FiX } from "react-icons/fi";

const EditMajorDialog = ({
    showEditMajor,
    setShowEditMajor,
    majorForm,
    handleMajorFormChange,
    updateMajor,
    editMajor,
    handleEditMajorSubmit,
    majorTypes,
}: any) => (
    <>
        {showEditMajor && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <form
                    className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!majorForm.majorTypeId) return;
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
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowEditMajor(false)}
                        type="button"
                        aria-label="Close"
                    >
                        <FiX size={22} />
                    </button>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <FiEdit2 className="text-blue-500" /> Edit Major
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
                                majorTypes.map((type: any) => (
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
                        disabled={
                            updateMajor.isPending || !majorForm.majorTypeId
                        }
                    >
                        <FiSave />{" "}
                        {updateMajor.isPending ? "Saving..." : "Save"}
                    </button>
                    {!majorForm.majorTypeId && (
                        <div className="text-red-500 mt-2 text-sm">
                            Please select a program type.
                        </div>
                    )}
                    {updateMajor.isError && (
                        <div className="text-red-500 mt-2 text-sm">
                            Failed to update major.
                        </div>
                    )}
                </form>
            </div>
        )}
    </>
);

export default EditMajorDialog;
