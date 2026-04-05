import express from "express";
import { registerUser, loginUser, refreshAccessToken } from "../controller/auth.controller.js";
import validate from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../utils/validators.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh-token", refreshAccessToken);

export default router;