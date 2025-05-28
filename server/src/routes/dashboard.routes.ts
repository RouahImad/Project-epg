import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import { getStudents } from "../models/studentsModel";
import { getPayments } from "../models/paymentsModel";
import { getMajors } from "../models/majorsModel";
import { getActivities } from "../models/activityModel";
import { getUsers } from "../models/usersModel";

const router = Router();

/**
 * @route   GET /dashboard
 * @desc    General stats: student count, payment totals, etc.
 * @access  Admin (regular user/staff)
 */
router.get("/", authenticateJWT, async (req: Request, res: Response) => {
    try {
        // Get actual dashboard stats
        const students = await getStudents();
        const payments = await getPayments();
        const majors = await getMajors();

        // Calculate total payments
        const totalPayments = payments.reduce(
            (sum, payment) => sum + payment.amountPaid,
            0
        );

        // Get recent payments (last 5)
        const recentPayments = [...payments]
            .sort(
                (a, b) =>
                    new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
            )
            .slice(0, 5);

        // Count students per major
        const studentsByMajor = majors.map((major) => {
            const count = payments.filter(
                (payment) => payment.majorId === major.id
            ).length;
            return {
                majorId: major.id,
                majorName: major.name,
                studentCount: count,
            };
        });

        const dashboardData = {
            studentCount: students.length,
            totalPayments,
            recentPayments,
            studentsByMajor,
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
            // Get all data for super admin dashboard
            const students = await getStudents();
            const payments = await getPayments();
            const majors = await getMajors();
            const activities = await getActivities();
            const users = await getUsers();

            // Calculate total payments
            const totalPayments = payments.reduce(
                (sum, payment) => sum + payment.amountPaid,
                0
            );

            // Get recent payments (last 5)
            const recentPayments = [...payments]
                .sort(
                    (a, b) =>
                        new Date(b.paidAt).getTime() -
                        new Date(a.paidAt).getTime()
                )
                .slice(0, 5);

            // Count students per major
            const studentsByMajor = majors.map((major) => {
                const count = payments.filter(
                    (payment) => payment.majorId === major.id
                ).length;
                return {
                    majorId: major.id,
                    majorName: major.name,
                    studentCount: count,
                };
            });

            // Get user activity (last 10)
            const userActivity = [...activities]
                .sort(
                    (a, b) =>
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                )
                .slice(0, 10);

            // Calculate system stats
            const systemStats = {
                totalUsers: users.length,
                activeUsers: users.filter((user) => !user.banned).length,
                totalMajors: majors.length,
                averagePaymentAmount: payments.length
                    ? totalPayments / payments.length
                    : 0,
            };

            // Calculate financial projections
            const monthlyRevenue = payments.reduce((monthly, payment) => {
                const month = new Date(payment.paidAt).getMonth();
                monthly[month] = (monthly[month] || 0) + payment.amountPaid;
                return monthly;
            }, Array(12).fill(0));

            const adminDashboardData = {
                studentCount: students.length,
                totalPayments,
                recentPayments,
                studentsByMajor,
                userActivity,
                systemStats,
                financialProjections: {
                    monthlyRevenue,
                    projectedAnnualRevenue: totalPayments * 1.2, // Example projection
                },
            };

            res.status(200).json(adminDashboardData);
        } catch (error) {
            console.error("Get admin dashboard stats error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   GET /dashboard/financial
 * @desc    Financial overview and analytics
 * @access  Super Admin Only
 */
router.get(
    "/financial",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const payments = await getPayments();
            const majors = await getMajors();

            // Get date range parameters
            const startDate = req.query.startDate
                ? new Date(req.query.startDate as string)
                : new Date(
                      new Date().setFullYear(new Date().getFullYear() - 1)
                  ); // Default: 1 year ago

            const endDate = req.query.endDate
                ? new Date(req.query.endDate as string)
                : new Date(); // Default: current date

            // Filter payments by date range
            const filteredPayments = payments.filter((payment) => {
                const paymentDate = new Date(payment.paidAt);
                return paymentDate >= startDate && paymentDate <= endDate;
            });

            // Total revenue in period
            const totalRevenue = filteredPayments.reduce(
                (sum, payment) => sum + payment.amountPaid,
                0
            );

            // Revenue by month
            const revenueByMonth = filteredPayments.reduce(
                (monthly, payment) => {
                    const date = new Date(payment.paidAt);
                    const monthKey = `${date.getFullYear()}-${
                        date.getMonth() + 1
                    }`;
                    monthly[monthKey] =
                        (monthly[monthKey] || 0) + payment.amountPaid;
                    return monthly;
                },
                {} as Record<string, number>
            );

            // Revenue by major
            const revenueByMajor = filteredPayments.reduce(
                (byMajor, payment) => {
                    byMajor[payment.majorId] =
                        (byMajor[payment.majorId] || 0) + payment.amountPaid;
                    return byMajor;
                },
                {} as Record<number, number>
            );

            // Enhance revenueByMajor with major names
            const revenueByMajorWithNames = Object.entries(revenueByMajor).map(
                ([majorId, revenue]) => {
                    const major = majors.find(
                        (m) => m.id === parseInt(majorId)
                    );
                    return {
                        majorId: parseInt(majorId),
                        majorName: major?.name || "Unknown Major",
                        revenue,
                    };
                }
            );

            // Outstanding payments (remaining amounts)
            const outstandingAmount = payments.reduce(
                (sum, payment) => sum + (payment.remainingAmount || 0),
                0
            );

            // Provide financial metrics
            const financialData = {
                period: {
                    startDate,
                    endDate,
                },
                summary: {
                    totalRevenue,
                    outstandingAmount,
                    collectionRate:
                        (totalRevenue / (totalRevenue + outstandingAmount)) *
                        100,
                },
                revenueByMonth,
                revenueByMajor: revenueByMajorWithNames,
            };

            res.status(200).json(financialData);
        } catch (error) {
            console.error("Get financial dashboard error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   GET /dashboard/students
 * @desc    Student analytics and statistics
 * @access  Admin (regular user/staff)
 */
router.get(
    "/students",
    authenticateJWT,
    async (req: Request, res: Response) => {
        try {
            const students = await getStudents();
            const payments = await getPayments();
            const majors = await getMajors();

            // Students by major
            const studentsByMajor = majors.map((major) => {
                const count = payments.filter(
                    (payment) => payment.majorId === major.id
                ).length;
                return {
                    majorId: major.id,
                    majorName: major.name,
                    studentCount: count,
                };
            });

            // Calculate new student registrations by month
            const registrationsByMonth = students.reduce((monthly, student) => {
                const date = new Date(student.createdAt);
                const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
                monthly[monthKey] = (monthly[monthKey] || 0) + 1;
                return monthly;
            }, {} as Record<string, number>);

            // Calculate age distribution
            const ageDistribution = students.reduce((distribution, student) => {
                if (!student.dateOfBirth) return distribution;

                const birthDate = new Date(student.dateOfBirth);
                const age = new Date().getFullYear() - birthDate.getFullYear();

                // Group by age ranges
                let ageGroup = "18-24";
                if (age < 18) ageGroup = "Under 18";
                else if (age >= 25 && age <= 34) ageGroup = "25-34";
                else if (age >= 35 && age <= 44) ageGroup = "35-44";
                else if (age >= 45) ageGroup = "45+";

                distribution[ageGroup] = (distribution[ageGroup] || 0) + 1;
                return distribution;
            }, {} as Record<string, number>);

            const studentData = {
                totalStudents: students.length,
                studentsByMajor,
                registrationsByMonth,
                demographics: {
                    ageDistribution,
                },
                // Since we don't have an isCompleted field, calculating based on major payments
                completionRate:
                    (payments.filter((p) => p.remainingAmount === 0).length /
                        payments.length) *
                        100 || 0,
            };

            res.status(200).json(studentData);
        } catch (error) {
            console.error("Get student dashboard error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
