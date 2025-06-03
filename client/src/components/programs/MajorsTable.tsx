import {
    FiAward,
    FiEdit2,
    FiTrash2,
    FiPlus,
    FiDollarSign,
    FiSearch,
} from "react-icons/fi";
import type { Major, MajorType } from "../../types";
import { formatMoney } from "../../utils/helpers";
import { useState } from "react";

interface MajorsTableProps {
    majors: Major[] | [] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
    onAddMajor: () => void;
    onEditMajor: (major: Major) => void;
    onDeleteMajor: (majorId: number) => void;
    onManageTaxes?: (major: Major) => void;
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
    onManageTaxes,
    majorTypes,
}: MajorsTableProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    if (isError) {
        console.error("Error loading majors:", error);
    }
    const filteredMajors = majors?.filter(
        (major) =>
            major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (majorTypes &&
                majorTypes.some(
                    (type) =>
                        type.id === major.majorTypeId &&
                        type.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                )) ||
            (major.description &&
                major.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
                <FiAward className="text-blue-500" />
                <h3 className="text-lg font-bold">Majors</h3>
                <button
                    className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded flex items-center gap-1 shadow"
                    onClick={onAddMajor}
                    type="button"
                    disabled={!majorTypes || majorTypes.length === 0}
                >
                    <FiPlus /> Add Major
                </button>
            </div>
            <div className="mb-3 flex items-center">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search majors..."
                        className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
            {isLoading ? (
                <div className="text-gray-500">Loading majors...</div>
            ) : isError ? (
                <div className="text-red-500">Failed to load majors.</div>
            ) : majors && majors.length > 0 ? (
                <div className="max-h-[340px] overflow-y-auto">
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
                                <th className="px-3 py-2 text-left font-semibold">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(filteredMajors ?? majors).map((major) => (
                                <tr
                                    key={major.id}
                                    className="border-b last:border-b-0"
                                >
                                    <td className="px-3 py-2">{major.name}</td>
                                    <td className="px-3 py-2">
                                        {majorTypes
                                            ? majorTypes.find(
                                                  (t) =>
                                                      t.id === major.majorTypeId
                                              )?.name || (
                                                  <span className="text-gray-400 italic">
                                                      —
                                                  </span>
                                              )
                                            : major.majorTypeId}
                                    </td>
                                    <td className="px-3 py-2">
                                        {formatMoney(major.price)}
                                    </td>
                                    <td className="px-3 py-2">
                                        {major.duration}
                                    </td>
                                    <td className="px-3 py-2">
                                        {major.description &&
                                        major.description.length > 60 ? (
                                            <span
                                                title={major.description}
                                                className="cursor-pointer"
                                            >
                                                {major.description.slice(0, 60)}
                                                ...
                                            </span>
                                        ) : (
                                            major.description
                                        )}
                                    </td>
                                    <td className="px-3 py-2 flex gap-2">
                                        {/* Manage Taxes Action */}
                                        {onManageTaxes && (
                                            <button
                                                className="text-green-600 hover:text-green-800"
                                                onClick={() =>
                                                    onManageTaxes(major)
                                                }
                                                title="Manage Taxes"
                                                type="button"
                                            >
                                                <FiDollarSign />
                                            </button>
                                        )}

                                        {/* Update Action */}
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

                                        {/* Delete Action */}
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-gray-500">No majors found.</div>
            )}
        </div>
    );
};

export default MajorsTable;
