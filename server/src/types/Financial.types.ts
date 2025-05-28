// Financial-related types
import { Major } from "./Academic.types";
import { Student, Major as AcademicMajor } from "./Academic.types";
import { User } from "./User.types";

export interface Tax {
    id: number;
    name: string;
    description: string;
    amount: number;
    createdAt: Date;
}

export interface MajorTax {
    majorId: AcademicMajor["id"];
    taxId: Tax["id"];
}

export interface Payment {
    id: number;
    studentId: Student["id"];
    majorId: AcademicMajor["id"];
    amountPaid: number;
    remainingAmount?: number;
    paidAt: Date;
    handledByUserId: User["id"];
}

export interface Receipt {
    id: number;
    paymentId: Payment["id"];
    printedBy: number;
    printedAt: Date;
}
