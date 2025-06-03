import { Router, Request, Response } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import { getStudents, getStudentsByUserId } from "../models/studentsModel";
import { getPayments, getPaymentsByUser } from "../models/paymentsModel";
import { getMajors } from "../models/majorsModel";
import { getActivities, getActivitiesByUserId } from "../models/activityModel";
import { getUsers } from "../models/usersModel";
import { RequestWithUser } from "../types";
import { formatActivities } from "../utils/helpers";

const router = Router();

/**
 * @route   GET /dashboard/super
 * @desc    Super admin-level stats
 * @access  Super Admin Only
 */
router.get(
    "/super",
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

            // Calculate total income (sum of all payments)
            const totalIncome = payments.reduce(
                (sum, payment) => sum + Number(payment.amountPaid || 0),
                0
            );

            // Student count
            const studentCount = students.length;

            // Outstanding balance (sum of all remaining amounts)
            const outstandingBalance = payments.reduce(
                (sum, payment) => sum + Number(payment.remainingAmount || 0),
                0
            );

            // Staff count (users with role 'admin')
            const staffCount = users.filter((u) => u.role === "admin").length;

            // System stats
            const systemStats = {
                totalUsers: users.length,
                activeUsers: users.filter((user) => !user.banned).length,
                totalMajors: majors.length,
                averagePaymentAmount: payments.length
                    ? totalIncome / payments.length
                    : 0,
            };

            // Income over time (monthly)
            const incomeByMonth: { [month: string]: number } = {};
            payments.forEach((payment) => {
                const date = new Date(payment.paidAt);
                const monthKey = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;
                incomeByMonth[monthKey] =
                    (incomeByMonth[monthKey] || 0) +
                    Number(payment.amountPaid || 0);
            });
            const incomeOverTime = Object.entries(incomeByMonth)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([month, amount]) => ({ month, amount }));

            // Payments by program (major)
            const paymentsByProgram = majors.map((major) => ({
                program: major.name,
                total: payments
                    .filter((p) => p.majorId === major.id)
                    .reduce((sum, p) => sum + Number(p.amountPaid || 0), 0),
            }));

            // Top staff (by payment amount handled)
            const PaymentsByStaff: {
                [userId: number]: number;
            } = {};
            payments.forEach((p) => {
                if (!PaymentsByStaff[p.handledByUserId])
                    PaymentsByStaff[p.handledByUserId] = 0;
                PaymentsByStaff[p.handledByUserId] += Number(p.amountPaid || 0);
            });

            const sortedStaff = Object.entries(PaymentsByStaff)
                .map(([userId, total]) => {
                    const user = users.find((u) => u.id === parseInt(userId));
                    if (!user) return; // Skip if user not found
                    return {
                        userId: parseInt(userId),
                        userName: user ? user.fullName : `User ${userId}`,
                        income: total,
                        joinedAt: new Date(user.createdAt).toLocaleDateString(),
                    };
                })
                .filter(
                    (staff): staff is NonNullable<typeof staff> =>
                        staff !== undefined
                )
                .sort((a, b) => b.income - a.income)
                .slice(0, 7); // Top 7 staff by income handled

            // Recent activity (last 10)
            const recentActivity = formatActivities(activities).slice(0, 10);

            const result = {
                totalIncome,
                studentCount,
                outstandingBalance,
                staffCount,
                systemStats,
                charts: {
                    incomeOverTime,
                    paymentsByProgram,
                },
                sortedStaff,
                recentActivity,
            };

            res.status(200).json(result);
        } catch (error) {
            console.error("Get admin dashboard stats error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   GET /dashboard/admin
 * @desc    Student analytics and statistics
 * @access  Admin (regular user/staff)
 */

router.get(
    "/admin",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            // Get payments made by the admin
            const myPayments = await getPaymentsByUser(userId);

            // Calculate income and outstanding payments
            const myIncome = myPayments.reduce(
                (sum, payment) => sum + Number(payment.amountPaid || 0),
                0
            );
            const myOutstandingPayments = myPayments.reduce(
                (sum, payment) => sum + (payment.remainingAmount || 0),
                0
            );

            // Get students associated with the admin
            const myStudents = await getStudentsByUserId(userId);
            const myStudentsCount = myStudents.length;

            // Get recent activities for the admin
            const myActivities = await getActivitiesByUserId(userId);
            const myActivityCount = myActivities.length;

            // Get recent actions performed by the admin, count: 5
            const recentActions = formatActivities(myActivities).slice(0, 5);

            // --- Data for Charts ---

            // Payments by month (for line/bar chart)
            const paymentsByMonth: Record<string, number> = {};
            myPayments.forEach((payment) => {
                if (!payment.paidAt) return;
                const date = new Date(payment.paidAt);
                const monthKey = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;
                paymentsByMonth[monthKey] =
                    (paymentsByMonth[monthKey] || 0) +
                    Number(payment.amountPaid || 0);
            });

            // Outstanding payments by month (for line/bar chart)
            const outstandingByMonth: Record<string, number> = {};
            myPayments.forEach((payment) => {
                if (!payment.paidAt || payment.remainingAmount === undefined)
                    return;
                const date = new Date(payment.paidAt);
                const monthKey = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;
                outstandingByMonth[monthKey] =
                    (outstandingByMonth[monthKey] || 0) +
                    payment.remainingAmount;
            });

            // Students registered by month (for line/bar chart)
            const studentsByMonth: Record<string, number> = {};
            myStudents.forEach((student) => {
                if (!student.createdAt) return;
                const date = new Date(student.createdAt);
                const monthKey = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`;
                studentsByMonth[monthKey] =
                    (studentsByMonth[monthKey] || 0) + 1;
            });

            const adminDashboardData = {
                myIncome,
                myStudentsCount,
                myOutstandingPayments,
                myActivityCount,
                recentActions,
                charts: {
                    paymentsByMonth,
                    outstandingByMonth,
                    studentsByMonth,
                },
            };

            res.status(200).json(adminDashboardData);
        } catch (error) {
            console.error("Get admin dashboard stats error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
