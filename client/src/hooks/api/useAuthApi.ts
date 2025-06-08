// hooks/api/useAuthApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, tokenService } from "../../services/api";
import { QueryKeys } from "./types";

/**
 * Hook for user login
 */
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            if (data.token) {
                tokenService.setToken(data.token);
            }
            if (data.user) {
                queryClient.setQueryData(QueryKeys.auth.currentUser, data.user);
            }
            queryClient.invalidateQueries({
                queryKey: QueryKeys.auth.currentUser,
            });
        },
        onError: (error) => {
            console.error("Login error in mutation:", error);
        },
    });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            tokenService.removeToken();
            queryClient.setQueryData(QueryKeys.auth.currentUser, null);
            queryClient.clear();
        },
    });
};

/**
 * Hook to get the current user profile
 */
export const useCurrentUser = () =>
    useQuery({
        queryKey: QueryKeys.auth.currentUser,
        queryFn: authApi.getCurrentUser,
        retry: 1,
        retryDelay: 1000,
        enabled: !!tokenService.getToken(),
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        refetchOnWindowFocus: true, // Refresh when window gets focus
        refetchOnMount: true, // Refresh when component mounts
    });

/**
 * Hook to update the user profile
 */
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.auth.currentUser,
            });
            queryClient.refetchQueries({
                queryKey: QueryKeys.auth.currentUser,
            });
        },
    });
};
