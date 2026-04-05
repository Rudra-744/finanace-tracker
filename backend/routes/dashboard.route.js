import express from "express";
import { getDashboardStats, getCategoryTotals, getRecentActivity, getMonthlyTrends } from "../controller/dashboard.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin", "analyst"));

router.get("/summary", getDashboardStats);
router.get("/categories", getCategoryTotals);
router.get("/recent", getRecentActivity);
router.get("/trends", getMonthlyTrends);

export default router;