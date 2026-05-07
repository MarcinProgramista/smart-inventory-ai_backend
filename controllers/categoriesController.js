import { db } from "../db.js";

/* ==============================
    GET ALL CATEGORIES FROM USER 
=================================*/
export const getCategories = async (req, res) => {
  const userId = parseInt(req.query.user_id);

  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({
      error: "Valid user_id is required",
    });
  }
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
};

/**
 * ADD CATEGORY
 */
export const addCategory = async (req, res) => {
  const user_id = req.user.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Category name is required",
    });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO categories (user_id, name)
      VALUES ($1, $2)
      RETURNING *
      `,
      [user_id, name],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("addCategory error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Category already exists",
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};
