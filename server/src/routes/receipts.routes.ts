import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import {
    deleteReceipt,
    getReceiptById,
    getReceipts,
    insertReceipt,
} from "../models/receiptsModel";
import { getPaymentById } from "../models/paymentsModel";
import { getStudentById } from "../models/studentsModel";
import { getMajorById } from "../models/majorsModel";
import { getCompanyInfo } from "../models/companyModel";
import { RequestWithUser } from "../types";

const router = Router();

/**
 * @route   GET /receipts
 * @desc    Get all receipts
 * @access  Admin (regular user/staff)
 */
router.get("/", authenticateJWT, async (req: Request, res: Response) => {
    try {
        const receipts = await getReceipts();
        res.status(200).json(receipts);
    } catch (error) {
        console.error("Get receipts error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   POST /receipts
 * @desc    Generate a receipt for a payment
 * @access  Admin (regular user/staff)
 */
router.post(
    "/",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            const { paymentId } = req.body || {};

            // Validate input
            if (!paymentId) {
                res.status(400).json({
                    message: "Payment ID is required",
                });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            // Check if payment exists
            const payment = await getPaymentById(parseInt(paymentId));
            if (!payment) {
                res.status(404).json({ message: "Payment not found" });
                return;
            }

            // Create receipt
            const success = await insertReceipt({
                paymentId: parseInt(paymentId),
                printedBy: req.user.id,
            });

            if (!success) {
                res.status(400).json({ message: "Failed to generate receipt" });
                return;
            }

            res.status(201).json({ message: "Receipt generated successfully" });
        } catch (error) {
            console.error("Generate receipt error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   GET /receipts/:id
 * @desc    Get a single receipt with full details
 * @access  Admin (regular user/staff)
 */
router.get("/:id", authenticateJWT, async (req: Request, res: Response) => {
    try {
        const receiptId = parseInt(req.params.id);

        // Validate input
        if (Number.isNaN(receiptId)) {
            res.status(400).json({ message: "Invalid receipt ID" });
            return;
        }

        const receipt = await getReceiptById(receiptId);
        if (!receipt) {
            res.status(404).json({ message: "Receipt not found" });
            return;
        }

        // Get related data for full receipt
        const payment = await getPaymentById(receipt.paymentId);
        if (!payment) {
            res.status(404).json({ message: "Associated payment not found" });
            return;
        }

        const student = await getStudentById(payment.studentId);
        const major = await getMajorById(payment.majorId);
        const companyInfo = await getCompanyInfo();

        const fullReceipt = {
            receipt,
            payment,
            student,
            major,
            companyInfo,
        };

        res.status(200).json(fullReceipt);
    } catch (error) {
        console.error("Get receipt error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   DELETE /receipts/:id
 * @desc    Delete a receipt
 * @access  Super Admin Only
 */
router.delete(
    "/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const receiptId = parseInt(req.params.id);

            // Validate input
            if (Number.isNaN(receiptId)) {
                res.status(400).json({ message: "Invalid receipt ID" });
                return;
            }

            const success = await deleteReceipt(receiptId);

            if (!success) {
                res.status(400).json({ message: "Failed to delete receipt" });
                return;
            }

            res.status(200).json({ message: "Receipt deleted successfully" });
        } catch (error) {
            console.error("Delete receipt error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
