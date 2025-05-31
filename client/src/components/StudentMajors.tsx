import React from "react";
import { FiBookOpen } from "react-icons/fi";

interface StudentMajorsProps {
    isLoading: boolean;
    studentMajors: any[];
}

const StudentMajors: React.FC<StudentMajorsProps> = ({
    isLoading,
    studentMajors,
}) => (
    <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiBookOpen className="text-blue-500" />
            Enrolled Majors
        </h2>
        {isLoading ? (
            <p>Loading majors...</p>
        ) : studentMajors && studentMajors.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Major
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enrollment Date
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {studentMajors.map((major: any) => (
                        <tr key={major.majorId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {major.majorName || major.majorId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {major.enrollmentDate
                                    ? new Date(
                                          major.enrollmentDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p className="text-gray-500">No majors enrolled yet</p>
        )}
    </div>
);

export default StudentMajors;
