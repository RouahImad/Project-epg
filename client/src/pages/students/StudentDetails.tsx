import React, { useState } from "react";
import { useParams } from "react-router";
import {
    useStudent,
    useStudentMajors,
    useUpdateStudent,
    useAddStudentMajor,
} from "../../hooks/api/useStudentsApi";

const StudentDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState("profile");
    const [showEnrollDialog, setShowEnrollDialog] = useState(false);

    // Fetch student data
    const {
        data: student,
        isLoading: isLoadingStudent,
        isError: isStudentError,
        error: studentError,
    } = useStudent(id as string);

    // Fetch student majors
    const { data: studentMajors, isLoading: isLoadingMajors } =
        useStudentMajors(id as string);

    // Mutation for updating student
    const updateStudentMutation = useUpdateStudent();

    // Mutation for adding a major to student
    const addStudentMajorMutation = useAddStudentMajor({
        onSuccess: () => {
            setShowEnrollDialog(false);
        },
    });

    const handleUpdateStudent = (studentData: any) => {
        updateStudentMutation.mutate({
            studentId: id as string,
            studentData,
        });
    };

    const handleEnrollStudent = (majorId: number) => {
        addStudentMajorMutation.mutate({
            studentId: id as string,
            majorId,
        });
    };

    if (isLoadingStudent) return <div>Loading student details...</div>;

    if (isStudentError)
        return <div>Error loading student: {studentError?.message}</div>;

    if (!student) return <div>Student not found</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">
                            {student.fullName}
                        </h1>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() => setShowEnrollDialog(true)}
                        >
                            Enroll in Major
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-gray-700">
                                <strong>ID:</strong> {student.id}
                            </p>
                            <p className="text-gray-700">
                                <strong>Email:</strong> {student.email}
                            </p>
                            <p className="text-gray-700">
                                <strong>Phone:</strong> {student.phone || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-700">
                                <strong>Address:</strong>{" "}
                                {student.address || "N/A"}
                            </p>
                            <p className="text-gray-700">
                                <strong>Date of Birth:</strong>{" "}
                                {student.dateOfBirth
                                    ? new Date(
                                          student.dateOfBirth
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            className={`px-4 py-2 border-b-2 font-medium text-sm ${
                                activeTab === "profile"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab("profile")}
                        >
                            Profile
                        </button>
                        <button
                            className={`px-4 py-2 border-b-2 font-medium text-sm ${
                                activeTab === "majors"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab("majors")}
                        >
                            Enrolled Majors
                        </button>
                        <button
                            className={`px-4 py-2 border-b-2 font-medium text-sm ${
                                activeTab === "payments"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                            onClick={() => setActiveTab("payments")}
                        >
                            Payments
                        </button>
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {activeTab === "profile" && (
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Student Profile
                        </h2>
                        {/* Profile editing form would go here */}
                        <p>Profile editing form would go here</p>
                    </div>
                )}

                {activeTab === "majors" && (
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Enrolled Majors
                        </h2>

                        {isLoadingMajors ? (
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {studentMajors.map((major) => (
                                        <tr key={major.majorId}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {major.majorName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(
                                                    major.enrollmentDate
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button className="text-blue-500 hover:text-blue-700">
                                                    Add Payment
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">
                                No majors enrolled yet
                            </p>
                        )}
                    </div>
                )}

                {activeTab === "payments" && (
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Payments History
                        </h2>
                        <p className="text-gray-500">
                            No payments recorded yet
                        </p>
                    </div>
                )}
            </div>

            {/* Enroll Dialog */}
            {showEnrollDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            Enroll in Major
                        </h2>
                        {/* This would be a form to select a major and enroll */}
                        <p>Major selection form would go here</p>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                                onClick={() => setShowEnrollDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => handleEnrollStudent(1)} // Mock major ID for demo
                            >
                                Enroll
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDetails;
