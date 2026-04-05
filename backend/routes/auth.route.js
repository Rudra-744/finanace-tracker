import express from 'express';
import { registerUser, loginUser, refreshAccessToken } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', refreshAccessToken);

export default router;