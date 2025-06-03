// hooks/api/useProgramsApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { programTypesApi } from "../../services/api";
import { QueryKeys } from "./types";
import type { MajorType } from "../../types";

/**
 * Hook to get all program types
 */
export const useProgramTypes = () =>
    useQuery({
        queryKey: QueryKeys.programTypes.all,
        queryFn: programTypesApi.getProgramTypes,
    });

/**
 * Hook to create a program type
 */
export const useCreateProgramType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<MajorType>) =>
            programTypesApi.createProgramType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.programTypes.all,
            });
        },
    });
};

/**
 * Hook to update a program type
 */
export const useUpdateProgramType = (programTypeId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<MajorType>) =>
            programTypesApi.updateProgramType(programTypeId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.programTypes.all,
            });
        },
    });
};

/**
 * Hook to delete a program type
 */
export const useDeleteProgramType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (programTypeId: number) =>
            programTypesApi.deleteProgramType(programTypeId),
        onSuccess: (_, programTypeId) => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.programTypes.all,
            });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.programTypes.detail(programTypeId),
            });
        },
    });
};
