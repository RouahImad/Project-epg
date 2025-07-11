import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import {
    deleteMajor,
    getMajorById,
    getMajors,
    getMajorsGroupedByType,
    insertMajor,
    updateMajor,
} from "../models/majorsModel";
import {
    deleteMajorTax,
    getMajorTaxesByMajorId,
    insertMajorTax,
} from "../models/majorTaxesModel";
import { getTaxById } from "../models/taxesModel";
import { getMajorTypeById } from "../models/majorTypesModel";
import { RequestWithUser } from "../types";
import { AddActivity } from "../utils/helpers";
import { ACTIVITY_ACTIONS } from "../types/User.types";

const router = Router();

/**
 * @route   GET /majors
 * @desc    Get all majors
 * @access  Admin (regular user/staff)
 */
router.get("/", authenticateJWT, async (req: Request, res: Response) => {
    try {
        const majors = await getMajors();
        res.status(200).json(majors);
    } catch (error) {
        console.error("Get majors error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /majors/grouped
 * @desc    Get majors grouped by type
 * @access  Admin (regular user/staff)
 */

router.get("/grouped", authenticateJWT, async (req: Request, res: Response) => {
    try {
        const majors = await getMajorsGroupedByType();

        res.status(200).json(majors);
    } catch (error) {
        console.error("Get grouped majors error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   POST /majors
 * @desc    Create a new major
 * @access  Super Admin Only
 */

router.post(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: RequestWithUser, res: Response) => {
        try {
            const { name, majorTypeId, price, duration, description } =
                req.body || {};

            // Validate input
            if (!name || !majorTypeId || !price || !duration) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }

            if (isNaN(price)) {
                res.status(400).json({
                    message: "Price and duration must be numbers",
                });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            // Check if major type exists
            const majorType = await getMajorTypeById(majorTypeId);
            if (!majorType) {
                res.status(404).json({ message: "Major type not found" });
                return;
            }

            const success = await insertMajor({
                name,
                majorTypeId,
                price,
                duration,
                description,
            });

            if (!success) {
                res.status(400).json({ message: "Failed to create major" });
                return;
            }

            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.CREATE_MAJOR,
                entityType: "major",
                entityId: majorTypeId,
                details: `Created major: ${name} under type ${majorType.name}`,
            });

            res.status(201).json({
                message: "Major created successfully",
            });
        } catch (error) {
            console.error("Create major error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   PATCH /majors/:majorId
 * @desc    Update a major
 * @access  Super Admin Only
 */
router.patch(
    "/:majorId",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: RequestWithUser, res: Response) => {
        try {
            const majorId = parseInt(req.params.majorId);
            const { name, majorTypeId, price, duration, description } =
                req.body || {};

            // Validate input
            if (Number.isNaN(majorId)) {
                res.status(400).json({ message: "Invalid major ID" });
                return;
            }

            if (!name || !majorTypeId || !price || !duration) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }

            if (isNaN(price)) {
                res.status(400).json({
                    message: "Price and duration must be numbers",
                });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            const success = await updateMajor(majorId, {
                name,
                majorTypeId,
                price,
                duration,
                description,
            });

            if (!success) {
                res.status(400).json({ message: "Failed to update major" });
                return;
            }

            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.UPDATE_MAJOR,
                entityType: "major",
                entityId: majorId,
                details: `Updated major with ID #${majorId}`,
            });

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
    async (req: RequestWithUser, res: Response) => {
        try {
            const majorId = parseInt(req.params.majorId);

            // Validate input
            if (Number.isNaN(majorId)) {
                res.status(400).json({ message: "Invalid major ID" });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            const success = await deleteMajor(majorId);

            if (!success) {
                res.status(400).json({ message: "Failed to delete major" });
                return;
            }

            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.DELETE_MAJOR,
                entityType: "major",
                entityId: majorId,
                details: `Deleted major with ID #${majorId}`,
            });

            res.status(200).json({ message: "Major deleted successfully" });
        } catch (error) {
            console.error("Delete major error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * Tax routes for majors
 */

/**
 * @route   GET /majors/:majorId/taxes
 * @desc    Get taxes for a major
 * @access  Admin
 */
router.get(
    "/:majorId/taxes",
    authenticateJWT,
    async (req: Request, res: Response) => {
        try {
            const majorId = parseInt(req.params.majorId);

            // Validate input
            if (Number.isNaN(majorId)) {
                res.status(400).json({ message: "Invalid major ID" });
                return;
            }

            // Check if major exists
            const major = await getMajorById(majorId);
            if (!major) {
                res.status(404).json({ message: "Major not found" });
                return;
            }

            // Get major taxes
            const majorTaxes = await getMajorTaxesByMajorId(majorId);

            // Get tax details for each major tax
            const taxPromises = majorTaxes.map((majorTax) =>
                getTaxById(majorTax.taxId)
            );

            const taxes = await Promise.all(taxPromises);

            res.status(200).json(taxes.filter((tax) => tax !== null));
        } catch (error) {
            console.error("Get major taxes error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   POST /majors/:majorId/taxes
 * @desc    Add a tax to a major
 * @access  Super Admin Only
 */
router.post(
    "/:majorId/taxes",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: RequestWithUser, res: Response) => {
        try {
            const majorId = parseInt(req.params.majorId);
            const { taxId } = req.body || {};

            // Validate input
            if (Number.isNaN(majorId) || !taxId) {
                res.status(400).json({ message: "Invalid input" });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            // Check if major exists
            const major = await getMajorById(majorId);
            if (!major) {
                res.status(404).json({ message: "Major not found" });
                return;
            }

            // Check if tax exists
            const tax = await getTaxById(taxId);
            if (!tax) {
                res.status(404).json({ message: "Tax not found" });
                return;
            }

            // Add tax to major
            const success = await insertMajorTax({ majorId, taxId });

            if (!success) {
                res.status(400).json({ message: "Failed to add tax to major" });
                return;
            }

            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.ASSIGNED_TAX,
                entityType: "major",
                entityId: majorId,
                details: `Added tax ${tax.name} to major ${major.name}`,
            });

            res.status(201).json({
                message: "Tax added to major successfully",
            });
        } catch (error) {
            console.error("Add tax to major error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   DELETE /majors/:majorId/taxes/:taxId
 * @desc    Remove a tax from a major
 * @access  Super Admin Only
 */
router.delete(
    "/:majorId/taxes/:taxId",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: RequestWithUser, res: Response) => {
        try {
            const majorId = parseInt(req.params.majorId);
            const taxId = parseInt(req.params.taxId);

            // Validate input
            if (Number.isNaN(majorId) || Number.isNaN(taxId)) {
                res.status(400).json({ message: "Invalid input" });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            // Delete tax from major
            const success = await deleteMajorTax(majorId, taxId);

            if (!success) {
                res.status(400).json({
                    message: "Failed to remove tax from major",
                });
                return;
            }

            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.REMOVED_TAX,
                entityType: "major",
                entityId: majorId,
                details: `Removed tax with #${taxId} from major #${majorId}`,
            });

            res.status(200).json({
                message: "Tax removed from major successfully",
            });
        } catch (error) {
            console.error("Remove tax from major error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
