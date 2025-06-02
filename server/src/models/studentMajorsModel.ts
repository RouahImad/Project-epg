import { WithOptional } from "../config/config";
import { db } from "../config/database";
import { formatDate } from "../utils/helpers";
import { Major, Student, StudentMajor, StudentMajorDetails } from "../types/";

export const getStudentMajors = async (): Promise<StudentMajorDetails[]> => {
    const [rows] = await db.query(
        `SELECT sm.*, majors.name as majorName, users.fullName AS enrollerName
        FROM studentMajors sm 
        JOIN majors ON sm.majorId = majors.id
        JOIN users ON sm.enrolledBy = users.id`
    );
    return rows as StudentMajorDetails[];
};

export const getStudentMajorById = async (
    studentId: Student["id"],
    majorId?: Major["id"]
): Promise<StudentMajorDetails[] | null> => {
    let configs = {
        values: "studentId = ?",
        passed: [studentId] as (number | string)[],
    };
    if (majorId) {
        configs.values += " AND majorId = ?";
        configs.passed.push(majorId);
    }
    const [row] = await db.query(
        `SELECT sm.*, majors.name as majorName, users.fullName AS enrollerName
        FROM studentMajors sm
            JOIN majors ON sm.majorId = majors.id
            JOIN users ON sm.enrolledBy = users.id
        WHERE ${configs.values}`,
        configs.passed
    );
    const studentMajors = row as StudentMajorDetails[];

    return studentMajors.length > 0 ? studentMajors : null;
};

export const insertStudentMajor = async (
    studentMajor: WithOptional<StudentMajor, "enrollmentDate">
): Promise<boolean> => {
    const { studentId, majorId, enrolledBy } = studentMajor;
    const enrollmentDate = formatDate(undefined, "YYYY-MM-DD");

    try {
        await db.query(
            "INSERT INTO studentMajors (studentId, majorId, enrolledBy, enrollmentDate) VALUES (?, ?, ?, ?)",
            [studentId, majorId, enrolledBy, enrollmentDate]
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
    studentMajor: Omit<StudentMajor, "studentId" | "majorId" | "enrolledBy">
): Promise<boolean> => {
    const { enrollmentDate } = studentMajor;

    try {
        await db.query(
            `UPDATE studentMajors 
            SET enrollmentDate = ?
            WHERE studentId = ? AND majorId = ?`,
            [enrollmentDate, studentId, majorId]
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
