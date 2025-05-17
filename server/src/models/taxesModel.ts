import { WithOptional } from "../config/config";
import { db } from "../config/database";

export interface Tax {
    id: number;
    name: string;
    description: string;
    amount: number;
    createdAt: Date;
}

export const getTaxes = async (): Promise<Tax[]> => {
    const [rows] = await db.query("SELECT * FROM taxes");
    return rows as Tax[];
};

export const getTaxById = async (id: Tax["id"]): Promise<Tax | null> => {
    const [row] = await db.query("SELECT * FROM taxes WHERE id = ?", [id]);
    const taxes = row as Tax[];

    return taxes.length > 0 ? taxes[0] : null;
};

export const insertTax = async (tax: Tax): Promise<boolean> => {
    const { name, description, amount } = tax;

    try {
        await db.query(
            "INSERT INTO taxes (name, description, amount) VALUES (?, ?, ?)",
            [name, description, amount]
        );
        return true;
    } catch (error) {
        console.error("Error inserting tax:", error);
        return false;
    }
};

export const updateTax = async (
    id: Tax["id"],
    tax: Partial<Omit<Tax, "id" | "createdAt">>
): Promise<boolean> => {
    const { name, description, amount } = tax;

    let configs = {
        values: "",
        passed: [] as (string | number)[],
    };
    if (name) {
        configs.values += "name = ?, ";
        configs.passed.push(name);
    }
    if (description) {
        configs.values += "description = ?, ";
        configs.passed.push(description);
    }
    if (amount) {
        configs.values += "amount = ?, ";
        configs.passed.push(amount);
    }

    if (configs.values.length === 0) return false;

    configs.values = configs.values.slice(0, -2); // Remove the last comma and space
    configs.passed.push(id);

    try {
        await db.query(
            `UPDATE taxes SET ${configs.values} WHERE id = ?`,
            configs.passed
        );
        return true;
    } catch (error) {
        console.error("Error updating tax:", error);
        return false;
    }
};

export const deleteTax = async (id: Tax["id"]): Promise<boolean> => {
    try {
        await db.query("DELETE FROM taxes WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Error deleting tax:", error);
        return false;
    }
};
