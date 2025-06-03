import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Login from "../components/auth/Login";
import NotFound from "../utils/NotFound";
import Forbidden from "../utils/Forbidden";
import ErrorBoundary from "../components/common/ErrorBoundary";
import LoadingPage from "../components/common/LoadingPage";

// Lazy-loaded components
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const StudentsList = lazy(() => import("../pages/students/StudentsList"));
const StudentDetails = lazy(() => import("../pages/students/StudentDetails"));
const Payments = lazy(() => import("../pages/admin/Payments"));
const AdminUsers = lazy(() => import("../pages/admin/Users"));
const AdminCompany = lazy(() => import("../pages/admin/Company"));
const AdminPrograms = lazy(() => import("../pages/admin/Programs"));
const AdminLogs = lazy(() => import("../pages/admin/Logs"));
const AdminTaxes = lazy(() => import("../pages/admin/Taxes"));

const AppRoutes = () => {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Routes>
                    {/* Auth routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Navigate to="/dashboard" replace />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <ErrorBoundary>
                                    <Suspense fallback={<LoadingPage />}>
                                        <Dashboard />
                                    </Suspense>
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ErrorBoundary>
                                    <Suspense fallback={<LoadingPage />}>
                                        <Profile />
                                    </Suspense>
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    {/* Student routes */}
                    <Route
                        path="/students"
                        element={
                            <ProtectedRoute>
                                <ErrorBoundary>
                                    <Suspense fallback={<LoadingPage />}>
                                        <StudentsList />
                                    </Suspense>
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/students/:id"
                        element={
                            <ProtectedRoute>
                                <ErrorBoundary>
                                    <Suspense fallback={<LoadingPage />}>
                                        <StudentDetails />
                                    </Suspense>
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    {/* Payment routes */}
                    <Route
                        path="/payments"
                        element={
                            <ProtectedRoute>
                                <ErrorBoundary>
                                    <Suspense fallback={<LoadingPage />}>
                                        <Payments />
                                    </Suspense>
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin routes - require super_admin role */}
                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute allowedRoles={["super_admin"]}>
                                <ErrorBoundary>
                                    <Suspense fallback={<LoadingPage />}>
                                        <AdminUsers />
                                    </Suspense>
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/company"
                        element={
                            <ProtectedRoute allowedRoles={["super_admin"]}>
                                <ErrorBoundary>
                                    <Suspense fallback={<LoadingPage />}>
                                        <AdminCompany />
                                    </Suspense>
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/programs"
                        element={
                            <ProtectedRoute allowedRoles={["super_admin"]}>
                                <ErrorBoundary>
                                    <Suspense fallback={<LoadingPage />}>
                                        <AdminPrograms />
                                    </Suspense>
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/logs"
                        element={
                            <ProtectedRoute allowedRoles={["super_admin"]}>
                                <ErrorBoundary>
                                    <Suspense fallback={<LoadingPage />}>
                                        <AdminLogs />
                                    </Suspense>
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/taxes"
                        element={
                            <ProtectedRoute allowedRoles={["super_admin"]}>
                                <ErrorBoundary>
                                    <Suspense fallback={<LoadingPage />}>
                                        <AdminTaxes />
                                    </Suspense>
                                </ErrorBoundary>
                            </ProtectedRoute>
                        }
                    />

                    {/* Error pages */}
                    <Route path="/forbidden" element={<Forbidden />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

export default AppRoutes;
