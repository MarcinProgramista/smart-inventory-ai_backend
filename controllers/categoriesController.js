import { db } from "../db.js";

/* ==============================
    GET ALL CATEGORIES FROM USER 
=================================*/
export const getCategories = async (req, res) => {
  const userId = parseInt(req.query.user_id);

  if (!userId) return res.status(400).json({ error: "user_id is required" });

  try {
    const result = await db.query(
      "SELECT * FROM categories WHERE user_id = $1 ORDER BY id",
      [userId],
    );
    res.json(result.rows);
  } catch (error) {
    console.log("getCategories error", error);
    res.status(500).json({ error: error.message });
  }
  return res.json(userId);
};
