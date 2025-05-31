import { useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../../services/api";
import { QueryKeys } from "./types";

export const usePaymentsByStudent = (studentId: string) =>
    useQuery({
        queryKey: [QueryKeys.payments.all, studentId],
        queryFn: async () => {
            const allPayments = await paymentsApi.getPayments();
            // Filter payments for this student
            return allPayments.filter((p) => p.studentId === studentId);
        },
        enabled: !!studentId,
    });

export const usePayments = () =>
    useQuery({
        queryKey: [QueryKeys.payments.all],
        queryFn: paymentsApi.getPayments,
    });
