// (majors, major types, taxes)
import { Router } from "express";
import { authenticateJWT, checkRole } from "../middlewares/auth";

const router = Router();

// majors
router.get("/majors", async (req, res) => {});
router.get("/majors/:id", async (req, res) => {});
router.post(
    "/majors",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);
router.put(
    "/majors/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);
router.delete(
    "/majors/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);

// majors types
router.get("/majors/types", async (req, res) => {});
router.get("/majors/types/:id", async (req, res) => {});
router.post(
    "/majors/types",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);
router.put(
    "/majors/types/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);
router.delete(
    "/majors/types/:id",
    authenticateJWT,
    checkRole("super_admin"),
    async (req, res) => {}
);

// taxes
router.get("/taxes", async (req, res) => {});
router.get("/taxes/:id", async (req, res) => {});
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
