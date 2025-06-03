import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentsApi } from "../../services/api";
import { QueryKeys } from "./types";
import type { Payment } from "../../types";

/**
 * Hook to get all payments.
 */
export const usePayments = () =>
    useQuery({
        queryKey: [QueryKeys.payments.all],
        queryFn: paymentsApi.getPayments,
    });

/**
 * Hook to get payments for a specific user.
 */
export const usePaymentsByUser = (userId: number) =>
    useQuery({
        queryKey: [QueryKeys.payments.byUser, userId],
        queryFn: () => paymentsApi.getPaymentsByUser(userId),
        enabled: !!userId,
    });

/**
 * Hook to get payments for a specific student.
 */
export const usePaymentsByStudent = (studentId: string) =>
    useQuery({
        queryKey: [QueryKeys.payments.all, studentId],
        queryFn: async () => {
            const allPayments = await paymentsApi.getPayments();
            // Filter payments for this student
            return allPayments.filter((p) => p.studentId === studentId);
        },
        enabled: !!studentId,
    }); // warning

/**
 * Hook to create a new payment.
 */
export const useCreatePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (paymentData: Partial<Payment>) =>
            paymentsApi.createPayment(paymentData),
        onSuccess: () => {
            // Invalidate the payments query to refresh the list
            queryClient.invalidateQueries({ queryKey: QueryKeys.payments.all });
            queryClient.refetchQueries({
                queryKey: [QueryKeys.payments.all],
            });
        },
    });
};

/**
 * Hook to update an existing payment.
 */
export const useUpdatePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, amountPaid }: Pick<Payment, "amountPaid" | "id">) =>
            paymentsApi.updatePayment(id, amountPaid),
        onSuccess: () => {
            // Invalidate the payments query to refresh the list
            queryClient.invalidateQueries({ queryKey: QueryKeys.payments.all });
            queryClient.refetchQueries({
                queryKey: [QueryKeys.payments.all],
            });
        },
    });
};
