import {
    FiEdit2,
    FiTrash2,
    FiBookOpen,
    FiPlus,
    FiSearch,
} from "react-icons/fi";
import type { MajorType } from "../../types";
import { useState } from "react";

const ProgramTypesTable = ({
    programTypes,
    isLoading,
    isError,
    error,
    onAdd,
    onEdit,
    onDelete,
}: {
    programTypes: MajorType[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
    onAdd: () => void;
    onEdit: (type: MajorType) => void;
    onDelete: (id: number) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    if (isError) {
        console.error("Error loading program types:", error);
    }
    const filteredTypes = programTypes?.filter(
        (type) =>
            type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            type.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto mb-6">
            <div className="flex items-center gap-2 mb-4">
                <FiBookOpen className="text-blue-500" />
                <h3 className="text-lg font-bold">Program Types</h3>
                <button
                    className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 shadow"
                    onClick={onAdd}
                    type="button"
                >
                    <FiPlus /> Add Major Type
                </button>
            </div>
            <div className="mb-3 flex items-center">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search program types..."
                        className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
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
                <div className="max-h-[340px] overflow-y-auto">
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
                            {(filteredTypes ?? programTypes).map((type) => (
                                <tr
                                    key={type.id}
                                    className="border-b last:border-b-0 hover:bg-blue-50 transition"
                                >
                                    <td className="px-3 py-2 font-medium">
                                        {type.name}
                                    </td>
                                    <td className="px-3 py-2">
                                        {type.description.length > 0 ? (
                                            type.description.length > 150 ? (
                                                <span title={type.description}>
                                                    {type.description.slice(
                                                        0,
                                                        150
                                                    )}
                                                    ...
                                                </span>
                                            ) : (
                                                type.description
                                            )
                                        ) : (
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
                </div>
            )}
        </div>
    );
};

export default ProgramTypesTable;
