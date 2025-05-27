import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { authenticateJWT, checkRole } from "../middlewares/auth";
import {
    getUsers,
    getUserById,
    insertUser,
    updateUser,
    deleteUser,
} from "../models/usersModel";

const router = Router();

/**
 * @route   GET /users
 * @desc    List all users
 * @access  Super Admin Only
 */
router.get(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const users = await getUsers();

            // Remove passwords from response
            const usersWithoutPasswords = users.map((user) => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });

            res.status(200).json(usersWithoutPasswords);
        } catch (error) {
            console.error("Get users error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   POST /users
 * @desc    Create a new user
 * @access  Super Admin Only
 */
router.post(
    "/",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const { fullName, email, password, role } = req.body || {};

            // Validate input
            if (!fullName || !email || !password || !role) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const newUser = {
                fullName,
                email,
                password: hashedPassword,
                role,
            };

            const success = await insertUser(newUser);

            if (!success) {
                res.status(400).json({ message: "Failed to create user" });
                return;
            }

            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            console.error("Create user error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   PATCH /users/:id
 * @desc    Update a user
 * @access  Super Admin Only
 */
router.patch(
    "/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.id);
            const { fullName, email, password, role, banned } = req.body || {};

            // Validate input
            if (Number.isNaN(userId)) {
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }

            // Check if user exists
            const user = await getUserById(userId);

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            // Prepare update data
            let updateData: any = {};
            if (fullName) updateData.fullName = fullName;
            if (email) updateData.email = email;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }
            if (role) updateData.role = role;
            if (banned !== undefined) updateData.banned = banned;

            // Update user
            const success = await updateUser(userId, updateData);

            if (!success) {
                res.status(400).json({ message: "Failed to update user" });
                return;
            }

            res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            console.error("Update user error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

/**
 * @route   DELETE /users/:id
 * @desc    Delete a user
 * @access  Super Admin Only
 */
router.delete(
    "/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req: Request, res: Response) => {
        try {
            const userId = parseInt(req.params.id);

            // Validate input
            if (Number.isNaN(userId)) {
                res.status(400).json({ message: "Invalid user ID" });
                return;
            }

            // Check if user exists
            const user = await getUserById(userId);

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            // Delete user
            const success = await deleteUser(userId);

            if (!success) {
                res.status(400).json({ message: "Failed to delete user" });
                return;
            }

            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Delete user error:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
