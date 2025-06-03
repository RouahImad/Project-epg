import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { rateLimit } from "express-rate-limit";
import { authenticateJWT } from "../middlewares/auth";
import { getUserByEmail, getUserById, updateUser } from "../models/usersModel";
import { config } from "../config/config";
import { RequestWithUser } from "../types";
import { AddActivity } from "../utils/helpers";
import { ACTIVITY_ACTIONS } from "../types/User.types";

const router = Router();

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs per IP
    message: { message: "Too many login attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * @route   POST /auth/login
 * @desc    Login and get token
 * @access  Public
 */
router.post(
    "/login",
    loginLimiter,
    async (req: RequestWithUser, res: Response) => {
        try {
            const { email, password } = req.body || {};

            // Validate input
            if (!email || !password) {
                res.status(400).json({
                    message: "Email and password are required",
                });
                return;
            }

            // Fetch user from database
            const user = await getUserByEmail(email);
            if (!user) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            } // Check ban
            if (user.banned) {
                res.status(403).json({ message: "User is banned" });
                return;
            }

            if (!config.jwtSecret) {
                console.error("JWT Secret is not defined");
                res.status(500).json({
                    message: "Some error occurred, please try again later",
                });
                return;
            }

            // Generate JWT token
            const token = jwt.sign(user, config.jwtSecret, {
                expiresIn: config.jwtExp,
            } as SignOptions);

            // Set token in cookie
            res.cookie("token", token.trim(), {
                httpOnly: true,
                secure: config.env === "production", // Use secure cookies in production
                sameSite: "strict", // Prevent CSRF attacks
            });
            req.user = user;
            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                message: "Login successful",
                token,
                user: userWithoutPassword,
            });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   GET /auth/profile
 * @desc    Get logged-in user profile
 * @access  Admin (regular user/staff)
 */
router.get(
    "/profile",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            if (!req.user || !req.user.id) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            const userId = req.user.id;
            const user = await getUserById(userId);

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            // Don't send password in response
            const { password, ...userWithoutPassword } = user;

            res.status(200).json(userWithoutPassword);
        } catch (error) {
            console.error("Get profile error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   PATCH /auth/profile
 * @desc    Update own profile info
 * @access  Admin (regular user/staff)
 */
router.patch(
    "/profile",
    authenticateJWT,
    async (req: RequestWithUser, res: Response) => {
        try {
            if (!req.user || !req.user.id) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }

            const userId = req.user.id;
            const { fullName, email, password } = req.body || {};
            // Hash password if provided
            let updatedData: any = {};
            if (fullName) updatedData.fullName = fullName;
            if (email) updatedData.email = email;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updatedData.password = await bcrypt.hash(password, salt);
            }

            const success = await updateUser(userId, updatedData);

            if (!success) {
                res.status(400).json({ message: "Failed to update profile" });
                return;
            }

            // Log activity
            await AddActivity({
                userId,
                action: ACTIVITY_ACTIONS.UPDATE_PROFILE,
                entityType: "user",
                entityId: userId,
                details: `Updated profile for user #${userId} (${fullName})`,
            });

            res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            console.error("Update profile error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   POST /auth/logout
 * @desc    Logout user and clear token
 * @access  Public
 */

router.post("/logout", (req: Request, res: Response) => {
    try {
        // Clear the token cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: config.env === "production",
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
