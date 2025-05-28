import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import { getActivities } from "../models/activityModel";

const router = Router();

/**
 * @route   GET /activity-logs
 * @desc    Get all activity logs
 * @access  Super Admin Only
 */
router.get(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            // Implement pagination
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = (page - 1) * limit;

            // Implement filtering options
            const userIdFilter = req.query.userId
                ? parseInt(req.query.userId as string)
                : undefined;
            const actionFilter = req.query.action as string;
            const startDate = req.query.startDate
                ? new Date(req.query.startDate as string)
                : undefined;
            const endDate = req.query.endDate
                ? new Date(req.query.endDate as string)
                : undefined; // Get activities with filtering
            const activities = await getActivities();

            // Apply filters
            let filteredActivities = activities;

            if (userIdFilter) {
                filteredActivities = filteredActivities.filter(
                    (activity) => activity.userId === userIdFilter
                );
            }

            if (actionFilter) {
                filteredActivities = filteredActivities.filter((activity) =>
                    activity.action.includes(actionFilter)
                );
            }

            if (startDate) {
                filteredActivities = filteredActivities.filter(
                    (activity) => new Date(activity.timestamp) >= startDate
                );
            }

            if (endDate) {
                filteredActivities = filteredActivities.filter(
                    (activity) => new Date(activity.timestamp) <= endDate
                );
            }

            // Apply pagination
            const totalCount = filteredActivities.length;
            const paginatedActivities = filteredActivities.slice(
                skip,
                skip + limit
            );
            res.status(200).json({
                logs: paginatedActivities,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalItems: totalCount,
                    itemsPerPage: limit,
                },
            });
        } catch (error) {
            console.error("Get activity logs error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
