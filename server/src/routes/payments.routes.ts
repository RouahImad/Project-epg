import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import {
    deletePayment,
    getPaymentById,
    getPayments,
    insertPayment,
    updatePayment,
} from "../models/paymentsModel";
import { getMajorTaxesByMajorId } from "../models/majorTaxesModel";
import { getTaxById } from "../models/taxesModel";
import { getMajorById } from "../models/majorsModel";
import { Payment, Tax } from "../types/Financial.types";

const router = Router();

/**
 * @route   GET /payments
 * @desc    Get all payments
 * @access  Admin (regular user/staff)
 */
interface PaymentWithTaxes extends Payment {
    taxes?: Tax[] | undefined;
}
router.get("/", authenticateJWT, async (req: Request, res: Response) => {
    try {
        // logic to get payments
        const payments = await getPayments();
        if (!payments || payments.length === 0) {
            res.status(404).json({ message: "No payments found" });
            return;
        }
        const paymentsHistory: PaymentWithTaxes[] = [...payments];
        const taxPromises = paymentsHistory.map(async (payment) => {
            payment.taxes = [];
            const majorTaxes = await getMajorTaxesByMajorId(payment.majorId);
            if (!majorTaxes || majorTaxes.length === 0) return payment;

            const taxPromises = majorTaxes.map((majorTax) =>
                getTaxById(majorTax.taxId)
            );
            const taxes = await Promise.all(taxPromises);
            payment.taxes = taxes.filter((tax) => tax !== null);
            return payment;
        });
        await Promise.all(taxPromises);
        res.status(200).json(paymentsHistory);
    } catch (error) {
        console.error("Get payments error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   POST /payments
 * @desc    Add a payment for a student
 * @access  Admin (regular user/staff)
 */
router.post(
    "/",
    authenticateJWT,
    async (req: Request & { user?: any }, res: Response) => {
        try {
            const { studentId, majorId, amountPaid, handledByUserId } =
                req.body || {};

            // Validate input
            if (!studentId || !majorId || !amountPaid || !handledByUserId) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }

            const major = await getMajorById(majorId);
            if (!major) {
                res.status(404).json({ message: "Major not found" });
                return;
            }
            let total = major.price;
            const majorTaxes = await getMajorTaxesByMajorId(majorId);

            majorTaxes.forEach(async (majorTax) => {
                const taxPromises = getTaxById(majorTax.taxId);
                const tax = await Promise.resolve(taxPromises);

                if (!tax) return;
                total += tax.amount;
                return tax;
            });

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
                handledByUserId: req.user?.id || handledByUserId,
            });

            if (!success) {
                res.status(400).json({ message: "Failed to create payment" });
                return;
            }

            res.status(201).json({ message: "Payment recorded successfully" });
        } catch (error) {
            console.error("Create payment error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   GET /payments/:id
 * @desc    Get single payment
 * @access  Admin (regular user/staff)
 */
router.get("/:id", authenticateJWT, async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);

        // Validate input
        if (Number.isNaN(paymentId)) {
            res.status(400).json({ message: "Invalid payment ID" });
            return;
        }

        const payment = await getPaymentById(paymentId);
        if (!payment) {
            res.status(404).json({ message: "Payment not found" });
            return;
        }
        const paymentWithTaxes: PaymentWithTaxes = { ...payment };
        paymentWithTaxes.taxes = [];
        const majorTaxes = await getMajorTaxesByMajorId(payment.majorId);

        if (majorTaxes.length > 0) {
            const taxPromises = majorTaxes.map((majorTax) =>
                getTaxById(majorTax.taxId)
            );
            const taxes = await Promise.all(taxPromises);
            paymentWithTaxes.taxes = taxes.filter((tax) => tax !== null);
        }

        res.status(200).json(paymentWithTaxes);
    } catch (error) {
        console.error("Get payment error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   PATCH /payments/:id
 * @desc    Update payment
 * @access  Admin (regular user/staff)
 */
router.patch("/:id", authenticateJWT, async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        const { amountPaid } = req.body || {};

        // Validate input
        if (Number.isNaN(paymentId)) {
            res.status(400).json({ message: "Invalid payment ID" });
            return;
        }

        if (amountPaid === undefined || amountPaid < 0 || isNaN(amountPaid)) {
            res.status(400).json({ message: "Invalid amount paid" });
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
            res.status(400).json({ message: "Payment is already fully paid" });
            return;
        }
        if (payment.amountPaid === parseFloat(amountPaid)) {
            res.status(400).json({ message: "No change in amount paid" });
            return;
        }
        // Update payment details
        const total = payment.amountPaid + (payment.remainingAmount || 0);
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

        res.status(200).json({ message: "Payment updated successfully" });
    } catch (error) {
        console.error("Update payment error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   DELETE /payments/:id
 * @desc    Delete payment
 * @access  Super Admin Only
 */
router.delete(
    "/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const paymentId = parseInt(req.params.id);

            // Validate input
            if (Number.isNaN(paymentId)) {
                res.status(400).json({ message: "Invalid payment ID" });
                return;
            }

            const success = await deletePayment(paymentId);

            if (!success) {
                res.status(400).json({ message: "Failed to delete payment" });
                return;
            }

            res.status(200).json({ message: "Payment deleted successfully" });
        } catch (error) {
            console.error("Delete payment error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
