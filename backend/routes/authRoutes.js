import express from "express";
import { registerUser, loginUser, refreshToken, logoutUser, logoutAll } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken); // reads cookie, returns new access token & rotated refresh cookie
router.post("/logout", logoutUser); // revoke this device's refresh token + clear cookie
router.post("/logout-all", protect, logoutAll); // optional: revoke all tokens for current user

export default router;
