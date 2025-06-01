import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { majorsApi } from "../../services/api";
import { QueryKeys } from "./types";
import type { Major } from "../../types";

export const useMajors = () =>
    useQuery({
        queryKey: QueryKeys.majors.all,
        queryFn: majorsApi.getMajors,
    });

export const useMajor = (majorId: number) =>
    useQuery({
        queryKey: QueryKeys.majors.detail(majorId),
        queryFn: () => majorsApi.getMajorById(majorId),
        enabled: !!majorId,
    });

export const useMajorsGroupedByType = () =>
    useQuery({
        queryKey: QueryKeys.majors.grouped(),
        queryFn: majorsApi.getMajorsGroupedByType,
    });

export const useCreateMajor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Major>) => majorsApi.createMajor(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.majors.all });
        },
    });
};

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
