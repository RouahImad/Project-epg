import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import { getActivities } from "../models/activityModel";
import { formatActivities } from "../utils/helpers";

const router = Router();

/**
 * @route   GET /logs
 * @desc    Get all activity logs
 * @access  Super Admin Only
 */
router.get(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const activities = await getActivities();
            console.log("logs:", activities);

            res.status(200).json(formatActivities(activities));
        } catch (error) {
            console.error("Get activity logs error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
