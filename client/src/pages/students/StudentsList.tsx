import { useState, useRef } from "react";
import AddStudentForm from "../../components/student/dialogs/AddStudentForm";
import { useCreateStudent, useStudents } from "../../hooks/api/useStudentsApi";
import StudentCard from "../../components/student/StudentCard";
import { FiSearch, FiX, FiPlus, FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router";

const StudentsList = () => {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const { data: students, isLoading, isError, error } = useStudents();
    const createStudentMutation = useCreateStudent();

    const navigate = useNavigate();

    const handleAddStudent = (studentData: {
        id: string;
        fullName: string;
        email: string;
        phone?: string;
        address?: string;
        dateOfBirth?: any;
    }) => {
        createStudentMutation.mutate(studentData, {
            onSuccess: (_, vars) => {
                setSearchTerm("");
                navigate("/students/" + vars.id);
            },
        });
        setShowAddDialog(false);
    };

    const filteredStudents = students?.filter((student) =>
        [student.fullName, student.email, student.id, student.phone]
            .filter(Boolean)
            .some((field) =>
                field?.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );

    const focusSearchInput = () => {
        searchInputRef.current?.focus();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-blue-200 rounded-full mb-2"></div>
                    <div className="text-gray-600">Loading students...</div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <h3 className="text-red-700 font-medium mb-2">Error</h3>
                    <p className="text-red-600">
                        {error?.message || "Failed to load students"}
                    </p>
                    <button
                        className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header section with actions */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Students</h1>
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="relative w-full sm:w-auto">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search students..."
                            className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FiSearch
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
                            onClick={focusSearchInput}
                        />
                        {searchTerm && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setSearchTerm("")}
                                aria-label="Clear search"
                                type="button"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                        onClick={() => setShowAddDialog(true)}
                        type="button"
                    >
                        <FiPlus className="h-5 w-5" />
                        <span>Add Student</span>
                    </button>
                </div>
            </div>

            {/* Students count */}
            <div className="mb-6">
                <p className="text-gray-600">
                    {filteredStudents?.length || 0}{" "}
                    {filteredStudents?.length === 1 ? "student" : "students"}
                    {searchTerm && ` matching "${searchTerm}"`}
                </p>
            </div>

            {/* Student card grid */}
            {filteredStudents?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:mx-10">
                    {filteredStudents.map((student) => (
                        <StudentCard key={student.id} student={student} />
                    ))}
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-8 text-center">
                    <div className="flex flex-col items-center justify-center py-12">
                        <FiUsers className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-1">
                            No students found
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {searchTerm
                                ? `No students match your search "${searchTerm}"`
                                : "Get started by adding your first student"}
                        </p>
                        {searchTerm ? (
                            <button
                                className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
                                onClick={() => setSearchTerm("")}
                                type="button"
                            >
                                Clear search
                            </button>
                        ) : (
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                onClick={() => setShowAddDialog(true)}
                                type="button"
                            >
                                <FiPlus className="h-5 w-5 mr-1" />
                                Add Your First Student
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Add Student Form */}
            <AddStudentForm
                open={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                onSubmit={handleAddStudent}
                isLoading={createStudentMutation.isPending}
            />
        </div>
    );
};

export default StudentsList;
