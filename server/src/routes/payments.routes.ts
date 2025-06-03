import { Router, Request, Response } from "express";
import { authenticateJWT } from "../middlewares/auth";
import {
    getPaymentById,
    getPayments,
    getPaymentsByUser,
    insertPayment,
    updatePayment,
} from "../models/paymentsModel";
import { getMajorTaxesByMajorId } from "../models/majorTaxesModel";
import { getTaxById } from "../models/taxesModel";
import { getMajorById } from "../models/majorsModel";
import { RequestWithUser, Tax } from "../types/";
import { AddActivity } from "../utils/helpers";
import { ACTIVITY_ACTIONS } from "../types/User.types";

const router = Router();

/**
 * @route   GET /payments
 * @desc    Get all payments
 * @access  Admin (regular user/staff)
 */

router.get("/", authenticateJWT, async (req: Request, res: Response) => {
    try {
        // logic to get payments
        const payments = await getPayments();
        if (!payments || payments.length === 0) {
            res.status(404).json({ message: "No payments found" });
            return;
        }

        res.status(200).json(payments);
    } catch (error) {
        console.error("Get payments error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /payments/user/:id
 * @desc    Get payments recorded by user
 * @access  Admin (regular user/staff)
 */

router.get(
    "/user/:id",
    authenticateJWT,
    async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.id);

            // Validate input
            if (Number.isNaN(userId)) {
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }

            // logic to get payments by staff
            const payments = await getPaymentsByUser(userId);
            if (!payments || payments.length === 0) {
                res.status(404).json({
                    message: "No payments found for this user",
                });
                return;
            }

            res.status(200).json(payments);
        } catch (error) {
            console.error("Get staff payments error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   POST /payments
 * @desc    Add a payment for a student
 * @access  Admin (regular user/staff)
 */
router.post(
    "/",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            const { studentId, majorId, amountPaid, handledByUserId } =
                req.body || {};

            // Validate input
            if (!studentId || !majorId || !amountPaid) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            const major = await getMajorById(majorId);
            if (!major) {
                res.status(404).json({ message: "Major not found" });
                return;
            }
            let total = Number(major.price || 0);
            const majorTaxes = await getMajorTaxesByMajorId(majorId);

            const taxes: Pick<Tax, "name" | "amount">[] = [];

            if (majorTaxes && majorTaxes.length > 0) {
                const taxList = await Promise.all(
                    majorTaxes.map((majorTax) => getTaxById(majorTax.taxId))
                );
                taxList.forEach((tax) => {
                    if (tax) {
                        taxes.push({
                            name: tax.name,
                            amount: tax.amount,
                        });
                    }
                });

                total += taxList.reduce(
                    (sum, tax) => sum + Number(tax?.amount || 0),
                    0
                );
            }

            if (amountPaid > total) {
                res.status(400).json({
                    message: `Amount paid must be at most ${total} including taxes`,
                });
                return;
            }
            // logic to create payment
            const success = await insertPayment({
                studentId,
                majorId,
                amountPaid: parseFloat(amountPaid),
                remainingAmount: total - parseFloat(amountPaid),
                taxes: taxes,
                handledByUserId: req.user.id || handledByUserId,
            });

            if (!success) {
                res.status(400).json({ message: "Failed to create payment" });
                return;
            }

            // Log activity
            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.ADD_PAYMENT,
                entityType: "payment",
                entityId: studentId,
                details: `Added payment for student #${studentId}, major #${majorId}, amount ${amountPaid}`,
            });

            res.status(201).json({ message: "Payment recorded successfully" });
        } catch (error) {
            console.error("Create payment error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   PATCH /payments/:id
 * @desc    Update payment
 * @access  Admin (regular user/staff)
 */
router.patch(
    "/:id",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            const paymentId = parseInt(req.params.id);
            const { amountPaid } = req.body || {};

            // Validate input
            if (Number.isNaN(paymentId)) {
                res.status(400).json({ message: "Invalid payment ID" });
                return;
            }

            if (
                amountPaid === undefined ||
                amountPaid < 0 ||
                isNaN(amountPaid)
            ) {
                res.status(400).json({ message: "Invalid amount paid" });
                return;
            }

            if (!req.user) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            // Check if payment exists
            const payment = await getPaymentById(paymentId);
            if (!payment) {
                res.status(404).json({ message: "Payment not found" });
                return;
            }
            // Check if the payment is already fully paid
            if (payment.remainingAmount === 0) {
                res.status(400).json({
                    message: "Payment is already fully paid",
                });
                return;
            }
            if (payment.amountPaid === parseFloat(amountPaid)) {
                res.status(400).json({ message: "No change in amount paid" });
                return;
            }
            // Update payment details
            const total =
                Number(payment.amountPaid || 0) +
                Number(payment.remainingAmount || 0);

            if (amountPaid > total) {
                res.status(400).json({
                    message: "Amount paid exceeds total amount due",
                });
                return;
            }

            const success = await updatePayment(paymentId, {
                amountPaid: parseFloat(amountPaid),
                remainingAmount: total - parseFloat(amountPaid),
            });

            if (!success) {
                res.status(400).json({ message: "Failed to update payment" });
                return;
            }

            // Log activity
            await AddActivity({
                userId: req.user.id,
                action: ACTIVITY_ACTIONS.UPDATE_PAYMENT,
                entityType: "payment",
                entityId: paymentId,
                details: `Updated payment #${paymentId}, new amount: ${amountPaid}`,
            });

            res.status(200).json({ message: "Payment updated successfully" });
        } catch (error) {
            console.error("Update payment error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
