import { WithOptional } from "../config/config";
import { db } from "../config/database";
import { formatDate } from "../utils/helpers";
import { Major, Student, StudentMajor } from "../types/index";
export const getStudentMajors = async (): Promise<StudentMajor[]> => {
    const [rows] = await db.query("SELECT * FROM studentMajors");
    return rows as StudentMajor[];
};

export const getStudentMajorById = async (
    studentId: Student["id"],
    majorId: Major["id"]
): Promise<StudentMajor | null> => {
    const [row] = await db.query(
        "SELECT * FROM studentMajors WHERE studentId = ? AND majorId = ?",
        [studentId, majorId]
    );
    const studentMajors = row as StudentMajor[];

    return studentMajors.length > 0 ? studentMajors[0] : null;
};

export const insertStudentMajor = async (
    studentMajor: WithOptional<StudentMajor, "enrollmentDate">
): Promise<boolean> => {
    const { studentId, majorId } = studentMajor;
    const enrollmentDate = formatDate(undefined, "YYYY-MM-DD");

    try {
        await db.query(
            "INSERT INTO studentMajors (studentId, majorId, enrollmentDate) VALUES (?, ?, ?)",
            [studentId, majorId, enrollmentDate]
        );
        return true;
    } catch (error) {
        console.error("Error inserting studentMajor:", error);
        return false;
    }
};

export const updateStudentMajor = async (
    studentId: Student["id"],
    majorId: Major["id"],
    studentMajor: Partial<Omit<StudentMajor, "studentId">>
): Promise<boolean> => {
    const { majorId: newMajorId, enrollmentDate } = studentMajor;

    if (!newMajorId && !enrollmentDate) return false;

    let configs = {
        values: "",
        passed: [] as (number | Date)[],
    };

    if (newMajorId && newMajorId !== majorId) {
        configs.values += "majorId = ?, ";
        configs.passed.push(newMajorId);
    }
    if (enrollmentDate) {
        configs.values += "enrollmentDate = ?, ";
        configs.passed.push(enrollmentDate);
    }

    configs.values = configs.values.slice(0, -2); // Remove the last comma and space

    try {
        await db.query(
            `UPDATE studentMajors SET ${configs.values} WHERE studentId = ? AND majorId = ?`,
            [...configs.passed, studentId, majorId]
        );
        return true;
    } catch (error) {
        console.error("Error updating studentMajor:", error);
        return false;
    }
};

export const deleteStudentMajor = async (
    studentId: Student["id"],
    majorId: Major["id"]
): Promise<boolean> => {
    try {
        await db.query(
            "DELETE FROM studentMajors WHERE studentId = ? AND majorId = ?",
            [studentId, majorId]
        );
        return true;
    } catch (error) {
        console.error("Error deleting studentMajor:", error);
        return false;
    }
};
