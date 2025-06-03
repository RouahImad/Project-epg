import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import {
    getStudents,
    getStudentById,
    insertStudent,
    updateStudent,
    deleteStudent,
} from "../models/studentsModel";
import { formatDate, isValidDate, AddActivity } from "../utils/helpers";
import { ACTIVITY_ACTIONS } from "../types/User.types";
import {
    getStudentMajorById,
    insertStudentMajor,
    updateStudentMajor,
    deleteStudentMajor,
} from "../models/studentMajorsModel";
import { getMajorById } from "../models/majorsModel";
import { RequestWithUser } from "../types";

const router = Router();

/**
 * @route   GET /students
 * @desc    Get all students
 * @access  Admin (regular user/staff)
 */
router.get("/", authenticateJWT, async (req: Request, res: Response) => {
    try {
        const students = await getStudents();
        res.status(200).json(students);
    } catch (error) {
        console.error("Get students error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   POST /students
 * @desc    Create student (basic info only)
 * @access  Admin (regular user/staff)
 */
router.post(
    "/",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            const { id, fullName, email, phone, address, dateOfBirth } =
                req.body || {};

            // Validate input
            if (!id || !fullName || !email) {
                res.status(400).json({
                    message: "Required fields are missing",
                });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            const newStudent = {
                id,
                fullName,
                email,
                phone,
                address,
                dateOfBirth: new Date(dateOfBirth),
                createdBy: req.user.id,
            };

            const success = await insertStudent(newStudent);

            if (!success) {
                res.status(400).json({ message: "Failed to create student" });
                return;
            }

            // Log activity
            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.CREATE_STUDENT,
                entityType: "student",
                entityId: id,
                details: `Created student ${fullName}`,
            });

            res.status(201).json({ message: "Student created successfully" });
        } catch (error) {
            console.error("Create student error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   GET /students/:id
 * @desc    Get single student profile
 * @access  Admin (regular user/staff)
 */
router.get("/:id", authenticateJWT, async (req: Request, res: Response) => {
    try {
        const studentId = req.params.id;
        const student = await getStudentById(studentId);

        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Get student error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   PATCH /students/:id
 * @desc    Update student info
 * @access  Admin (regular user/staff)
 */
router.patch(
    "/:id",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            const studentId = req.params.id;
            const {
                id: newId,
                fullName,
                email,
                phone,
                address,
                dateOfBirth,
            } = req.body || {};

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            // Check if student exists
            const student = await getStudentById(studentId);

            if (!student) {
                res.status(404).json({ message: "Student not found" });
                return;
            }
            // Prepare update data
            const updateData: any = {};
            updateData.id = newId == student.id ? null : newId;
            updateData.fullName =
                fullName == student.fullName ? null : fullName;
            updateData.email = email == student.email ? null : email;
            updateData.phone = phone == student.phone ? null : phone;
            updateData.address = address == student.address ? null : address;
            if (dateOfBirth)
                updateData.dateOfBirth =
                    dateOfBirth && isValidDate(dateOfBirth)
                        ? formatDate(dateOfBirth, "YYYY-MM-DD")
                        : null;

            // Update student
            const success = await updateStudent(studentId, updateData);

            if (!success) {
                res.status(400).json({ message: "Failed to update student" });
                return;
            }

            // Log activity
            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.UPDATE_STUDENT,
                entityType: "student",
                entityId: studentId,
                details: `Updated student #${studentId}`,
            });

            res.status(200).json({ message: "Student updated successfully" });
        } catch (error) {
            console.error("Update student error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   DELETE /students/:id
 * @desc    Delete student
 * @access  Super Admin Only
 */
router.delete(
    "/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: RequestWithUser, res: Response) => {
        try {
            const studentId = req.params.id;

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            // Delete student
            const success = await deleteStudent(studentId);

            if (!success) {
                res.status(400).json({ message: "Failed to delete student" });
                return;
            }

            // Log activity
            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.DELETE_STUDENT,
                entityType: "student",
                entityId: studentId,
                details: `Deleted student #${studentId}`,
            });

            res.status(200).json({ message: "Student deleted successfully" });
        } catch (error) {
            console.error("Delete student error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * Student majors routes
 */

/**
 * @route   GET /students/:id/majors
 * @desc    Get student's major history
 * @access  Admin (regular user/staff)
 */
router.get(
    "/:id/majors",
    authenticateJWT,
    async (req: Request, res: Response) => {
        try {
            const studentId = req.params.id;

            // Validate input
            if (!studentId) {
                res.status(400).json({ message: "Invalid student ID" });
                return;
            }

            // Check if student exists
            const student = await getStudentById(studentId);
            if (!student) {
                res.status(404).json({ message: "Student not found" });
                return;
            }

            // Get student majors
            const studentMajors = await getStudentMajorById(studentId);

            if (!studentMajors || studentMajors.length === 0) {
                res.status(404).json({
                    message: "No majors found for this student",
                });
                return;
            }

            const formattedMajors = studentMajors.map((major) => ({
                ...major,
                enrollmentDate: formatDate(major.enrollmentDate, "YYYY-MM-DD"),
            }));

            res.status(200).json(formattedMajors);
        } catch (error) {
            console.error("Get student majors error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   POST /students/:id/majors
 * @desc    Add new major enrollment for this student
 * @access  Admin (regular user/staff)
 */
router.post(
    "/:id/majors",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            const studentId = req.params.id;
            const { majorId, userId } = req.body || {};

            // Validate input
            if (!studentId || !majorId) {
                res.status(400).json({
                    message: "Student ID and Major ID are required",
                });
                return;
            }

            // Validate userId if provided
            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            // Check if student exists
            const student = await getStudentById(studentId);
            if (!student) {
                res.status(404).json({ message: "Student not found" });
                return;
            }

            // Check if major exists
            const major = await getMajorById(majorId);
            if (!major) {
                res.status(404).json({ message: "Major not found" });
                return;
            }

            // Check if student is already enrolled in this major
            const existingEnrollment = await getStudentMajorById(
                studentId,
                majorId
            );
            if (existingEnrollment) {
                res.status(400).json({
                    message: "Student is already enrolled in this major",
                });
                return;
            }

            // Add student to major
            const success = await insertStudentMajor({
                studentId,
                majorId,
                enrolledBy: req.user.id || userId,
            });

            if (!success) {
                res.status(400).json({
                    message: "Failed to enroll student in major",
                });
                return;
            }

            // Log activity
            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.ASSIGN_MAJOR,
                entityType: "major",
                entityId: majorId,
                details: `Assigned major ${major.name} to student #${studentId}`,
            });

            res.status(201).json({
                message: "Student enrolled in major successfully",
            });
        } catch (error) {
            console.error("Add student major error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   PATCH /students/:id/majors/:historyId
 * @desc    Update a specific year-major record
 * @access  Admin (regular user/staff)
 */
router.patch(
    "/:id/majors/:majorId",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            const studentId = req.params.id;
            const majorId = parseInt(req.params.majorId);
            const { enrollmentDate } = req.body || {};

            // Validate input
            if (!studentId || Number.isNaN(majorId)) {
                res.status(400).json({ message: "Invalid input" });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            const enrollment = await getStudentMajorById(studentId, majorId);
            if (!enrollment) {
                res.status(404).json({
                    message: "Student is not enrolled in this major",
                });
                return;
            }

            // Validate enrollment date if provided
            if (enrollmentDate && !isValidDate(enrollmentDate)) {
                res.status(400).json({
                    message: "Invalid enrollment date format",
                });
                return;
            }

            // Update student major
            const success = await updateStudentMajor(studentId, majorId, {
                enrollmentDate: new Date(enrollmentDate),
            });

            if (!success) {
                res.status(400).json({
                    message: "Failed to update student major enrollment",
                });
                return;
            }

            // Log activity
            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.UPDATE_STUDENT,
                entityType: "major",
                entityId: majorId,
                details: `Updated enrollment for student #${studentId}, major #${majorId}`,
            });

            res.status(200).json({
                message: "Student major enrollment updated successfully",
            });
        } catch (error) {
            console.error("Update student major error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   DELETE /students/:id/majors/:historyId
 * @desc    Delete major enrollment record
 * @access  Admin
 */
router.delete(
    "/:id/majors/:majorId",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            const studentId = req.params.id;
            const majorId = parseInt(req.params.majorId);

            // Validate input
            if (!studentId || Number.isNaN(majorId)) {
                res.status(400).json({ message: "Invalid input" });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            // Check if student-major relationship exists
            const enrollment = await getStudentMajorById(studentId, majorId);
            if (!enrollment) {
                res.status(404).json({
                    message: "Student is not enrolled in this major",
                });
                return;
            }

            // Delete student major
            const success = await deleteStudentMajor(studentId, majorId);

            if (!success) {
                res.status(400).json({
                    message: "Failed to delete student major enrollment",
                });
                return;
            }

            // Log activity
            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.REMOVE_MAJOR,
                entityType: "major",
                entityId: majorId,
                details: `Removed major #${majorId} from student #${studentId}`,
            });

            res.status(200).json({
                message: "Student major enrollment deleted successfully",
            });
        } catch (error) {
            console.error("Delete student major error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
