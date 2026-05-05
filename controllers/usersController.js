import { db } from "../db.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await db.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllUsers };
