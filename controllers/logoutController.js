import { db } from "../db.js";
import crypto from "crypto";

// Funkcja do hashowania refresh tokena
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
const handleLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;
    // Jeśli brak cookie - nic nie robimy
    if (!refreshToken) return res.sendStatus(204);

    // hashujemy token (bo w DB też jest hashem)
    const hashedToken = hashToken(refreshToken);

    // 🔍 Szukamy użytkownika po hashu
    const foundUser = await db.query(
      "SELECT * FROM users WHERE token = $1 LIMIT 1",
      [hashedToken],
    );

    // 🔹 Jeśli token nie istnieje — czyścimy cookie i kończymy
    if (foundUser.rows.length === 0) {
      res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
      });
      return res.sendStatus(204);
    }

    // 🔥 Usuwamy refresh token z bazy
    await db.query("UPDATE users SET token = NULL WHERE id = $1", [
      foundUser.rows[0].id,
    ]);

    // 🔥 Usuwamy cookie z przeglądarki
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export { handleLogout };
