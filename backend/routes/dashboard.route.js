import express from "express";
import { getDashboardStats } from "../controller/dashboard.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.use(protect);

router.get("/summary",restrictTo("admin","analyst"),getDashboardStats);

export default router;