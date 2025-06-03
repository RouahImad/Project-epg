// Financial-related types
import type { Student, Major } from "./Academic.types";
import type { User } from "./User.types";

export interface Tax {
    id: number;
    name: string;
    description: string;
    amount: number;
    createdAt: Date;
}

export interface MajorTax {
    majorId: Major["id"];
    taxId: Tax["id"];
}

export interface Payment {
    id: number;
    studentId: Student["id"];
    majorId: Major["id"];
    amountPaid: number;
    remainingAmount?: number;
    taxes?: Pick<Tax, "name" | "amount">[] | undefined;
    paidAt: Date;
    handledByUserId: User["id"];
}

export interface PaymentDetails extends Payment {
    studentName: string;
    majorName: string;
    handledByUserName: string;
}

export interface Receipt {
    id: number;
    paymentId: Payment["id"];
    printedBy: number;
    printedAt: Date;
}
