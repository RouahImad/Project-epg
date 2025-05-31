import { FiAlertTriangle } from "react-icons/fi";

const Forbidden = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
            <div className="p-8 flex flex-col items-center">
                <FiAlertTriangle className="text-red-500 mb-4" size={48} />
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                    403 Forbidden
                </h1>
                <p className="text-gray-700 mb-4 text-center">
                    You do not have permission to access this page.
                </p>
                <a
                    href="/"
                    className="mt-2 px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                    Go Home
                </a>
            </div>
        </div>
    );
};

export default Forbidden;
