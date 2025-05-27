import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";

const router = Router();

/**
 * @route   PATCH /majors/:majorId
 * @desc    Update a major
 * @access  Super Admin Only
 */
router.patch(
    "/:majorId",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const majorId = parseInt(req.params.majorId);
            const { name, majorTypeId, price, duration, description } =
                req.body || {};

            // Validate input
            if (Number.isNaN(majorId)) {
                res.status(400).json({ message: "Invalid major ID" });
                return;
            }

            res.status(200).json({ message: "Major updated successfully" });
        } catch (error) {
            console.error("Update major error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   DELETE /majors/:majorId
 * @desc    Delete a major
 * @access  Super Admin Only
 */
router.delete(
    "/:majorId",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const majorId = parseInt(req.params.majorId);

            // Validate input
            if (Number.isNaN(majorId)) {
                res.status(400).json({ message: "Invalid major ID" });
                return;
            }

            // logic to delete major
            // This would typically call a function like deleteMajor(majorId)

            res.status(200).json({ message: "Major deleted successfully" });
        } catch (error) {
            console.error("Delete major error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
