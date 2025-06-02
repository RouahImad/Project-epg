import React, { useState } from "react";
import { FiBookOpen, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import type { StudentMajorDetails } from "../../types";
import { formatDate } from "../../utils/helpers";

interface StudentMajorsProps {
    isLoading: boolean;
    studentMajors: StudentMajorDetails[] | [];
    onEditMajor: (major: StudentMajorDetails) => void;
    onDeleteMajor: (majorId: number) => void;
}

const StudentMajors: React.FC<StudentMajorsProps> = ({
    isLoading,
    studentMajors,
    onEditMajor,
    onDeleteMajor,
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMajors = studentMajors.filter((major) =>
        major.majorName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiBookOpen className="text-blue-500" />
                Enrolled Majors
            </h2>

            {!isLoading && studentMajors.length > 0 && (
                <div className="mb-4 relative">
                    <div className="flex items-center border rounded overflow-hidden">
                        <div className="pl-3 text-gray-400">
                            <FiSearch />
                        </div>
                        <input
                            type="text"
                            placeholder="Search majors..."
                            className="w-full p-2 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {isLoading ? (
                <p>Loading majors...</p>
            ) : studentMajors && studentMajors.length > 0 ? (
                <>
                    {filteredMajors.length === 0 ? (
                        <p className="text-gray-500">
                            No majors found matching your search
                        </p>
                    ) : (
                        <div className="overflow-x-auto shadow rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                                            Major
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                            Enrolled By
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                            Enrollment Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMajors.map((major) => (
                                        <tr key={major.majorId}>
                                            <td className="px-6 py-4 whitespace-nowrap truncate">
                                                {major.majorName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap truncate">
                                                {major.enrollerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {formatDate(
                                                    major.enrollmentDate
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
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
                                                    <button
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={() =>
                                                            onDeleteMajor(
                                                                major.majorId
                                                            )
                                                        }
                                                        title="Delete"
                                                        type="button"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500">No majors enrolled yet</p>
            )}
        </div>
    );
};

export default StudentMajors;
