import { FiSearch } from "react-icons/fi";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-200">
                <FiSearch className="text-blue-400 mb-4" size={48} />
                <h1 className="text-3xl font-bold text-blue-700 mb-2">
                    404 Not Found
                </h1>
                <p className="text-gray-700 mb-4 text-center">
                    The page you are looking for does not exist.
                </p>
                <a
                    href="/"
                    className="mt-2 px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Go Home
                </a>
            </div>
        </div>
    );
};

export default NotFound;
