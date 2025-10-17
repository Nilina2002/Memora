import User from "../models/userModel.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const user = await User.create({ name, email, password, refreshTokens: [] });

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token in DB
        user.refreshTokens.push(refreshToken);
        await user.save();

        // Set httpOnly cookie
        res.cookie(process.env.COOKIE_NAME || "rtoken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // match REFRESH_TOKEN_EXPIRES (7 days)
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: accessToken,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token in DB (allow multiple tokens)
        user.refreshTokens.push(refreshToken);
        await user.save();

        // Set httpOnly cookie
        res.cookie(process.env.COOKIE_NAME || "rtoken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: accessToken,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Refresh tokens (rotate)
export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies?.[process.env.COOKIE_NAME || "rtoken"];
        if (!token) return res.status(401).json({ message: "No refresh token provided" });

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "User not found" });

        // Check token exists in DB (not revoked)
        const tokenIndex = user.refreshTokens.findIndex((t) => t === token);
        if (tokenIndex === -1) {
            return res.status(401).json({ message: "Refresh token revoked" });
        }

        // Rotate: remove old refresh token, create new one
        const newRefreshToken = generateRefreshToken(user._id);
        // Replace old token with new one
        user.refreshTokens.splice(tokenIndex, 1, newRefreshToken);
        await user.save();

        // Issue new access token
        const newAccessToken = generateAccessToken(user._id);

        // Set cookie with new refresh token
        res.cookie(process.env.COOKIE_NAME || "rtoken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ token: newAccessToken });
    } catch (error) {
        console.error("Refresh error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Logout (revoke refresh token from this device)
export const logoutUser = async (req, res) => {
    try {
        const token = req.cookies?.[process.env.COOKIE_NAME || "rtoken"];
        if (!token) {
            // Clear cookie anyway
            res.clearCookie(process.env.COOKIE_NAME || "rtoken");
            return res.json({ message: "Logged out" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            // invalid token — clear cookie and return
            res.clearCookie(process.env.COOKIE_NAME || "rtoken");
            return res.json({ message: "Logged out" });
        }

        const user = await User.findById(decoded.id);
        if (user) {
            // remove this refresh token
            user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
            await user.save();
        }

        // Clear cookie
        res.clearCookie(process.env.COOKIE_NAME || "rtoken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        return res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// OPTIONAL: Logout from all devices (revoke all refresh tokens)
export const logoutAll = async (req, res) => {
    try {
        const userId = req.user?._id; // make sure this route is protected by 'protect' middleware
        if (!userId) return res.status(401).json({ message: "Not authenticated" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.refreshTokens = [];
        await user.save();

        // Clear cookie
        res.clearCookie(process.env.COOKIE_NAME || "rtoken");

        res.json({ message: "Logged out from all devices" });
    } catch (error) {
        console.error("LogoutAll error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
