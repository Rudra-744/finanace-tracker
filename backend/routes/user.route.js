import express from "express";
import { getAllUsers, updateUserRole, toggleUserStatus } from "../controller/user.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));

router.get("/", getAllUsers);
router.patch("/:id/role", updateUserRole);
router.patch("/:id/status", toggleUserStatus);

export default router;
