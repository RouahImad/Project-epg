// (payments, receipts, taxes)
import { Router } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";

const router = Router();

// payments
router.get("/payments", authenticateJWT, async (req, res) => {});
router.get("/payments/:id", authenticateJWT, async (req, res) => {});
router.post("/payments", authenticateJWT, async (req, res) => {});
router.put("/payments/:id", authenticateJWT, async (req, res) => {});
// router.delete("/payments/:id", async (req, res) => {});

// receipts
router.get("/receipts", authenticateJWT, async (req, res) => {});
router.get("/receipts/:id", authenticateJWT, async (req, res) => {});
router.post("/receipts", authenticateJWT, async (req, res) => {});
// router.delete("/receipts/:id", async (req, res) => {});

// taxes
router.get("/taxes", authenticateJWT, async (req, res) => {});
router.get("/taxes/:id", authenticateJWT, async (req, res) => {});
router.post(
    "/taxes",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);
router.put(
    "/taxes/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);
router.delete(
    "/taxes/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);

// taxes types
router.get("/taxes/types", async (req, res) => {});
router.get("/taxes/types/:id", async (req, res) => {});
router.post(
    "/taxes/types",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);
router.put(
    "/taxes/types/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);
router.delete(
    "/taxes/types/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);

export default router;
