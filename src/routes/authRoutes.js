import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema, signupSchema } from "../validators/authValidator.js";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);

export default router;
