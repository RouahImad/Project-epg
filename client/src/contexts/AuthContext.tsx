import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { tokenService } from "../services/api";
import { useCurrentUser } from "../hooks/api/useAuthApi";
import type { User } from "../types/index";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    userRole: string;
    isLoading: boolean;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authReady, setAuthReady] = useState(false);

    // Determine if we should attempt to fetch the current user
    const hasToken = Boolean(tokenService.getToken());

    // Store user role in localStorage for persistence
    const storedRole = localStorage.getItem("userRole") || "";

    // Get the current user with React Query
    const { data: currentUser, isLoading, isError, refetch } = useCurrentUser();

    // On initial load, check for token and try to fetch user
    useEffect(() => {
        const initializeAuth = async () => {
            if (hasToken && !user) {
                try {
                    await refetch();
                } catch (error) {
                    // Clear invalid token
                    tokenService.removeToken();
                    localStorage.removeItem("userRole");
                } finally {
                    setAuthReady(true);
                }
            } else {
                setAuthReady(true);
            }
        };

        initializeAuth();
    }, []);

    // Update user state when the query resolves
    useEffect(() => {
        if (!isLoading) {
            if (!isError && currentUser) {
                setUser(currentUser);
                if (currentUser.role) {
                    localStorage.setItem("userRole", currentUser.role);
                }
            } else if (isError) {
                tokenService.removeToken();
                localStorage.removeItem("userRole");
                setUser(null);
            }
        }
    }, [currentUser, isLoading, isError]);

    // For authentication state, use both the user object and token presence
    const isAuthenticated = Boolean(user) || (hasToken && !isError);

    const allowedRoles: User["role"][] = ["admin", "super_admin"];

    const userRole: User["role"] =
        user?.role ||
        (allowedRoles.includes(storedRole as User["role"])
            ? (storedRole as User["role"])
            : "admin");

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                userRole,
                isLoading: isLoading || !authReady,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};

export default AuthContext;
