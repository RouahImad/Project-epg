import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import {
    deleteTax,
    getTaxById,
    getTaxes,
    insertTax,
    updateTax,
} from "../models/taxesModel";

const router = Router();

/**
 * @route   GET /taxes
 * @desc    Get all taxes
 * @access  Super Admin Only
 */
router.get(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const taxes = await getTaxes();

            res.status(200).json(taxes);
        } catch (error) {
            console.error("Get taxes error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   POST /taxes
 * @desc    Add a tax
 * @access  Super Admin Only
 */
router.post(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const { name, description, amount } = req.body || {};

            // Validate input
            if (!name || !amount) {
                res.status(400).json({
                    message: "Tax name and amount are required",
                });
                return;
            }

            const success = await insertTax({
                name,
                description,
                amount: parseFloat(amount),
                createdAt: new Date(),
            });

            if (!success) {
                res.status(400).json({
                    message: "Failed to create tax",
                });
                return;
            }

            res.status(201).json({ message: "Tax created successfully" });
        } catch (error) {
            console.error("Create tax error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   PATCH /taxes/:id
 * @desc    Update tax info
 * @access  Super Admin Only
 */
router.patch(
    "/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const taxId = parseInt(req.params.id);
            const { name, amount, description } = req.body || {};

            // Validate input
            if (Number.isNaN(taxId)) {
                res.status(400).json({ message: "Invalid tax ID" });
                return;
            }

            const tax = await getTaxById(taxId);

            if (!tax) {
                res.status(404).json({ message: "Tax not found" });
                return;
            }

            // Update tax details
            const success = await updateTax(taxId, {
                name,
                amount,
                description,
            });

            if (!success) {
                res.status(400).json({ message: "Failed to update tax" });
                return;
            }

            res.status(200).json({ message: "Tax updated successfully" });
        } catch (error) {
            console.error("Update tax error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   DELETE /taxes/:id
 * @desc    Delete a tax
 * @access  Super Admin Only
 */
router.delete(
    "/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const taxId = parseInt(req.params.id);

            // Validate input
            if (Number.isNaN(taxId)) {
                res.status(400).json({ message: "Invalid tax ID" });
                return;
            }

            const success = await deleteTax(taxId);
            if (!success) {
                res.status(400).json({ message: "Failed to delete tax" });
                return;
            }

            res.status(200).json({ message: "Tax deleted successfully" });
        } catch (error) {
            console.error("Delete tax error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
