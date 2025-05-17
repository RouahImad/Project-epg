// (users, activities, system functions)
import { Router } from "express";

const router = Router();

// users
router.get("/users", async (req, res) => {});
router.get("/users/:id", async (req, res) => {});
router.post("/users", async (req, res) => {});
router.put("/users/:id", async (req, res) => {});
router.delete("/users/:id", async (req, res) => {});

// activities
router.get("/activities", async (req, res) => {});
router.get("/activities/:id", async (req, res) => {});
router.post("/activities", async (req, res) => {});
router.put("/activities/:id", async (req, res) => {});
router.delete("/activities/:id", async (req, res) => {});

export default router;
