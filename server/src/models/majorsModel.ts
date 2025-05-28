import { WithOptional } from "../config/config";
import { db } from "../config/database";
import { Major, MajorType } from "../types/index";

export const getMajors = async (): Promise<Major[]> => {
    const [rows] = await db.query("SELECT * FROM majors");
    return rows as Major[];
};

export const getMajorsByTypeId = async (
    majorTypeId: MajorType["id"]
): Promise<Major[]> => {
    const [rows] = await db.query(
        "SELECT * FROM majors WHERE majorTypeId = ?",
        [majorTypeId]
    );
    return rows as Major[];
};

export const getMajorById = async (id: number): Promise<Major | null> => {
    const [row] = await db.query("SELECT * FROM majors WHERE id = ?", [id]);
    const majors = row as Major[];

    return majors.length > 0 ? majors[0] : null;
};

export const insertMajor = async (
    major: WithOptional<Major, "id" | "createdAt" | "description" | "duration">
): Promise<boolean> => {
    const { name, majorTypeId, price, duration, description } = major;

    try {
        await db.query(
            "INSERT INTO majors (name, majorTypeId, price, duration, description) VALUES (?, ?, ?, ?, ?)",
            [name, majorTypeId, price, duration || null, description || null]
        );
        return true;
    } catch (error) {
        console.error("Error inserting major:", error);
        return false;
    }
};

export const updateMajor = async (
    id: number,
    major: Partial<Omit<Major, "id" | "createdAt">>
): Promise<boolean> => {
    const { name, majorTypeId, price, duration, description } = major;

    if (!name && !majorTypeId && !price && !duration && !description)
        return false;

    let configs = {
        values: "",
        passed: [] as (string | boolean | number)[],
    };
    if (name) {
        configs.values += "name = ?, ";
        configs.passed.push(name);
    }
    if (majorTypeId) {
        configs.values += "majorTypeId = ?, ";
        configs.passed.push(majorTypeId);
    }
    if (price) {
        configs.values += "price = ?, ";
        configs.passed.push(price);
    }
    if (duration) {
        configs.values += "duration = ?, ";
        configs.passed.push(duration);
    }
    if (description) {
        configs.values += "description = ?, ";
        configs.passed.push(description);
    }

    // Remove the last comma and space
    configs.values = configs.values.slice(0, -2);

    try {
        await db.query(`UPDATE majors SET ${configs.values} WHERE id = ?`, [
            ...configs.passed,
            id,
        ]);
        return true;
    } catch (error) {
        console.error("Error updating major:", error);
        return false;
    }
};

export const deleteMajor = async (id: number): Promise<boolean> => {
    try {
        await db.query("DELETE FROM majors WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Error deleting major:", error);
        return false;
    }
};
