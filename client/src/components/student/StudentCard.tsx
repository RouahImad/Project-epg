import { FiMapPin, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import type { Student } from "../../types";
import { formatDate } from "../../utils/helpers";
import { useNavigate } from "react-router";

const StudentCard = ({ student }: { student: Student }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        ID: {student.id}
                    </div>
                </div>
                <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 bg-blue-500 rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-lg">
                        {student.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {student.fullName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1 flex items-center">
                            <svg
                                className="h-4 w-4 mr-1 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                ></path>
                            </svg>
                            {student.email}
                        </p>
                        {student.phone && (
                            <p className="text-sm text-gray-600 flex items-center mb-1">
                                <svg
                                    className="h-4 w-4 mr-1 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    ></path>
                                </svg>
                                {student.phone}
                            </p>
                        )}
                        {student.address && (
                            <p className="text-sm text-gray-600 flex items-center mb-1">
                                <FiMapPin className="h-4 w-4 mr-1 text-gray-500" />
                                {student.address}
                            </p>
                        )}
                        {student.dateOfBirth && (
                            <p className="text-sm text-gray-600 flex items-center">
                                <FiCalendar className="h-4 w-4 mr-1 text-gray-500" />
                                {formatDate(student.dateOfBirth)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
                <motion.button
                    onClick={() => navigate(`/students/${student.id}`)}
                    className="w-full inline-flex justify-center items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    type="button"
                    whileTap={{ scale: 0.9 }}
                >
                    <span>View Details</span>
                    <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                    </svg>
                </motion.button>
            </div>
        </div>
    );
};

export default StudentCard;
