import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import {
    getStudents,
    getStudentById,
    insertStudent,
    updateStudent,
    deleteStudent,
} from "../models/studentsModel";

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
        const studentId = parseInt(req.params.id);

        // Validate input
        if (Number.isNaN(studentId)) {
            res.status(400).json({ message: "Invalid student ID" });
            return;
        }

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
        const studentId = parseInt(req.params.id);
        const {
            id: newId,
            fullName,
            email,
            phone,
            address,
            dateOfBirth,
        } = req.body || {};

        // Validate input
        if (Number.isNaN(studentId)) {
            res.status(400).json({ message: "Invalid student ID" });
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
        if (newId) updateData.id = newId;
        if (fullName) updateData.fullName = fullName;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);

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
            const studentId = parseInt(req.params.id);

            // Validate input
            if (Number.isNaN(studentId)) {
                res.status(400).json({ message: "Invalid student ID" });
                return;
            }

            // Check if student exists
            const student = await getStudentById(studentId);

            if (!student) {
                res.status(404).json({ message: "Student not found" });
                return;
            }

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
            const studentId = parseInt(req.params.id);

            // Validate input
            if (Number.isNaN(studentId)) {
                res.status(400).json({ message: "Invalid student ID" });
                return;
            }

            // logic to get student majors history
            // This would typically call a function like getStudentMajors(studentId)

            res.status(200).json({ message: "Student major history" });
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
            const studentId = parseInt(req.params.id);
            const { majorId, year } = req.body || {};

            // Validate input
            if (Number.isNaN(studentId) || !majorId || !year) {
                res.status(400).json({ message: "Invalid input" });
                return;
            }

            // logic to add student major
            // This would typically call a function like addStudentMajor(studentId, majorId, year)

            res.status(201).json({ message: "Major enrollment added" });
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
    "/:id/majors/:historyId",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const studentId = parseInt(req.params.id);
            const historyId = parseInt(req.params.historyId);
            const { majorId, year } = req.body || {};

            // Validate input
            if (Number.isNaN(studentId) || Number.isNaN(historyId)) {
                res.status(400).json({ message: "Invalid input" });
                return;
            }

            // logic to update student major history
            // This would typically call a function like updateStudentMajor(historyId, { majorId, year })

            res.status(200).json({ message: "Major enrollment updated" });
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
    "/:id/majors/:historyId",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const studentId = parseInt(req.params.id);
            const historyId = parseInt(req.params.historyId);

            // Validate input
            if (Number.isNaN(studentId) || Number.isNaN(historyId)) {
                res.status(400).json({ message: "Invalid input" });
                return;
            }

            // logic to delete student major history
            // This would typically call a function like deleteStudentMajor(historyId)

            res.status(200).json({ message: "Major enrollment deleted" });
        } catch (error) {
            console.error("Delete student major error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
