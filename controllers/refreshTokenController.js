import { db } from "../db.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { verifyRefreshToken, jwtCommonOptions } from "../utils/jwt-helpers.js";

// 🔒 Hash refresh token
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const getRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    // ❌ No cookie
    if (!refreshToken) {
      return res.status(400).json({
        error: "No refresh token provided",
      });
    }

    // 🔒 Hash token
    const hashedToken = hashToken(refreshToken);

    // 🔍 Find user by hashed token
    const foundUser = await db.query("SELECT * FROM users WHERE token = $1", [
      hashedToken,
    ]);

    // ❌ Invalid refresh token
    if (foundUser.rows.length === 0) {
      return res.status(403).json({
        error: "Invalid refresh token",
      });
    }

    const user = foundUser.rows[0];

    // ✅ Verify JWT refresh token
    verifyRefreshToken(refreshToken, (error, decoded) => {
      if (error) {
        console.error("JWT verification failed:", error);

        return res.status(403).json({
          error: "Invalid token",
        });
      }

      // 🎟 Generate new access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          ...jwtCommonOptions,
          expiresIn: "15m",
        },
      );

      return res.json({ accessToken });
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export { getRefreshToken };
