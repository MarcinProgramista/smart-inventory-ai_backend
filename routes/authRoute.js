import express from "express";
import { handleLogin } from "../controllers/authController.js";
import { handleLogout } from "../controllers/logoutController.js";
import { getRefreshToken } from "../controllers/refreshTokenController.js";

const router = express.Router();

router.post("/login", handleLogin);
router.delete("/logout", handleLogout);
router.get("/refresh", getRefreshToken);

export default router;
