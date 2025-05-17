// (students, student-major relationships)
import { Router } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";

const router = Router();

// students
router.get("/students", authenticateJWT, async (req, res) => {});
router.get("/students/:id", authenticateJWT, async (req, res) => {});
router.post("/students", authenticateJWT, async (req, res) => {});
router.put("/students/:id", authenticateJWT, async (req, res) => {});
router.delete(
    "/students/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);

// student-major relationships
router.get("/students/:id/majors", async (req, res) => {});
router.get("/students/:id/majors/:majorId", async (req, res) => {});
router.post("/students/:id/majors", async (req, res) => {});
// router.put("/students/:id/majors/:majorId", async (req, res) => {});
// router.delete("/students/:id/majors/:majorId", async (req, res) => {});

export default router;
