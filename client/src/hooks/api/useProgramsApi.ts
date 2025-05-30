// hooks/api/useProgramsApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { majorsApi, programTypesApi } from "../../services/api";
import { QueryKeys } from "./types";
import type { Major, MajorType } from "../../types";

// ==================== MAJORS HOOKS ====================
/**
 * Hook to get all majors
 */
export const useMajors = () =>
    useQuery({
        queryKey: QueryKeys.majors.all,
        queryFn: majorsApi.getMajors,
    });

/**
 * Hook to get a single major by ID
 */
export const useMajor = (majorId: number) =>
    useQuery({
        queryKey: QueryKeys.majors.detail(majorId),
        queryFn: () => majorsApi.getMajorById(majorId),
        enabled: !!majorId,
    });

/**
 * Hook to update a major
 */
export const useUpdateMajor = (majorId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (majorData: Partial<Major>) =>
            majorsApi.updateMajor(majorId, majorData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.majors.all });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.majors.detail(majorId),
            });
        },
    });
};

/**
 * Hook to delete a major
 */
export const useDeleteMajor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (majorId: number) => majorsApi.deleteMajor(majorId),
        onSuccess: (_, majorId) => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.majors.all });
            queryClient.removeQueries({
                queryKey: QueryKeys.majors.detail(majorId),
            });
        },
    });
};

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

/**
 * Hook to add a major to a program type
 */
export const useAddMajorToProgramType = (programTypeId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (majorData: Partial<Major>) =>
            programTypesApi.addMajorToProgramType(programTypeId, majorData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.programTypes.majors(programTypeId),
            });
            queryClient.invalidateQueries({ queryKey: QueryKeys.majors.all });
        },
    });
};
