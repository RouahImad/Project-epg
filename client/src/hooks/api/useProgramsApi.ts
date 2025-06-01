// hooks/api/useProgramsApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { majorsApi, programTypesApi } from "../../services/api";
import { QueryKeys } from "./types";
import type { MajorType } from "../../types";

/**
 * Hook to get taxes for a major
 */
export const useMajorTaxes = (majorId: number) =>
    useQuery({
        queryKey: QueryKeys.majors.taxes(majorId),
        queryFn: () => majorsApi.getTaxesForMajor(majorId),
        enabled: !!majorId,
    });

/**
 * Hook to add a tax to a major
 */
export const useAddTaxToMajor = (majorId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taxId: number) => majorsApi.addTaxToMajor(majorId, taxId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.majors.taxes(majorId),
            });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.majors.detail(majorId),
            });
        },
    });
};

/**
 * Hook to remove a tax from a major
 */
export const useRemoveTaxFromMajor = (majorId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taxId: number) =>
            majorsApi.removeTaxFromMajor(majorId, taxId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.majors.taxes(majorId),
            });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.majors.detail(majorId),
            });
        },
    });
};

// ==================== PROGRAM TYPES HOOKS ====================
/**
 * Hook to get all program types
 */
export const useProgramTypes = () =>
    useQuery({
        queryKey: QueryKeys.programTypes.all,
        queryFn: programTypesApi.getProgramTypes,
    });

/**
 * Hook to get majors by program type
 */
export const useMajorsByProgramType = (programTypeId: number) =>
    useQuery({
        queryKey: QueryKeys.programTypes.majors(programTypeId),
        queryFn: () => programTypesApi.getMajorsByProgramType(programTypeId),
        enabled: !!programTypeId,
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
