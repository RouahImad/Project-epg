import { Router, Request, Response } from "express";
import { authenticateJWT } from "../middlewares/auth";
import { getReceipts, insertReceipt } from "../models/receiptsModel";
import { getPaymentById } from "../models/paymentsModel";
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

export default router;
