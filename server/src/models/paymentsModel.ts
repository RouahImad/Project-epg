import { WithOptional } from "../config/config";
import { db } from "../config/database";
import { Payment, PaymentDetails, Tax } from "../types/";

export const getPayments = async (): Promise<PaymentDetails[]> => {
    const [rows] =
        await db.query(`SELECT p.*, s.fullName AS studentName, m.name AS majorName, u.fullName AS handledByUserName
                        FROM payments p
                        JOIN students s ON p.studentId = s.id
                        JOIN majors m ON p.majorId = m.id
                        JOIN users u ON p.handledByUserId = u.id`);

    (rows as Array<PaymentDetails & { taxes: string | Tax[] }>).forEach(
        (row) => {
            if (row.taxes) {
                try {
                    row.taxes = JSON.parse(row.taxes as string) as Tax[];
                } catch (error) {
                    console.error("Error parsing taxes JSON:", error);
                    row.taxes = [];
                }
            } else {
                row.taxes = [];
            }
        }
    );
    return rows as PaymentDetails[];
};

export const getPaymentById = async (
    id: number
): Promise<PaymentDetails | null> => {
    const [row] = await db.query(
        `SELECT p.*, s.fullName AS studentName, m.name AS majorName, u.fullName AS handledByUserName
         FROM payments p
         JOIN students s ON p.studentId = s.id
         JOIN majors m ON p.majorId = m.id
         JOIN users u ON p.handledByUserId = u.id
         WHERE p.id = ?`,
        [id]
    );
    const payments = row as PaymentDetails[];

    return payments.length > 0 ? payments[0] : null;
};

export const getPaymentsByUser = async (
    userId: number
): Promise<PaymentDetails[]> => {
    const [rows] = await db.query(
        `SELECT p.*, s.fullName AS studentName, m.name AS majorName, u.fullName AS handledByUserName
         FROM payments p
            JOIN students s ON p.studentId = s.id
            JOIN majors m ON p.majorId = m.id
            JOIN users u ON p.handledByUserId = u.id
            WHERE p.handledByUserId = ?`,
        [userId]
    );

    (rows as Array<PaymentDetails & { taxes: string | Tax[] }>).forEach(
        (row) => {
            if (row.taxes) {
                try {
                    row.taxes = JSON.parse(row.taxes as string) as Tax[];
                } catch (error) {
                    console.error("Error parsing taxes JSON:", error);
                    row.taxes = [];
                }
            } else {
                row.taxes = [];
            }
        }
    );

    return rows as PaymentDetails[];
};

export const insertPayment = async (
    payment: WithOptional<Payment, "id" | "paidAt"> & {
        taxes: Pick<Tax, "name" | "amount">[];
    }
): Promise<boolean> => {
    const {
        studentId,
        majorId,
        amountPaid,
        remainingAmount,
        taxes,
        handledByUserId,
    } = payment;

    try {
        await db.query(
            "INSERT INTO payments (studentId, majorId, amountPaid, remainingAmount, taxes, handledByUserId) VALUES (?, ?, ?, ?, ?, ?)",
            [
                studentId,
                majorId,
                amountPaid,
                remainingAmount || null,
                taxes.length > 0 ? JSON.stringify(taxes) : null,
                handledByUserId,
            ]
        );
        return true;
    } catch (error) {
        console.error("Error inserting payment:", error);
        return false;
    }
};

export const updatePayment = async (
    id: number,
    payment: Partial<
        Omit<
            Payment,
            "id" | "paidAt" | "studentId" | "majorId" | "handledByUserId"
        >
    >
): Promise<boolean> => {
    const { amountPaid, remainingAmount } = payment;

    if (!amountPaid && remainingAmount === undefined) return false;

    let configs = {
        values: "",
        passed: [] as number[],
    };

    if (amountPaid) {
        configs.values += "amountPaid = ?, ";
        configs.passed.push(amountPaid);
    }
    if (remainingAmount !== undefined) {
        configs.values += "remainingAmount = ?, ";
        configs.passed.push(remainingAmount);
    }

    // Remove the last comma and space
    configs.values = configs.values.slice(0, -2);
    configs.passed.push(id);

    try {
        await db.query(
            `UPDATE payments SET ${configs.values} WHERE id = ?`,
            configs.passed
        );
        return true;
    } catch (error) {
        console.error("Error updating payment:", error);
        return false;
    }
};

export const deletePayment = async (id: number): Promise<boolean> => {
    try {
        await db.query("DELETE FROM payments WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Error deleting payment:", error);
        return false;
    }
};
