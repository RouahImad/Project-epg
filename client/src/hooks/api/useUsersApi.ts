// hooks/api/useUsersApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../../services/api";
import { QueryKeys } from "./types";
import type { User } from "../../types";

/**
 * Hook to get all users
 */
export const useUsers = () =>
    useQuery({
        queryKey: QueryKeys.users.all,
        queryFn: usersApi.getUsers,
    });

/**
 * Hook to get a single user by ID
 */
export const useUser = (userId: number) =>
    useQuery({
        queryKey: QueryKeys.users.detail(userId),
        queryFn: () => usersApi.getUserById(userId),
        enabled: !!userId,
    });

/**
 * Hook to create a new user
 */
export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData: Partial<User>) => usersApi.createUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.all });
        },
    });
};

/**
 * Hook to update a user
 */
export const useUpdateUser = (userId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userData: Partial<User>) =>
            usersApi.updateUser(userId, userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.all });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.users.detail(userId),
            });
        },
    });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => usersApi.deleteUser(userId),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.all });
            queryClient.removeQueries({
                queryKey: QueryKeys.users.detail(userId),
            });
        },
    });
};
