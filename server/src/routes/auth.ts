import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {});

router.post("/login", async (req: Request, res: Response) => {});

router.post("/logout", async (req: Request, res: Response) => {});

router.post("/refresh", async (req: Request, res: Response) => {});

export default router;
