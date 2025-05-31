import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    useStudent,
    useStudentMajors,
    useUpdateStudent,
} from "../../hooks/api/useStudentsApi";
import { useMajors } from "../../hooks/api/useProgramsApi";
import { usePaymentsByStudent } from "../../hooks/api/usePaymentsApi";
import StudentProfile from "../../components/StudentProfile";
import StudentMajors from "../../components/StudentMajors";
import StudentPayments from "../../components/StudentPayments";
import EnrollMajorDialog from "../../components/EnrollMajorDialog";
import UpdateStudentDialog from "../../components/UpdateStudentDialog";
import { FiArrowLeft } from "react-icons/fi";
import type { Student } from "../../types";

const StudentDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState("profile");
    const [showEnrollDialog, setShowEnrollDialog] = useState(false);
    const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [updateForm, setUpdateForm] = useState<any>(null);
    const navigate = useNavigate();

    const {
        data: student,
        isLoading: isLoadingStudent,
        isError: isStudentError,
        error: studentError,
    } = useStudent(id as string);

    // Fetch student majors
    const { data: studentMajors, isLoading: isLoadingMajors } =
        useStudentMajors(id as string);

    // Fetch all majors for enroll dialog
    const { data: majors, isLoading: isLoadingMajorsList } = useMajors();

    // Fetch payments for this student
    const { data: payments, isLoading: isLoadingPayments } =
        usePaymentsByStudent(id as string);

    const updateStudentMutation = useUpdateStudent(id as string);

    // --- Loading/Error States ---
    if (isLoadingStudent) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <span className="ml-4 text-gray-600">
                    Loading student details...
                </span>
            </div>
        );
    }
    if (isStudentError) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <h3 className="text-red-700 font-medium mb-2">Error</h3>
                    <p className="text-red-600">
                        {studentError?.message || "Failed to load student"}
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
    if (!student) return <div>Student not found</div>;

    // --- Handlers ---
    const handleEnrollStudent = () => {
        // TODO: implement enroll logic
        setShowEnrollDialog(false);
    };

    const handleOpenUpdateProfile = () => {
        setUpdateForm({
            id: student.id,
            fullName: student.fullName,
            email: student.email,
            phone: student.phone,
            address: student.address,
            dateOfBirth: student.dateOfBirth,
        });
        setShowUpdateDialog(true);
    };

    const handleUpdateProfileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setUpdateForm((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedFields: Partial<Omit<Student, "createdAt" | "createdBy">> =
            {};
        if (updateForm.fullName !== student.fullName)
            updatedFields.fullName = updateForm.fullName;
        if (updateForm.email !== student.email)
            updatedFields.email = updateForm.email;
        if (updateForm.phone !== student.phone)
            updatedFields.phone = updateForm.phone;
        if (updateForm.address !== student.address)
            updatedFields.address = updateForm.address;
        if (updateForm.dateOfBirth !== student.dateOfBirth)
            updatedFields.dateOfBirth = updateForm.dateOfBirth;

        // If nothing changed, do not send to server
        if (Object.keys(updatedFields).length === 0) {
            return;
        }

        updateStudentMutation.mutate(
            {
                id: student.id,
                ...updatedFields,
            },
            {
                onSuccess: () => setShowUpdateDialog(false),
            }
        );
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <button
                className="mr-3 mb-4 text-gray-500 hover:text-blue-600"
                onClick={() => navigate(-1)}
                aria-label="Back"
                type="button"
            >
                <FiArrowLeft size={22} />
            </button>
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">
                            {student.fullName}
                        </h1>
                        <button
                            className="bg-blue-500 text-white px-2.5 py-1.5 rounded"
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
                    <StudentProfile
                        student={student}
                        onUpdateProfile={handleOpenUpdateProfile}
                    />
                )}
                {activeTab === "majors" && (
                    <StudentMajors
                        isLoading={isLoadingMajors}
                        studentMajors={studentMajors || []}
                    />
                )}
                {activeTab === "payments" && (
                    <StudentPayments
                        isLoading={isLoadingPayments}
                        payments={payments || []}
                    />
                )}
            </div>
            {/* Enroll Dialog */}
            <EnrollMajorDialog
                open={showEnrollDialog}
                isLoading={isLoadingMajorsList}
                majors={majors || []}
                selectedMajorId={selectedMajorId}
                onSelectMajor={setSelectedMajorId}
                onClose={() => setShowEnrollDialog(false)}
                onSubmit={handleEnrollStudent}
            />
            {/* Update Profile Dialog */}
            <UpdateStudentDialog
                open={showUpdateDialog}
                form={updateForm}
                isPending={updateStudentMutation.isPending}
                onClose={() => setShowUpdateDialog(false)}
                onChange={handleUpdateProfileChange}
                onSubmit={handleUpdateProfileSubmit}
                initialData={{
                    id: student.id,
                    fullName: student.fullName,
                    email: student.email,
                    phone: student.phone,
                    address: student.address,
                    dateOfBirth: student.dateOfBirth,
                }}
            />
        </div>
    );
};

export default StudentDetails;
