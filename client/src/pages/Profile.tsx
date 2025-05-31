import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import {
    FiUser,
    FiSettings,
    FiCreditCard,
    FiMail,
    FiShield,
    FiHash,
} from "react-icons/fi";
import AccountSettingsDialog from "../components/AccountSettingsDialog";

const Profile = () => {
    const { user } = useAuth();
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-4 py-10 flex justify-center items-center min-h-[70vh]">
            <div className="w-full max-w-lg bg-white/90 shadow-xl rounded-2xl p-8 relative">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full p-3 shadow-md mb-3">
                        <FiUser className="text-blue-500" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        Profile
                    </h2>
                    <span className="text-gray-400 text-sm">
                        Account Overview
                    </span>
                </div>
                {user ? (
                    <div>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-gray-700">
                                <FiHash className="text-gray-400" />
                                <span className="font-medium">ID:</span>
                                <span className="ml-1">{user.id}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <FiUser className="text-gray-400" />
                                <span className="font-medium">Name:</span>
                                <span className="ml-1">{user.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <FiMail className="text-gray-400" />
                                <span className="font-medium">Email:</span>
                                <span className="ml-1">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <FiShield className="text-gray-400" />
                                <span className="font-medium">Role:</span>
                                <span className="ml-1 capitalize">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
                            <button
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2 px-5 rounded-lg shadow transition"
                                onClick={() => setShowSettings(true)}
                                type="button"
                            >
                                <FiSettings /> Account Settings
                            </button>
                            <button
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition"
                                onClick={() => navigate("/payments")}
                                type="button"
                            >
                                <FiCreditCard /> View Payments
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center py-10">
                        <span className="text-gray-500">
                            Loading user info...
                        </span>
                    </div>
                )}
                <AccountSettingsDialog
                    open={showSettings}
                    onClose={() => setShowSettings(false)}
                    user={user}
                />
            </div>
        </div>
    );
};

export default Profile;
