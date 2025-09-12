import express from "express";
import healthRouter from "@/routes/health.routes";

const router = express.Router();

router.use("/health", healthRouter);

export default router;
