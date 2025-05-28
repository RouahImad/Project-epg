import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "../types/User.types";

export interface AuthRequest extends Request {
    user?: User;
}

// type AuthHeader = `Bearer ${string}`;

export const authenticateJWT = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!config.jwtSecret) {
        console.error("JWT Secret is not defined");
        res.status(500).json({
            message: "Some error occurred, please try again later",
        });
        return;
    }

    const authHeader =
        (req.cookies?.token ? `Bearer ${req.cookies.token.trim()}` : null) ||
        req.headers?.authorization ||
        null;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Access token required" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as User;
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

export const checkRole = (role: User["role"]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ message: "Unauthorized access" });
        }
    };
};
