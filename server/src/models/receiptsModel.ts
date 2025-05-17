import { WithOptional } from "../config/config";
import { db } from "../config/database";

import { Payment } from "./paymentsModel";

export interface Receipt {
    id: number;
    paymentId: Payment["id"];
    userId: number;
    printedAt: Date;
}

export const getReceipts = async (): Promise<Receipt[]> => {
    const [rows] = await db.query("SELECT * FROM receipts");
    return rows as Receipt[];
};

export const getReceiptById = async (
    id: Receipt["id"]
): Promise<Receipt | null> => {
    const [row] = await db.query("SELECT * FROM receipts WHERE id = ?", [id]);
    const receipts = row as Receipt[];

    return receipts.length > 0 ? receipts[0] : null;
};

export const insertReceipt = async (
    receipt: WithOptional<Receipt, "id" | "printedAt">
): Promise<boolean> => {
    const { paymentId, userId } = receipt;

    try {
        await db.query(
            "INSERT INTO receipts (paymentId, userId, printedAt) VALUES (?, ?, ?)",
            [paymentId, userId, new Date()]
        );
        return true;
    } catch (error) {
        console.error("Error inserting receipt:", error);
        return false;
    }
};

export const deleteReceipt = async (id: Receipt["id"]): Promise<boolean> => {
    try {
        await db.query("DELETE FROM receipts WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Error deleting receipt:", error);
        return false;
    }
};
