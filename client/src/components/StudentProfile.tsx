import React from "react";
import {
    FiHash,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
} from "react-icons/fi";

interface StudentProfileProps {
    student: any;
    onUpdateProfile?: () => void; // Add optional callback prop
}

const StudentProfile: React.FC<StudentProfileProps> = ({
    student,
    onUpdateProfile,
}) => (
    <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiUser className="text-blue-500" />
            Student Profile
        </h2>
        <p className="text-gray-600 flex items-center gap-2">
            <FiHash className="text-gray-400" /> ID: {student.id}
        </p>
        <p className="text-gray-600 flex items-center gap-2">
            <FiUser className="text-gray-400" /> Full Name: {student.fullName}
        </p>
        <p className="text-gray-600 flex items-center gap-2">
            <FiMail className="text-gray-400" /> Email: {student.email}
        </p>
        <p className="text-gray-600 flex items-center gap-2">
            <FiPhone className="text-gray-400" /> Phone:{" "}
            {student.phone || "N/A"}
        </p>
        <p className="text-gray-600 flex items-center gap-2">
            <FiMapPin className="text-gray-400" /> Address:{" "}
            {student.address || "N/A"}
        </p>
        <p className="text-gray-600 flex items-center gap-2">
            <FiCalendar className="text-gray-400" /> Date of Birth:{" "}
            {student.dateOfBirth
                ? new Date(student.dateOfBirth).toLocaleDateString()
                : "N/A"}
        </p>
        {/* Update Profile button */}
        {onUpdateProfile && (
            <div className="mt-6 flex justify-end">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-2.5 rounded"
                    onClick={onUpdateProfile}
                    type="button"
                >
                    Update Profile
                </button>
            </div>
        )}
    </div>
);

export default StudentProfile;
