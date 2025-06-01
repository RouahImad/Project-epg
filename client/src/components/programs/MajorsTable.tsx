import { FiAward, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import type { Major, MajorType } from "../../types";

interface MajorsTableProps {
    majors: Major[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
    onAddMajor: () => void;
    onEditMajor?: (major: Major) => void;
    onDeleteMajor?: (majorId: number) => void;
    majorTypes?: MajorType[];
}

const MajorsTable = ({
    majors,
    isLoading,
    isError,
    error,
    onEditMajor,
    onDeleteMajor,
    onAddMajor,
    majorTypes,
}: MajorsTableProps) => {
    if (isError) {
        console.error("Error loading majors:", error);
    }
    return (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
                <FiAward className="text-blue-500" />
                <h3 className="text-lg font-bold">Majors</h3>

                <button
                    className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 shadow"
                    onClick={onAddMajor}
                    type="button"
                    disabled={!majorTypes || majorTypes.length === 0}
                >
                    <FiPlus /> Add Major
                </button>
            </div>
            {isLoading ? (
                <div className="text-gray-500">Loading majors...</div>
            ) : isError ? (
                <div className="text-red-500">Failed to load majors.</div>
            ) : majors && majors.length > 0 ? (
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-3 py-2 text-left font-semibold">
                                Name
                            </th>
                            <th className="px-3 py-2 text-left font-semibold">
                                Major Type
                            </th>
                            <th className="px-3 py-2 text-left font-semibold">
                                Price
                            </th>
                            <th className="px-3 py-2 text-left font-semibold">
                                Duration
                            </th>
                            <th className="px-3 py-2 text-left font-semibold">
                                Description
                            </th>
                            {(onEditMajor || onDeleteMajor) && (
                                <th className="px-3 py-2 text-left font-semibold">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {majors.map((major) => (
                            <tr
                                key={major.id}
                                className="border-b last:border-b-0"
                            >
                                <td className="px-3 py-2">{major.name}</td>
                                <td className="px-3 py-2">
                                    {majorTypes
                                        ? majorTypes.find(
                                              (t) => t.id === major.majorTypeId
                                          )?.name || (
                                              <span className="text-gray-400 italic">
                                                  —
                                              </span>
                                          )
                                        : major.majorTypeId}
                                </td>
                                <td className="px-3 py-2">{major.price}</td>
                                <td className="px-3 py-2">{major.duration}</td>
                                <td className="px-3 py-2">
                                    {major.description}
                                </td>
                                {(onEditMajor || onDeleteMajor) && (
                                    <td className="px-3 py-2 flex gap-2">
                                        {onEditMajor && (
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() =>
                                                    onEditMajor(major)
                                                }
                                                title="Edit"
                                                type="button"
                                            >
                                                <FiEdit2 />
                                            </button>
                                        )}
                                        {onDeleteMajor && (
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() =>
                                                    onDeleteMajor(major.id)
                                                }
                                                title="Delete"
                                                type="button"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-gray-500">No majors found.</div>
            )}
        </div>
    );
};

export default MajorsTable;
