import { WithOptional } from "../config/config";
import { db } from "../config/database";
import { Student, User } from "../types/";

export const getStudents = async (): Promise<Student[]> => {
    const [rows] = await db.query("SELECT * FROM students");
    return rows as Student[];
};

export const getStudentById = async (id: string): Promise<Student | null> => {
    const [row] = await db.query("SELECT * FROM students WHERE id = ?", [id]);
    const students = row as Student[];

    return students.length > 0 ? students[0] : null;
};

export const getStudentsByUserId = async (
    userId: User["id"]
): Promise<Student[]> => {
    const [rows] = await db.query(
        "SELECT * FROM students WHERE createdBy = ?",
        [userId]
    );
    return rows as Student[];
};

export const insertStudent = async (
    student: WithOptional<Student, "createdAt">
): Promise<boolean> => {
    const { id, fullName, email, phone, address, dateOfBirth, createdBy } =
        student;

    try {
        await db.query(
            "INSERT INTO students (id, fullName, email, phone, address, dateOfBirth, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [id, fullName, email, phone, address, dateOfBirth, createdBy]
        );
        return true;
    } catch (error) {
        console.error("Error inserting student:", error);
        return false;
    }
};

export const updateStudent = async (
    id: string,
    student: Partial<Omit<Student, "createdAt" | "createdBy">>
): Promise<boolean> => {
    const { id: newId, fullName, email, phone, address, dateOfBirth } = student;

    if (!newId && !fullName && !email && !phone && !address && !dateOfBirth)
        return false;

    let configs = {
        values: "",
        passed: [] as (string | boolean | Date)[],
    };
    if (newId) {
        configs.values += "id = ?, ";
        configs.passed.push(newId);
    }
    if (fullName) {
        configs.values += "fullName = ?, ";
        configs.passed.push(fullName);
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

export const deleteStudent = async (id: string): Promise<boolean> => {
    try {
        await db.query("DELETE FROM students WHERE id = ?", [id]);
        return true;
    } catch (error) {
        console.error("Error deleting student:", error);
        return false;
    }
};
