import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import {
    getStudents,
    getStudentById,
    insertStudent,
    updateStudent,
    deleteStudent,
} from "../models/studentsModel";
import { formatDate, isValidDate } from "../utils/helpers";
import {
    getStudentMajors,
    getStudentMajorById,
    insertStudentMajor,
    updateStudentMajor,
    deleteStudentMajor,
} from "../models/studentMajorsModel";
import { getMajorById } from "../models/majorsModel";

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
    async (req: Request & { user?: any }, res: Response) => {
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
router.patch("/:id", authenticateJWT, async (req: Request, res: Response) => {
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

        // Check if student exists
        const student = await getStudentById(studentId);

        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        // Prepare update data
        const updateData: any = {};
        updateData.id = newId == student.id ? null : newId;
        updateData.fullName = fullName == student.fullName ? null : fullName;
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

        res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
        console.error("Update student error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   DELETE /students/:id
 * @desc    Delete student
 * @access  Super Admin Only
 */
router.delete(
    "/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const studentId = req.params.id;

            // Delete student
            const success = await deleteStudent(studentId);

            if (!success) {
                res.status(400).json({ message: "Failed to delete student" });
                return;
            }

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
            const studentMajors = await getStudentMajors();
            const studentMajorsFiltered = studentMajors.filter(
                (sm) => sm.studentId === studentId
            );

            // Get major details for each enrollment
            const majorDetailsPromises = studentMajorsFiltered.map(
                async (sm) => {
                    const major = await getMajorById(sm.majorId);
                    return {
                        majorId: sm.majorId,
                        majorName: major ? major.name : "Unknown",
                        enrollmentDate: sm.enrollmentDate,
                    };
                }
            );

            const majorsWithDetails = await Promise.all(majorDetailsPromises);

            res.status(200).json(majorsWithDetails);
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
    async (req: Request, res: Response) => {
        try {
            const studentId = req.params.id;
            const { majorId } = req.body || {};

            // Validate input
            if (!studentId || !majorId) {
                res.status(400).json({
                    message: "Student ID and Major ID are required",
                });
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
            });

            if (!success) {
                res.status(400).json({
                    message: "Failed to enroll student in major",
                });
                return;
            }

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
 * @access  Super Admin Only
 */
router.patch(
    "/:id/majors/:majorId",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const studentId = req.params.id;
            const majorId = parseInt(req.params.majorId);
            const { newMajorId, enrollmentDate } = req.body || {};

            // Validate input
            if (!studentId || Number.isNaN(majorId)) {
                res.status(400).json({ message: "Invalid input" });
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

            // Validate new major if provided
            if (newMajorId) {
                const newMajor = await getMajorById(newMajorId);
                if (!newMajor) {
                    res.status(404).json({ message: "New major not found" });
                    return;
                }
            }

            // Update student major
            const success = await updateStudentMajor(studentId, majorId, {
                majorId: newMajorId,
                enrollmentDate: enrollmentDate
                    ? new Date(enrollmentDate)
                    : undefined,
            });

            if (!success) {
                res.status(400).json({
                    message: "Failed to update student major enrollment",
                });
                return;
            }

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
 * @access  Super Admin Only
 */
router.delete(
    "/:id/majors/:majorId",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const studentId = req.params.id;
            const majorId = parseInt(req.params.majorId);

            // Validate input
            if (!studentId || Number.isNaN(majorId)) {
                res.status(400).json({ message: "Invalid input" });
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
