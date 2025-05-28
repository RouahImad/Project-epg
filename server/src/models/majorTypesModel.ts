import { WithOptional } from "../config/config";
import { db } from "../config/database";
import { MajorType } from "../types/index";

export const getMajorTypes = async (): Promise<MajorType[]> => {
    const [rows] = await db.query("SELECT * FROM major_types");
    return rows as MajorType[];
};

export const getMajorTypeById = async (
    id: number
): Promise<MajorType | null> => {
    const [row] = await db.query("SELECT * FROM major_types WHERE id = ?", [
        id,
    ]);
    const majorTypes = row as MajorType[];

    return majorTypes.length > 0 ? majorTypes[0] : null;
};

export const insertMajorType = async (
    majorType: WithOptional<MajorType, "id">
): Promise<boolean> => {
    const { name, description } = majorType;

    try {
        await db.query(
            "INSERT INTO major_types (name, description) VALUES (?, ?)",
            [name, description]
        );
        return true;
    } catch (error) {
        console.error("Error inserting major type:", error);
        return false;
    }
};

export const updateMajorType = async (
    id: number,
    majorType: Partial<Omit<MajorType, "id">>
): Promise<boolean> => {
    const { name, description } = majorType;

    if (!name && !description) return false;

    let configs = {
        values: "",
        passed: [] as (string | boolean)[],
    };
    if (name) {
        configs.values += "name = ?, ";
        configs.passed.push(name);
    }
    if (description) {
        configs.values += "description = ?, ";
        configs.passed.push(description);
    }

    configs.values = configs.values.slice(0, -2); // Remove the last comma and space

    try {
        await db.query(
            `UPDATE major_types SET ${configs.values} WHERE id = ?`,
            [...configs.passed, id]
        );
        return true;
    } catch (error) {
        console.error("Error updating major type:", error);
        return false;
    }
};

export const deleteMajorType = async (id: number): Promise<boolean> => {
    try {
        await db.query("DELETE FROM major_types WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Error deleting major type:", error);
        return false;
    }
};
