import { Router } from "express";
import { getHealth } from "@/controllers/health.controller";

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", getHealth);

export default router;
