import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { majorsApi } from "../../services/api";
import { QueryKeys } from "./types";
import type { Major } from "../../types";

/**
 * Hook to get all majors
 */

export const useMajors = () =>
    useQuery({
        queryKey: QueryKeys.majors.all,
        queryFn: majorsApi.getMajors,
    });

/**
 * Hook to get majors by type
 */

export const useMajor = (majorId: number) =>
    useQuery({
        queryKey: QueryKeys.majors.detail(majorId),
        queryFn: () => majorsApi.getMajorById(majorId),
        enabled: !!majorId,
    });

/**
 * Hook to get majors grouped by type
 */

export const useMajorsGroupedByType = () =>
    useQuery({
        queryKey: QueryKeys.majors.grouped(),
        queryFn: majorsApi.getMajorsGroupedByType,
    });

/**
 * Hook to get majors by type
 */
export const useCreateMajor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Major>) => majorsApi.createMajor(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.majors.all });
        },
    });
};

/**
 * Hook to update a major
 */

export const useUpdateMajor = (majorId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Major>) =>
            majorsApi.updateMajor(majorId, data),
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
export const useAddTaxToMajor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taxId, majorId }: { taxId: number; majorId: number }) =>
            majorsApi.addTaxToMajor(majorId, taxId),
        onSuccess: (_, { majorId }) => {
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
export const useRemoveTaxFromMajor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taxId, majorId }: { taxId: number; majorId: number }) =>
            majorsApi.removeTaxFromMajor(majorId, taxId),
        onSuccess: (_, { majorId }) => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.majors.taxes(majorId),
            });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.majors.detail(majorId),
            });
        },
    });
};
