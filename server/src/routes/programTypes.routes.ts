import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import {
    deleteMajorType,
    getMajorTypes,
    insertMajorType,
    updateMajorType,
} from "../models/majorTypesModel";
import { getMajorsByTypeId, insertMajor } from "../models/majorsModel";
import { db } from "../config/database";

const router = Router();

/**
 * @route   GET /program-types
 * @desc    List all education program types
 * @access  Super Admin Only
 */
router.get(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const programs = await getMajorTypes();
            res.status(200).json(programs);
        } catch (error) {
            console.error("Get program types error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   POST /program-types
 * @desc    Add a new education program type
 * @access  Super Admin Only
 */
router.post(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body || {};

            // Validate input
            if (!name) {
                res.status(400).json({
                    message: "Program type name is required",
                });
                return;
            }

            const success = await insertMajorType({ name, description });
            if (!success) {
                res.status(400).json({
                    message: "Failed to create program type",
                });
                return;
            }

            res.status(201).json({
                message: "Program type created successfully",
            });
        } catch (error) {
            console.error("Create program type error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   PATCH /program-types/:id
 * @desc    Update program type
 * @access  Super Admin Only
 */
router.patch(
    "/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const programTypeId = parseInt(req.params.id);
            const { name, description } = req.body || {};

            // Validate input
            if (Number.isNaN(programTypeId)) {
                res.status(400).json({ message: "Invalid program type ID" });
                return;
            }

            if (!name && !description) {
                res.status(400).json({
                    message: "At least one field is required",
                });
                return;
            }
            

            const success = await updateMajorType(programTypeId, {
                name,
                description,
            });

            if (!success) {
                res.status(400).json({
                    message: "Failed to update program type",
                });
                return;
            }

            res.status(200).json({
                message: "Program type updated successfully",
            });
        } catch (error) {
            console.error("Update program type error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   DELETE /program-types/:id
 * @desc    Delete program type
 * @access  Super Admin Only
 */
router.delete(
    "/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const programTypeId = parseInt(req.params.id);

            // Validate input
            if (Number.isNaN(programTypeId)) {
                res.status(400).json({ message: "Invalid program type ID" });
                return;
            }

            const success = await deleteMajorType(programTypeId);

            if (!success) {
                res.status(400).json({
                    message: "Failed to delete program type",
                });
                return;
            }

            res.status(200).json({
                message: "Program type deleted successfully",
            });
        } catch (error) {
            console.error("Delete program type error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   GET /program-types/:id/majors
 * @desc    Get all majors for a program type
 * @access  Super Admin Only
 */
router.get(
    "/:id/majors",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const programTypeId = parseInt(req.params.id);

            // Validate input
            if (Number.isNaN(programTypeId)) {
                res.status(400).json({ message: "Invalid program type ID" });
                return;
            }

            const majors = await getMajorsByTypeId(programTypeId);

            if (!majors || majors.length === 0) {
                res.status(404).json({
                    message: "No majors found for this program type",
                });
                return;
            }
            res.status(200).json(majors);
        } catch (error) {
            console.error("Get majors for program type error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   GET /program-types/:id
 * @desc    Get details of a specific program type
 * @access  Super Admin Only
 * continue here
 */
// router.get(
//     "/:id",
//     authenticateJWT,
//     checkRole("super_admin"),
//     async (req: Request, res: Response) => {
//         try {
//             const programTypeId = parseInt(req.params.id);

//             // Validate input
//             if (Number.isNaN(programTypeId)) {
//                 res.status(400).json({ message: "Invalid program type ID" });
//                 return;
//             }

//             // Get the program type data
//             // Assuming there's a getMajorTypeById function in the model
//             const [rows] = await db.query(
//                 "SELECT * FROM majorTypes WHERE id = ?",
//                 [programTypeId]
//             );
//             const programTypes = rows as any[];

//             if (!programTypes || programTypes.length === 0) {
//                 res.status(404).json({ message: "Program type not found" });
//                 return;
//             }

//             const programType = programTypes[0];

//             // Get all majors under this program type
//             const majors = await getMajorsByTypeId(programTypeId);

//             // Return combined data
//             res.status(200).json({
//                 programType,
//                 majors,
//             });
//         } catch (error) {
//             console.error("Get program type error:", error);
//             res.status(500).json({ message: "Server error" });
//         }
//     }
// );

export default router;
