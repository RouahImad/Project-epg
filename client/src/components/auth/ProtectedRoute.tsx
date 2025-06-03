// components/auth/ProtectedRoute.tsx
import { Suspense } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useCurrentUser } from "../../hooks/api/";
import { isAuthenticated } from "../../utils/authUtils";
import { useAuth } from "../../contexts/AuthContext";
import NavBar from "../NavBar";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
    showNavbar?: boolean;
}

const ProtectedRoute = ({
    children,
    allowedRoles = [],
    showNavbar = true,
}: ProtectedRouteProps) => {
    const { isLoading } = useCurrentUser();
    const { userRole, isAuthenticated: authContextAuthenticated } = useAuth();

    const userIsAuthenticated = isAuthenticated() && authContextAuthenticated; // Show loading state when checking authentication status

    if (
        userIsAuthenticated &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(userRole)
    ) {
        return <Navigate to="/forbidden" replace />;
    }

    // Redirect if not authenticated
    if (!userIsAuthenticated && !isLoading) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated and authorized, render children with optional navbar
    return (
        <>
            {showNavbar && <NavBar />}
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                }
            >
                {children}
            </Suspense>
        </>
    );
};

export default ProtectedRoute;
