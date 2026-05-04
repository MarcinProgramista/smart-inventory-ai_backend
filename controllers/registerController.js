import { db } from "../db.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { name, email, password, password2 } = req.body;

  // 🔍 Validation
  if (!name || !email || !password || !password2) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== password2) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔄 TRANSACTION START
    await db.query("BEGIN");

    // 1️⃣ Create user
    const newUser = await db.query(
      `
      INSERT INTO users (name, email, password, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email
      `,
      [name, normalizedEmail, hashedPassword, 2],
    );

    const userId = newUser.rows[0].id;

    // 2️⃣ Copy default categories → categories
    await db.query(
      `
      INSERT INTO categories (user_id, name)
      SELECT $1, name FROM categories_default
      `,
      [userId],
    );

    // 3️⃣ Copy default suppliers → suppliers
    await db.query(
      `
      INSERT INTO suppliers (
        user_id, name, street, postal_code, city, country
      )
      SELECT 
        $1, name, street, postal_code, city, country
      FROM suppliers_default
      `,
      [userId],
    );

    // 🔒 COMMIT
    await db.query("COMMIT");

    return res.status(201).json({
      message: `User ${newUser.rows[0].email} registered successfully`,
      userId,
    });
  } catch (error) {
    // 🔄 ROLLBACK
    await db.query("ROLLBACK");

    console.error("Registration error:", error);

    // UNIQUE email
    if (error.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: "Registration failed" });
  }
};
