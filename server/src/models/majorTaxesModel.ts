import { WithOptional } from "../config/config";
import { db } from "../config/database";

import { Major } from "./majorsModel";
import { Tax } from "./taxesModel";

export interface MajorTax {
    majorId: Major["id"];
    taxId: Tax["id"];
}

export const getMajorTaxes = async (): Promise<MajorTax[]> => {
    const [rows] = await db.query("SELECT * FROM major_taxes");
    return rows as MajorTax[];
};

export const getMajorTaxById = async (
    majorId: Major["id"],
    taxId: Tax["id"]
): Promise<MajorTax | null> => {
    const [row] = await db.query(
        "SELECT * FROM major_taxes WHERE majorId = ? AND taxId = ?",
        [majorId, taxId]
    );
    const majorTaxes = row as MajorTax[];

    return majorTaxes.length > 0 ? majorTaxes[0] : null;
};

export const insertMajorTax = async (majorTax: MajorTax): Promise<boolean> => {
    const { majorId, taxId } = majorTax;

    try {
        await db.query(
            "INSERT INTO major_taxes (majorId, taxId) VALUES (?, ?)",
            [majorId, taxId]
        );
        return true;
    } catch (error) {
        console.error("Error inserting major tax:", error);
        return false;
    }
};

export const updateMajorTax = async (
    majorId: Major["id"],
    taxId: Tax["id"],
    majorTax: Partial<MajorTax>
): Promise<boolean> => {
    const { majorId: newMajorId, taxId: newTaxId } = majorTax;

    if (!newMajorId && !newTaxId) return false;

    let configs = {
        values: "",
        passed: [] as number[],
    };
    if (newMajorId) {
        configs.values += "majorId = ?, ";
        configs.passed.push(newMajorId);
    }
    if (newTaxId) {
        configs.values += "taxId = ?, ";
        configs.passed.push(newTaxId);
    }

    configs.values = configs.values.slice(0, -2); // Remove the last comma and space

    try {
        await db.query(
            `UPDATE major_taxes SET ${configs.values} WHERE majorId = ? AND taxId = ?`,
            [...configs.passed, majorId, taxId]
        );
        return true;
    } catch (error) {
        console.error("Error updating major tax:", error);
        return false;
    }
};

export const deleteMajorTax = async (
    majorId: Major["id"],
    taxId: Tax["id"]
): Promise<boolean> => {
    try {
        await db.query(
            "DELETE FROM major_taxes WHERE majorId = ? AND taxId = ?",
            [majorId, taxId]
        );
        return true;
    } catch (error) {
        console.error("Error deleting major tax:", error);
        return false;
    }
};
