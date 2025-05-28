import { WithOptional } from "../config/config";
import { db } from "../config/database";
import { Payment } from "../types/index";

export const getPayments = async (): Promise<Payment[]> => {
    const [rows] = await db.query("SELECT * FROM payments");
    return rows as Payment[];
};

export const getPaymentById = async (id: number): Promise<Payment | null> => {
    const [row] = await db.query("SELECT * FROM payments WHERE id = ?", [id]);
    const payments = row as Payment[];

    return payments.length > 0 ? payments[0] : null;
};

export const insertPayment = async (
    payment: WithOptional<Payment, "id" | "paidAt">
): Promise<boolean> => {
    const { studentId, majorId, amountPaid, remainingAmount, handledByUserId } =
        payment;

    try {
        await db.query(
            "INSERT INTO payments (studentId, majorId, amountPaid, remainingAmount, handledByUserId) VALUES (?, ?, ?, ?, ?)",
            [
                studentId,
                majorId,
                amountPaid,
                remainingAmount || null,
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

    if (!amountPaid && !remainingAmount) return false;

    let configs = {
        values: "",
        passed: [] as number[],
    };

    if (amountPaid) {
        configs.values += "amountPaid = ?, ";
        configs.passed.push(amountPaid);
    }
    if (remainingAmount) {
        configs.values += "remainingAmount = ?, ";
        configs.passed.push(remainingAmount);
    }

    // Remove the last comma and space
    configs.values = configs.values.slice(0, -2);

    try {
        await db.query(`UPDATE payments SET ${configs.values} WHERE id = ?`, [
            ...configs.passed,
            id,
        ]);
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
