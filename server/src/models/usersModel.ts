import { WithOptional } from "../config/config";
import { db } from "../config/database";

export interface User {
    id: number;
    fullName: string;
    email: string;
    password: string;
    role: "admin" | "super_admin";
    createdAt: Date;
    banned: boolean;
}

export const getUsers = async (): Promise<User[]> => {
    const [rows] = await db.query("SELECT * FROM users");
    return rows as User[];
};
export const getUserById = async (id: number): Promise<User | null> => {
    const [row] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    const users = row as User[];

    return users.length > 0 ? users[0] : null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const [row] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
    ]);
    const users = row as User[];

    return users.length > 0 ? users[0] : null;
};

export const insertUser = async (
    user: WithOptional<User, "id" | "banned" | "createdAt">
): Promise<boolean> => {
    const { fullName, email, password, role, banned } = user;

    try {
        await db.query(
            "INSERT INTO users (fullName, email, password, role, banned) VALUES (?, ?, ?, ?, ?)",
            [fullName, email, password, role, banned || false]
        );
        return true;
    } catch (error) {
        console.error("Error inserting user:", error);
        return false;
    }
};

export const updateUser = async (
    id: number,
    user: Partial<Omit<User, "id" | "createdAt">>
): Promise<boolean> => {
    const { fullName, email, password, role, banned } = user;

    if (!fullName && !email && !password && !role && banned === undefined)
        return false;

    let configs = {
        values: "",
        passed: [] as (string | boolean)[],
    };
    if (fullName) {
        configs.values += "fullName = ?, ";
        configs.passed.push(fullName);
    }
    if (email) {
        configs.values += "email = ?, ";
        configs.passed.push(email);
    }
    if (password) {
        configs.values += "password = ?, ";
        configs.passed.push(password);
    }
    if (role) {
        configs.values += "role = ?, ";
        configs.passed.push(role);
    }
    if (banned !== undefined) {
        configs.values += "banned = ?, ";
        configs.passed.push(banned);
    }
    configs.values = configs.values.slice(0, -2); // Remove the last comma and space

    try {
        await db.query(`UPDATE users SET ${configs.values} WHERE id = ?`, [
            ...configs.passed,
            id,
        ]);
        return true;
    } catch (error) {
        console.error("Error updating user:", error);
        return false;
    }
};

export const deleteUser = async (id: number): Promise<boolean> => {
    try {
        await db.query("DELETE FROM users WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
};

export const updateBanStatus = async (
    id: number,
    ban: boolean
): Promise<boolean> => {
    try {
        await db.query("UPDATE users SET banned = ? WHERE id = ?", [ban, id]);
        return true;
    } catch (error) {
        console.error("Error banning user:", error);
        return false;
    }
};
