import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { lazy } from "react";
import { useAuth } from "../contexts/AuthContext";
import Login from "../components/auth/Login";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const ROUTE_GROUPS = {
    COMMON: ["admin", "super_admin"],
    SUPER_ADMIN_ONLY: ["super_admin"],
};

// Lazy-loaded components with optimized grouping
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));

// Student Management
const Students = lazy(() => import("../pages/students/StudentsList"));
const StudentDetails = lazy(() => import("../pages/students/StudentDetails"));

// Payment Management
const Payments = lazy(() => import("../pages/Payments"));

// Admin section
const Users = lazy(() => import("../pages/admin/Users"));
const Company = lazy(() => import("../pages/admin/Company"));
const Programs = lazy(() => import("../pages/admin/Programs"));
const Logs = lazy(() => import("../pages/admin/Logs"));
const Taxes = lazy(() => import("../pages/admin/Taxes"));

// Error/utility pages
const Forbidden = lazy(() => import("../utils/Forbidden"));
const NotFound = lazy(() => import("../utils/NotFound"));

const AppRoutes = () => {
    const { isAuthenticated, userRole } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                {/* 🔐 AUTH FLOW */}
                <Route path="/login" element={<Login />} />
                <Route path="/forbidden" element={<Forbidden />} />
                {/* 🧭 MAIN ROUTES */}
                {/* Redirect root based on role */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={
                                userRole === "super_admin"
                                    ? "/dashboard"
                                    : "/students"
                            }
                            replace
                        />
                    }
                />
                {/* 📊 Dashboard - primarily for super admins */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={ROUTE_GROUPS.COMMON}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                {/* 🎓 Students Management */}
                <Route
                    path="/students"
                    element={
                        <ProtectedRoute allowedRoles={ROUTE_GROUPS.COMMON}>
                            <Students />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/students/:id"
                    element={
                        <ProtectedRoute allowedRoles={ROUTE_GROUPS.COMMON}>
                            <StudentDetails />
                        </ProtectedRoute>
                    }
                />
                {/* 💸 Payments */}
                <Route
                    path="/payments"
                    element={
                        <ProtectedRoute allowedRoles={ROUTE_GROUPS.COMMON}>
                            <Payments />
                        </ProtectedRoute>
                    }
                />
                {/* 👑 ADMIN-ONLY ROUTES */}
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute
                            allowedRoles={ROUTE_GROUPS.SUPER_ADMIN_ONLY}
                        >
                            <Users />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/company"
                    element={
                        <ProtectedRoute
                            allowedRoles={ROUTE_GROUPS.SUPER_ADMIN_ONLY}
                        >
                            <Company />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/programs"
                    element={
                        <ProtectedRoute
                            allowedRoles={ROUTE_GROUPS.SUPER_ADMIN_ONLY}
                        >
                            <Programs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/logs"
                    element={
                        <ProtectedRoute
                            allowedRoles={ROUTE_GROUPS.SUPER_ADMIN_ONLY}
                        >
                            <Logs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/taxes"
                    element={
                        <ProtectedRoute
                            allowedRoles={ROUTE_GROUPS.SUPER_ADMIN_ONLY}
                        >
                            <Taxes />
                        </ProtectedRoute>
                    }
                />
                {/* 🙍‍♂️ Profile */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute allowedRoles={ROUTE_GROUPS.COMMON}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                {/* 🔐 ERROR/REDIRECT ROUTES */}
                <Route path="/404" element={<NotFound />} />
                <Route
                    path="*"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/404" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
