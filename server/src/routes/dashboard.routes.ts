import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";

const router = Router();

/**
 * @route   GET /dashboard
 * @desc    General stats: student count, payment totals, etc.
 * @access  Admin (regular user/staff)
 */
router.get("/", authenticateJWT, async (req: Request, res: Response) => {
    try {
        // logic to get general dashboard stats
        // This would typically include:
        // 1. Total number of students
        // 2. Total payments collected
        // 3. Recent payments
        // 4. Students per major statistics
        // etc.

        const dashboardData = {
            studentCount: 0,
            totalPayments: 0,
            recentPayments: [],
            studentsByMajor: [],
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Get dashboard stats error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /dashboard/admin
 * @desc    Super admin-level stats
 * @access  Super Admin Only
 */
router.get(
    "/admin",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            // logic to get admin-level dashboard stats
            // This would typically include everything from general stats plus:
            // 1. System usage statistics
            // 2. User activity logs
            // 3. Financial projections
            // 4. Admin-specific metrics
            // etc.

            const adminDashboardData = {
                studentCount: 0,
                totalPayments: 0,
                recentPayments: [],
                studentsByMajor: [],
                userActivity: [],
                systemStats: {},
                financialProjections: {},
            };

            res.status(200).json(adminDashboardData);
        } catch (error) {
            console.error("Get admin dashboard stats error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
