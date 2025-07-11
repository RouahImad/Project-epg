import { useRef, useEffect, useState, useCallback } from "react";
import {
    FiLogOut,
    FiUser,
    FiHome,
    FiUsers,
    FiSettings,
    FiBriefcase,
    FiFileText,
    FiDollarSign,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useLogout } from "../hooks/api/";
import { IoSchool } from "react-icons/io5";

const NavBar = () => {
    const navigate = useNavigate();
    const { user, userRole, setUser } = useAuth();
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const adminMenuRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const logoutMutation = useLogout();

    const handleLogout = useCallback(() => {
        logoutMutation.mutate(undefined, {
            onSettled: () => {
                localStorage.removeItem("userRole");
                setUser(null);
                navigate("/login");
            },
        });
    }, [logoutMutation, navigate, setUser]);

    useEffect(() => {
        if (!adminMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                adminMenuOpen &&
                adminMenuRef.current &&
                !adminMenuRef.current.contains(event.target as Node)
            ) {
                setAdminMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [adminMenuOpen]);

    useEffect(() => {
        if (!userMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                userMenuOpen &&
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [userMenuOpen]);

    // Create a consistent style for all nav links
    const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-1.5 md:gap-2 font-medium transition px-2 md:px-3 py-1.5 md:py-2 rounded-md ${
            isActive
                ? "text-indigo-500 bg-indigo-50 active"
                : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
        } text-sm md:text-base`;

    // Admin links grouped for reuse
    const adminLinks = (
        <>
            <NavLink
                to="/admin/users"
                className={navLinkStyle}
                onClick={() => setAdminMenuOpen(false)}
            >
                <FiSettings className="h-5 w-5" /> Users
            </NavLink>
            <NavLink
                to="/admin/company"
                className={navLinkStyle}
                onClick={() => setAdminMenuOpen(false)}
            >
                <FiBriefcase className="h-5 w-5" style={{ flexShrink: 0 }} />{" "}
                Company
            </NavLink>
            <NavLink
                to="/admin/programs"
                className={navLinkStyle}
                onClick={() => setAdminMenuOpen(false)}
            >
                <IoSchool className="h-5 w-5" style={{ flexShrink: 0 }} />{" "}
                Programs
            </NavLink>
            <NavLink
                to="/admin/logs"
                className={navLinkStyle}
                onClick={() => setAdminMenuOpen(false)}
            >
                <FiFileText className="h-5 w-5" /> Logs
            </NavLink>
            <NavLink
                to="/payments"
                className={navLinkStyle}
                onClick={() => setAdminMenuOpen(false)}
            >
                <FiDollarSign
                    className="h-4.5 w-4.5"
                    style={{ flexShrink: 0 }}
                />{" "}
                Payments
            </NavLink>
            <NavLink
                to="/admin/taxes"
                className={navLinkStyle}
                onClick={() => setAdminMenuOpen(false)}
            >
                <FiDollarSign
                    className="h-4.5 w-4.5"
                    style={{ flexShrink: 0 }}
                />{" "}
                Taxes
            </NavLink>
        </>
    );

    return (
        <nav className="w-full bg-white shadow-md px-4 py-3 flex items-center justify-between relative">
            <div className="flex items-center gap-2">
                <NavLink to="/dashboard" className={navLinkStyle}>
                    <FiHome className="h-5 w-5" /> Dashboard
                </NavLink>
                <NavLink to="/students" className={navLinkStyle}>
                    <FiUsers className="h-5 w-5" /> Students
                </NavLink>

                {userRole === "super_admin" && (
                    <div
                        className="relative"
                        ref={adminMenuRef}
                        tabIndex={0}
                        onClick={() => setAdminMenuOpen((v) => !v)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setAdminMenuOpen((v) => !v);
                            }
                        }}
                    >
                        <button
                            type="button"
                            className="flex items-center gap-2 font-medium text-gray-700 hover:text-indigo-900 hover:bg-indigo-50 transition px-3 py-2 rounded-md focus:outline-none text-sm md:text-base"
                            aria-haspopup="true"
                            aria-expanded={adminMenuOpen}
                            tabIndex={-1}
                        >
                            <FiSettings className="h-5 w-5" /> Admin
                        </button>
                        {adminMenuOpen && (
                            <div className="absolute -left-21 md:left-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-30 p-3 grid grid-cols-2 gap-2 animate-fade-in">
                                {adminLinks}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-5">
                <div className="hidden md:flex items-center gap-5">
                    {user && (
                        <NavLink to="/profile" className={navLinkStyle}>
                            <FiUser className="h-5 w-5" /> Profile
                        </NavLink>
                    )}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition font-medium px-3 py-2 rounded-md text-sm md:text-base"
                        aria-label="Logout"
                    >
                        <FiLogOut className="h-5 w-5" /> Logout
                    </button>
                </div>

                <div className="md:hidden relative" ref={userMenuRef}>
                    <button
                        type="button"
                        className="flex items-center gap-2 text-gray-700 hover:text-indigo-900 hover:bg-indigo-50 transition px-3 py-2 rounded-md text-sm"
                        onClick={() => setUserMenuOpen((v) => !v)}
                        aria-label="Open user menu"
                    >
                        <FiUser className="h-5 w-5" />
                        <svg
                            className={`h-4 w-4 transition-transform ${
                                userMenuOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-40 p-2 flex flex-col animate-fade-in">
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-3 py-2 rounded-md transition ${
                                        isActive
                                            ? "text-indigo-500 bg-indigo-50 active"
                                            : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
                                    } text-sm`
                                }
                                onClick={() => setUserMenuOpen(false)}
                            >
                                <FiUser className="h-5 w-5" /> Profile
                            </NavLink>
                            <button
                                type="button"
                                onClick={() => {
                                    setUserMenuOpen(false);
                                    handleLogout();
                                }}
                                className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition font-medium px-3 py-2 rounded-md text-sm"
                                aria-label="Logout"
                            >
                                <FiLogOut className="h-5 w-5" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
