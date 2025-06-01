import { FiEdit2, FiTrash2, FiBookOpen } from "react-icons/fi";
import type { MajorType } from "../../types";

const ProgramTypesTable = ({
    programTypes,
    isLoading,
    isError,
    error,
    onEdit,
    onDelete,
}: {
    programTypes: MajorType[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
    onEdit: (type: MajorType) => void;
    onDelete: (id: number) => void;
}) => {
    if (isError) {
        console.error("Error loading program types:", error);
    }
    return (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto mb-6">
            <div className="flex items-center gap-2 mb-4">
                <FiBookOpen className="text-blue-500" />
                <h3 className="text-lg font-bold">Program Types</h3>
            </div>

            {isLoading ? (
                <div className="text-gray-500">Loading program types...</div>
            ) : isError ? (
                <div className="text-red-500">
                    Failed to load program types.
                </div>
            ) : !programTypes || programTypes.length === 0 ? (
                <div className="text-gray-500">No program types found.</div>
            ) : (
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-3 py-2 text-left font-semibold">
                                Name
                            </th>
                            <th className="px-3 py-2 text-left font-semibold">
                                Description
                            </th>
                            <th className="px-3 py-2 text-left font-semibold">
                                Majors
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {programTypes.map((type) => (
                            <tr
                                key={type.id}
                                className="border-b last:border-b-0 hover:bg-blue-50 transition"
                            >
                                <td className="px-3 py-2 font-medium">
                                    {type.name}
                                </td>
                                <td className="px-3 py-2">
                                    {type.description || (
                                        <span className="text-gray-400 italic">
                                            —
                                        </span>
                                    )}
                                </td>
                                <td className="px-3 py-2 flex gap-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => onEdit(type)}
                                        title="Edit"
                                        type="button"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => onDelete(type.id)}
                                        title="Delete"
                                        type="button"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProgramTypesTable;
