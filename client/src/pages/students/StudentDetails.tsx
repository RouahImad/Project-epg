import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
    useStudent,
    useStudentMajors,
    useUpdateStudent,
    useDeleteStudent,
    useAddStudentMajor,
    useUpdateStudentMajor,
    useDeleteStudentMajor,
    useMajors,
    useCreatePayment,
    usePaymentsByStudent,
} from "../../hooks/api/";
import StudentProfile from "../../components/student/StudentProfile";
import StudentMajors from "../../components/student/StudentMajors";
import StudentPayments from "../../components/student/StudentPayments";
import EnrollMajorDialog from "../../components/student/dialogs/EnrollMajorDialog";
import UpdateStudentDialog from "../../components/student/dialogs/UpdateStudentDialog";
import { useAuth } from "../../contexts/AuthContext";
import { FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import type { Student, StudentMajor, StudentMajorDetails } from "../../types";
import EditMajorDialog from "../../components/student/dialogs/EditMajorDialog";
import { formatDate } from "../../utils/helpers";
import type React from "react";
import ReceiptPrintDialog from "../../components/common/ReceiptPrintDialog";
import { motion } from "framer-motion";

const StudentDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState("profile");
    const [showEnrollDialog, setShowEnrollDialog] = useState(false);
    const [selectedMajorId, setSelectedMajorId] = useState<number | null>(null);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [updateForm, setUpdateForm] = useState<any>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editMajor, setEditMajor] = useState<StudentMajorDetails | null>(
        null
    );
    const [showEditMajorDialog, setShowEditMajorDialog] = useState(false);
    const [deleteMajorId, setDeleteMajorId] = useState<number | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<{
        major: any;
        paidAmount: number;
        taxes: any[];
    } | null>(null);
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
    const { userRole } = useAuth();
    const deleteStudentMutation = useDeleteStudent();
    const addStudentMajorMutation = useAddStudentMajor();
    const addPaymentMutation = useCreatePayment();
    const updateStudentMajorMutation = useUpdateStudentMajor();
    const deleteStudentMajorMutation = useDeleteStudentMajor();

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
    if (isStudentError || !student) {
        if (!student || (studentError as any)?.response?.status === 404) {
            return (
                <div className="flex justify-center items-center min-h-[85vh]">
                    <div className="p-8 max-w-md w-full text-center">
                        <div className="flex justify-center mb-4">
                            <svg
                                width="56"
                                height="56"
                                fill="none"
                                viewBox="0 0 56 56"
                            >
                                <circle
                                    cx="28"
                                    cy="28"
                                    r="28"
                                    fill="#F87171"
                                    fillOpacity="0.15"
                                />
                                <path
                                    d="M36 36L20 20M20 36L36 20"
                                    stroke="#EF4444"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <h3 className="text-red-700 font-extrabold mb-2 text-2xl tracking-tight">
                            Student Not Found
                        </h3>
                        <p className="text-gray-700 mb-6 text-base">
                            The student you are looking for does not exist, may
                            have been removed, or the link is incorrect.
                        </p>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all duration-150"
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Go Back
                        </button>
                        <div className="mt-6 text-xs text-gray-400">
                            Error code:{" "}
                            <span className="font-mono text-red-400">404</span>
                        </div>
                    </div>
                </div>
            );
        }
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

    // --- Handlers ---
    const handleEnrollStudent = async (data: {
        majorId: number;
        paidAmount: number;
    }) => {
        if (!student?.id || !data.majorId) return;

        // Helper to close dialog and reset state
        const finish = () => {
            setShowEnrollDialog(false);
            setSelectedMajorId(null);
        };

        // Enroll student in major
        addStudentMajorMutation.mutate(
            { studentId: student.id, majorId: data.majorId },
            {
                onSuccess: () => {
                    // Only record payment if paidAmount > 0
                    if (data.paidAmount > 0) {
                        addPaymentMutation.mutate(
                            {
                                studentId: student.id,
                                majorId: data.majorId,
                                amountPaid: data.paidAmount,
                            },
                            {
                                onSuccess: () => {
                                    const major = majors?.find(
                                        (m) => m.id === data.majorId
                                    );
                                    setReceiptData({
                                        major,
                                        paidAmount: data.paidAmount,
                                        taxes: [],
                                    });
                                    setShowReceipt(true);
                                    finish();
                                },
                                onError: (error) => {
                                    console.error(
                                        "Failed to record payment:",
                                        error
                                    );
                                    finish();
                                },
                            }
                        );
                    } else {
                        finish();
                    }
                },
                onError: (error) => {
                    console.error("Failed to enroll student:", error);
                    finish();
                },
            }
        );
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
        setUpdateForm((prev: Partial<Student>) => ({ ...prev, [name]: value }));
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

    const handleDeleteStudent = () => {
        if (!student) return;
        deleteStudentMutation.mutate(student.id, {
            onSuccess: () => {
                setShowDeleteDialog(false);
                navigate("/students");
            },
        });
    };

    // --- Handlers for majors ---
    const handleEditMajor = (major: StudentMajorDetails) => {
        setEditMajor(major);
        setShowEditMajorDialog(true);
    };

    const handleUpdateMajor = (
        data: Omit<StudentMajor, "studentId" | "majorId" | "enrolledBy">
    ) => {
        if (!editMajor) return;
        updateStudentMajorMutation.mutate(
            {
                studentId: id as string,
                majorId: editMajor.majorId,
                data,
            },
            {
                onSuccess: () => {
                    setShowEditMajorDialog(false);
                    setEditMajor(null);
                },
            }
        );
    };

    const handleDeleteMajor = (majorId: number) => {
        setDeleteMajorId(majorId);
    };

    const confirmDeleteMajor = () => {
        if (!id || deleteMajorId == null) return;
        deleteStudentMajorMutation.mutate(
            { studentId: id as string, majorId: deleteMajorId },
            {
                onSuccess: () => {
                    setDeleteMajorId(null);
                },
            }
        );
    };

    return (
        <div className="container mx-auto px-4 py-6 md:max-w-[85vw]">
            <motion.button
                whileTap={{ scale: 0.9 }}
                className="mr-3 mb-4 text-gray-500 hover:text-blue-600"
                onClick={() => navigate(-1)}
                aria-label="Back"
                type="button"
            >
                <FiArrowLeft size={22} />
            </motion.button>
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">
                            {student.fullName}
                        </h1>
                        <div className="flex gap-2">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="bg-green-500 text-white px-2.5 py-1.5 rounded flex items-center gap-1"
                                onClick={() => setShowEnrollDialog(true)}
                            >
                                <FiPlus />
                                Enroll
                            </motion.button>
                            {userRole === "super_admin" && (
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    className="bg-red-500 text-white px-2.5 py-1.5 rounded flex items-center gap-1"
                                    onClick={() => setShowDeleteDialog(true)}
                                    type="button"
                                    title="Delete Student"
                                >
                                    <FiTrash2 /> Delete
                                </motion.button>
                            )}
                        </div>
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
                                {formatDate(student.dateOfBirth)}
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
                        onEditMajor={handleEditMajor}
                        onDeleteMajor={handleDeleteMajor}
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
            {/* Delete Student Dialog */}
            {userRole === "super_admin" && showDeleteDialog && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
                        <h2 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
                            <FiTrash2 /> Delete Student
                        </h2>
                        <p className="mb-4">
                            Are you sure you want to delete this student?
                        </p>
                        <div className="flex justify-end gap-2">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                onClick={() => setShowDeleteDialog(false)}
                                disabled={deleteStudentMutation.isPending}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                onClick={handleDeleteStudent}
                                disabled={deleteStudentMutation.isPending}
                            >
                                {deleteStudentMutation.isPending
                                    ? "Deleting..."
                                    : "Delete"}
                            </motion.button>
                        </div>
                        {deleteStudentMutation.isError && (
                            <div className="text-red-500 mt-2 text-sm">
                                Failed to delete student.
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Edit Major Dialog */}
            {showEditMajorDialog && editMajor && (
                <EditMajorDialog
                    open={showEditMajorDialog}
                    major={editMajor}
                    isPending={updateStudentMajorMutation.isPending}
                    onClose={() => {
                        setShowEditMajorDialog(false);
                        setEditMajor(null);
                    }}
                    onSubmit={handleUpdateMajor}
                />
            )}
            {/* Delete Major Dialog */}
            {deleteMajorId !== null && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
                        <h2 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
                            <FiTrash2 /> Remove Major
                        </h2>
                        <p className="mb-4">
                            Are you sure you want to remove this major
                            enrollment?
                        </p>
                        <div className="flex justify-end gap-2">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                onClick={() => setDeleteMajorId(null)}
                                disabled={deleteStudentMajorMutation.isPending}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                onClick={confirmDeleteMajor}
                                disabled={deleteStudentMajorMutation.isPending}
                            >
                                {deleteStudentMajorMutation.isPending
                                    ? "Deleting..."
                                    : "Delete"}
                            </motion.button>
                        </div>
                        {deleteStudentMajorMutation.isError && (
                            <div className="text-red-500 mt-2 text-sm">
                                Failed to remove major.
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Receipt Print Dialog */}
            {showReceipt && receiptData && (
                <ReceiptPrintDialog
                    open={showReceipt}
                    onClose={() => setShowReceipt(false)}
                    studentId={student.id}
                    studentName={student.fullName}
                    major={receiptData.major}
                    paidAmount={receiptData.paidAmount}
                    taxes={receiptData.taxes}
                />
            )}
        </div>
    );
};

export default StudentDetails;
