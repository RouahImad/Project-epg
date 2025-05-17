import { WithOptional } from "../config/config";
import { db } from "../config/database";

import { User } from "./usersModel";

export interface Student {
    id: number;
    fullName: string;
    cin: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: Date;
    createdBy: User["id"];
    createdAt: Date;
}

export const getStudents = async (): Promise<Student[]> => {
    const [rows] = await db.query("SELECT * FROM students");
    return rows as Student[];
};

export const getStudentById = async (id: number): Promise<Student | null> => {
    const [row] = await db.query("SELECT * FROM students WHERE id = ?", [id]);
    const students = row as Student[];

    return students.length > 0 ? students[0] : null;
};

export const insertStudent = async (
    student: WithOptional<Student, "id" | "createdAt">
): Promise<boolean> => {
    const { fullName, cin, email, phone, address, dateOfBirth, createdBy } =
        student;

    try {
        await db.query(
            "INSERT INTO students (fullName, cin, email, phone, address, dateOfBirth, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [fullName, cin, email, phone, address, dateOfBirth, createdBy]
        );
        return true;
    } catch (error) {
        console.error("Error inserting student:", error);
        return false;
    }
};

export const updateStudent = async (
    id: number,
    student: Partial<Omit<Student, "id" | "createdAt" | "createdBy">>
): Promise<boolean> => {
    const { fullName, cin, email, phone, address, dateOfBirth } = student;

    if (!fullName && !cin && !email && !phone && !address && !dateOfBirth)
        return false;

    let configs = {
        values: "",
        passed: [] as (string | boolean | Date)[],
    };
    if (fullName) {
        configs.values += "fullName = ?, ";
        configs.passed.push(fullName);
    }
    if (cin) {
        configs.values += "cin = ?, ";
        configs.passed.push(cin);
    }
    if (email) {
        configs.values += "email = ?, ";
        configs.passed.push(email);
    }
    if (phone) {
        configs.values += "phone = ?, ";
        configs.passed.push(phone);
    }
    if (address) {
        configs.values += "address = ?, ";
        configs.passed.push(address);
    }
    if (dateOfBirth) {
        configs.values += "dateOfBirth = ?, ";
        configs.passed.push(dateOfBirth);
    }

    // Remove the last comma and space
    configs.values = configs.values.slice(0, -2);

    try {
        await db.query(`UPDATE students SET ${configs.values} WHERE id = ?`, [
            ...configs.passed,
            id,
        ]);
        return true;
    } catch (error) {
        console.error("Error updating student:", error);
        return false;
    }
};

export const deleteStudent = async (id: number): Promise<boolean> => {
    try {
        await db.query("DELETE FROM students WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Error deleting student:", error);
        return false;
    }
};
