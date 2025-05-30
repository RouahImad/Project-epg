import { useRef, useEffect, useState } from "react";
import {
    FiLogOut,
    FiUser,
    FiHome,
    FiUsers,
    FiDollarSign,
    FiSettings,
    FiBriefcase,
    FiBookOpen,
    FiFileText,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

const NavBar = () => {
    const navigate = useNavigate();
    const { user, userRole, setUser } = useAuth();
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const adminMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        setUser(null);
        navigate("/login");
    };

    useEffect(() => {
        console.log("Admin menu state changed:", adminMenuOpen);

        if (!adminMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            console.log("Click outside admin menu detected");

            if (
                adminMenuRef.current &&
                !adminMenuRef.current.contains(event.target as Node)
            ) {
                setAdminMenuOpen(false);
            }
        };
        console.log("Admin menu open, adding click listener");

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [adminMenuOpen]);

    // Admin links grouped for reuse
    const adminLinks = (
        <>
            <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition px-3 py-2 rounded-md ${
                        isActive
                            ? "text-indigo-900 bg-indigo-50 active"
                            : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
                    }`
                }
                onClick={() => setMobileMenuOpen(false)}
            >
                <FiSettings className="h-5 w-5" /> Users
            </NavLink>
            <NavLink
                to="/admin/company"
                className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition px-3 py-2 rounded-md ${
                        isActive
                            ? "text-indigo-900 bg-indigo-50 active"
                            : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
                    }`
                }
                onClick={() => setMobileMenuOpen(false)}
            >
                <FiBriefcase className="h-5 w-5" /> Company
            </NavLink>
            <NavLink
                to="/admin/programs"
                className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition px-3 py-2 rounded-md ${
                        isActive
                            ? "text-indigo-900 bg-indigo-50 active"
                            : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
                    }`
                }
                onClick={() => setMobileMenuOpen(false)}
            >
                <FiBookOpen className="h-5 w-5" /> Programs
            </NavLink>
            <NavLink
                to="/admin/logs"
                className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition px-3 py-2 rounded-md ${
                        isActive
                            ? "text-indigo-900 bg-indigo-50 active"
                            : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
                    }`
                }
                onClick={() => setMobileMenuOpen(false)}
            >
                <FiFileText className="h-5 w-5" /> Logs
            </NavLink>
        </>
    );

    return (
        <nav className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-2 font-bold text-lg transition ${
                            isActive
                                ? "text-indigo-900 active"
                                : "text-indigo-700 hover:text-indigo-900"
                        }`
                    }
                >
                    <FiHome className="h-5 w-5" /> Dashboard
                </NavLink>
                <NavLink
                    to="/students"
                    className={({ isActive }) =>
                        `flex items-center gap-2 font-medium transition ${
                            isActive
                                ? "text-indigo-900 active"
                                : "text-gray-700 hover:text-indigo-900"
                        }`
                    }
                >
                    <FiUsers className="h-5 w-5" /> Students
                </NavLink>
                <NavLink
                    to="/payments"
                    className={({ isActive }) =>
                        `flex items-center gap-2 font-medium transition ${
                            isActive
                                ? "text-indigo-900 active"
                                : "text-gray-700 hover:text-indigo-900"
                        }`
                    }
                >
                    <FiDollarSign className="h-5 w-5" /> Payments
                </NavLink>
                {/* SUPER_ADMIN ONLY: Mega menu for desktop, burger for mobile */}
                {userRole === "super_admin" && (
                    <>
                        {/* Desktop Mega Menu */}
                        <div
                            className="hidden md:block relative"
                            ref={adminMenuRef}
                            onClick={() => setAdminMenuOpen((v) => !v)}
                        >
                            <button
                                className="flex items-center gap-2 font-medium text-gray-700 hover:text-indigo-900 transition px-3 py-2 rounded-md focus:outline-none cursor-pointer"
                                aria-haspopup="true"
                                aria-expanded={adminMenuOpen}
                                tabIndex={0}
                            >
                                <FiSettings className="h-5 w-5" /> Admin
                            </button>
                            {adminMenuOpen && (
                                <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-20 p-3 grid grid-cols-2 gap-2 animate-fade-in">
                                    {adminLinks}
                                </div>
                            )}
                        </div>
                        {/* Mobile Burger Menu */}
                        <div className="md:hidden">
                            <button
                                className="flex items-center gap-2 text-gray-700 hover:text-indigo-900 transition px-2 py-2"
                                onClick={() => setMobileMenuOpen((v) => !v)}
                                aria-label="Toggle admin menu"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                                <span className="font-medium">Admin</span>
                            </button>
                            {mobileMenuOpen && (
                                <div className="absolute left-0 top-16 w-full bg-white shadow-lg rounded-b-lg z-30 p-3 flex flex-col animate-fade-in">
                                    {adminLinks}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className="flex items-center gap-5">
                {user && (
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex items-center gap-2 text-gray-700 transition ${
                                isActive
                                    ? "text-indigo-900 active"
                                    : "hover:text-indigo-900"
                            }`
                        }
                    >
                        <FiUser className="h-5 w-5" /> Profile
                    </NavLink>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-700 transition font-medium"
                >
                    <FiLogOut className="h-5 w-5" /> Logout
                </button>
            </div>
        </nav>
    );
};

export default NavBar;
