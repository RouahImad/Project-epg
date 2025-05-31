import { useRef, useEffect, useState, useCallback } from "react";
import {
    FiLogOut,
    FiUser,
    FiHome,
    FiUsers,
    FiSettings,
    FiBriefcase,
    FiBookOpen,
    FiFileText,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useLogout } from "../hooks/api/useAuthApi";

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
        // Handle closing admin menu on outside click
        if (!adminMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            // Desktop admin menu
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

    // Keyboard accessibility for desktop admin menu
    useEffect(() => {
        if (!adminMenuOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setAdminMenuOpen(false);
            if (
                (event.key === "Enter" || event.key === " ") &&
                document.activeElement === adminMenuRef.current
            ) {
                setAdminMenuOpen((v) => !v);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [adminMenuOpen]);

    // Handle closing user menu on outside click (mobile)
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

    // Admin links grouped for reuse
    const adminLinks = (
        <>
            <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition px-3 py-2 rounded-md ${
                        isActive
                            ? "text-indigo-500 bg-indigo-50 active"
                            : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
                    } text-sm md:text-base`
                }
                onClick={() => setAdminMenuOpen(false)}
            >
                <FiSettings className="h-4 w-4 md:h-5 md:w-5" /> Users
            </NavLink>
            <NavLink
                to="/admin/company"
                className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition px-3 py-2 rounded-md ${
                        isActive
                            ? "text-indigo-500 bg-indigo-50 active"
                            : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
                    } text-sm md:text-base`
                }
                onClick={() => setAdminMenuOpen(false)}
            >
                <FiBriefcase className="h-4 w-4 md:h-5 md:w-5" /> Company
            </NavLink>
            <NavLink
                to="/admin/programs"
                className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition px-3 py-2 rounded-md ${
                        isActive
                            ? "text-indigo-500 bg-indigo-50 active"
                            : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
                    } text-sm md:text-base`
                }
                onClick={() => setAdminMenuOpen(false)}
            >
                <FiBookOpen className="h-4 w-4 md:h-5 md:w-5" /> Programs
            </NavLink>
            <NavLink
                to="/admin/logs"
                className={({ isActive }) =>
                    `flex items-center gap-2 font-medium transition px-3 py-2 rounded-md ${
                        isActive
                            ? "text-indigo-500 bg-indigo-50 active"
                            : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
                    } text-sm md:text-base`
                }
                onClick={() => setAdminMenuOpen(false)}
            >
                <FiFileText className="h-4 w-4 md:h-5 md:w-5" /> Logs
            </NavLink>
        </>
    );

    return (
        <nav className="w-full bg-white shadow-md px-2 md:px-4 py-2 md:py-3 flex items-center justify-between relative text-sm md:text-base">
            <div className="flex items-center gap-1 md:gap-2">
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-1.5 md:gap-2 font-medium transition ${
                            isActive
                                ? "text-indigo-500 active font-bold"
                                : "text-gray-700 hover:text-indigo-700"
                        } text-sm md:text-base px-2 md:px-3 py-1.5 md:py-2`
                    }
                >
                    <FiHome className="h-4 w-4 md:h-5 md:w-5" /> Dashboard
                </NavLink>
                <NavLink
                    to="/students"
                    className={({ isActive }) =>
                        `flex items-center gap-1.5 md:gap-2 font-medium transition ${
                            isActive
                                ? "text-indigo-500 active font-bold"
                                : "text-gray-700 hover:text-indigo-700"
                        } text-sm md:text-base px-2 md:px-3 py-1.5 md:py-2`
                    }
                >
                    <FiUsers className="h-4 w-4 md:h-5 md:w-5" /> Students
                </NavLink>
                {/* SUPER_ADMIN ONLY: Unified Mega Menu for all screens */}
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
                            className="flex items-center gap-2 font-medium text-gray-700 hover:text-indigo-900 transition px-3 py-2 rounded-md focus:outline-none"
                            aria-haspopup="true"
                            aria-expanded={adminMenuOpen}
                            tabIndex={-1}
                        >
                            <FiSettings className="h-4 w-4 md:h-5 md:w-5" />{" "}
                            Admin
                        </button>
                        {adminMenuOpen && (
                            <div className="absolute -left-13 md:left-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-30 p-3 grid grid-cols-2 gap-2 animate-fade-in">
                                {adminLinks}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3 md:gap-5">
                {/* Desktop: show Profile and Logout separately */}
                <div className="hidden md:flex items-center gap-5">
                    {user && (
                        <NavLink
                            to="/profile"
                            className={({ isActive }) =>
                                `flex items-center gap-1.5 md:gap-2 text-gray-700 transition ${
                                    isActive
                                        ? "text-indigo-500 active font-bold"
                                        : "hover:text-indigo-700"
                                } text-sm md:text-base px-2 md:px-3 py-1.5 md:py-2`
                            }
                        >
                            <FiUser className="h-4 w-4 md:h-5 md:w-5" /> Profile
                        </NavLink>
                    )}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 md:gap-2 text-red-500 hover:text-red-700 transition font-medium text-sm md:text-base px-2 md:px-3 py-1.5 md:py-2"
                        aria-label="Logout"
                    >
                        <FiLogOut className="h-4 w-4 md:h-5 md:w-5" /> Logout
                    </button>
                </div>
                {/* Mobile: group Profile and Logout in a submenu */}
                <div className="md:hidden relative" ref={userMenuRef}>
                    <button
                        type="button"
                        className="flex items-center gap-1.5 text-gray-700 hover:text-indigo-900 transition px-2 py-1.5 rounded-md text-sm"
                        onClick={() => setUserMenuOpen((v) => !v)}
                        aria-label="Open user menu"
                    >
                        <FiUser className="h-4.5 w-4.5" />
                        {/* <span className="font-medium">Account</span> */}
                        <svg
                            className={`h-3 w-3 transition-transform ${
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
                        <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg z-40 p-2 flex flex-col animate-fade-in text-sm">
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `flex items-center gap-1.5 px-2 py-1.5 rounded-md transition ${
                                        isActive
                                            ? "text-indigo-500 bg-indigo-50 active"
                                            : "text-gray-700 hover:text-indigo-900 hover:bg-indigo-50"
                                    }`
                                }
                                onClick={() => setUserMenuOpen(false)}
                            >
                                <FiUser className="h-4 w-4" /> Profile
                            </NavLink>
                            <button
                                type="button"
                                onClick={() => {
                                    setUserMenuOpen(false);
                                    handleLogout();
                                }}
                                className="flex items-center gap-1.5 text-red-500 hover:text-red-700 transition font-medium px-2 py-1.5 rounded-md"
                                aria-label="Logout"
                            >
                                <FiLogOut className="h-4 w-4" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
