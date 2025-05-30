// utils/authUtils.ts
import { tokenService } from "../services/api";

/**
 * Check if the user is currently authenticated
 * @returns boolean - true if user has a valid token, false otherwise
 */
export const isAuthenticated = (): boolean => {
    const token = tokenService.getToken();
    return !!token;
};

/**
 * Redirects the user to the login page if not authenticated
 * @param navigate - The navigate function from react-router
 * @returns boolean - true if redirected, false if already authenticated
 */
export const redirectIfUnauthenticated = (
    navigate: (path: string) => void
): boolean => {
    if (!isAuthenticated()) {
        navigate("/login");
        return true;
    }
    return false;
};

/**
 * Redirects the user to the home page if already authenticated
 * @param navigate - The navigate function from react-router
 * @returns boolean - true if redirected, false if not authenticated
 */
export const redirectIfAuthenticated = (
    navigate: (path: string) => void
): boolean => {
    if (isAuthenticated()) {
        navigate("/");
        return true;
    }
    return false;
};
