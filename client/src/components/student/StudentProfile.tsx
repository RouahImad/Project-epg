import React from "react";
import {
    FiHash,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
} from "react-icons/fi";
import type { Student } from "../../types";
import { formatDate } from "../../utils/helpers";

interface StudentProfileProps {
    student: Student;
    onUpdateProfile?: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({
    student,
    onUpdateProfile,
}) => (
    <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
            {/* Avatar & Name Section */}
            <div className="flex flex-col items-center md:w-1/3">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4 shadow">
                    <FiUser className="text-blue-500" size={64} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                    {student.fullName}
                </h2>
                <span className="text-gray-500 text-sm mb-2 text-center">
                    Student Profile
                </span>
                {onUpdateProfile && (
                    <button
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
                        onClick={onUpdateProfile}
                        type="button"
                    >
                        Update Profile
                    </button>
                )}
            </div>
            {/* Details Section */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-center gap-3">
                    <FiHash className="text-gray-400" size={20} />
                    <div>
                        <div className="text-xs text-gray-400">ID</div>
                        <div className="text-gray-700 font-medium">
                            {student.id}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FiMail className="text-gray-400" size={20} />
                    <div>
                        <div className="text-xs text-gray-400">Email</div>
                        <div className="text-gray-700 font-medium">
                            {student.email}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FiPhone className="text-gray-400" size={20} />
                    <div>
                        <div className="text-xs text-gray-400">Phone</div>
                        <div className="text-gray-700 font-medium">
                            {student.phone || "N/A"}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FiMapPin className="text-gray-400" size={20} />
                    <div>
                        <div className="text-xs text-gray-400">Address</div>
                        <div className="text-gray-700 font-medium">
                            {student.address || "N/A"}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FiCalendar className="text-gray-400" size={20} />
                    <div>
                        <div className="text-xs text-gray-400">
                            Date of Birth
                        </div>
                        <div className="text-gray-700 font-medium">
                            {formatDate(student.dateOfBirth)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default StudentProfile;
