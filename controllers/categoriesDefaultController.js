import { db } from "../db.js";
import { validateCategoryDefault } from "../utils/validators/validateCategoryDefault.js";
import { normalizeCategoryPayload } from "../utils/validators/normalizeCategoryDefault.js";

/* =============
   Get all categories
================*/
export const getCategoriesDefault = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM categories_default ORDER BY name ASC",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("getCategoriesDefault error:", error);
    res.status(500).json({ error: error.message });
  }
};

/* =============
    Add category
================*/
export const addCategoryDefault = async (req, res) => {
  try {
    const errors = validateCategoryDefault(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const payload = normalizeCategoryPayload(req.body);

    const { name } = payload;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const result = await db.query(
      `
      INSERT INTO categories_default (name)
      VALUES ($1)
      RETURNING *
      `,
      [name],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("addCategoryDefault error:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "Category name already exists" });
    }

    return res.status(500).json({ error: error.message });
  }
};

/* =============
    update category
================*/
export const updateCategoryDefault = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ walidacja id
    const idNum = Number(id);

    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const errors = validateCategoryDefault(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const payload = normalizeCategoryPayload(req.body);
    const { name } = payload;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const result = await db.query(
      `
      UPDATE categories_default
      SET name = $1
      WHERE id = $2
      RETURNING *
      `,
      [name, idNum],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("updateCategoryDefault error:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "Category name already exists" });
    }

    return res.status(500).json({ error: error.message });
  }
};
