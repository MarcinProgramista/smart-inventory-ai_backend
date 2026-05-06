import express from "express";
import { handleLogin } from "../controllers/authController.js";
import { handleLogout } from "../controllers/logoutController.js";
const router = express.Router();

router.post("/login", handleLogin);
router.delete("/logout", handleLogout);

export default router;
