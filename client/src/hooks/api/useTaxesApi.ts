// hooks/api/useTaxesApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taxesApi } from "../../services/api";
import { QueryKeys } from "./types";
import type { Tax } from "../../types";

/**
 * Hook to get all taxes
 */
export const useTaxes = () =>
    useQuery({
        queryKey: QueryKeys.taxes.all,
        queryFn: taxesApi.getTaxes,
    });

/**
 * Hook to create a new tax
 */
export const useCreateTax = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taxData: Partial<Tax>) => taxesApi.createTax(taxData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.taxes.all });
        },
    });
};

/**
 * Hook to update a tax
 */
export const useUpdateTax = (taxId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taxData: Partial<Tax>) =>
            taxesApi.updateTax(taxId, taxData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.taxes.all });
        },
    });
};

/**
 * Hook to delete a tax
 */
export const useDeleteTax = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taxId: number) => taxesApi.deleteTax(taxId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.taxes.all });
        },
    });
};
