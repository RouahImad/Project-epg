import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import { getCompanyInfo, updateCompanyInfo } from "../models/companyModel";

const router = Router();

/**
 * @route   GET /company-info
 * @desc    Get company info
 * @access  Super Admin Only
 */
router.get(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const companyInfo = await getCompanyInfo();

            res.status(200).json(companyInfo);
        } catch (error) {
            console.error("Get company info error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   PATCH /company-info
 * @desc    Update company info
 * @access  Super Admin Only
 */
router.patch(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const { name, logoUrl, address, email, phone, website } =
                req.body || {};

            const success = await updateCompanyInfo({
                name,
                logoUrl,
                address,
                email,
                phone,
                website,
            });

            if (!success) {
                res.status(400).json({
                    message: "Failed to update company information",
                });
                return;
            }

            res.status(200).json({
                message: "Company information updated successfully",
            });
        } catch (error) {
            console.error("Update company info error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
