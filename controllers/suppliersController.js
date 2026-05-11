import { db } from "../db.js";
import { normalizeSupplier } from "../utils/validators/normalizeSupplier.js";
import { validateSupplier } from "../utils/validators/validateSupplier.js";

/**
 * get all suppliers
 */
export const getSuppliers = async (req, res) => {
  const user_id = req.user.id;
  if (!user_id) return res.status(400).json({ error: "user_id required" });
  try {
    const result = await db.query(
      "SELECT * FROM suppliers WHERE user_id = $1 ORDER BY name ASC",
      [user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.log("getSuppliers error:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * add supplier
 */
export const addSupplier = async (req, res) => {
  const user_id = req.user.id;
  try {
    const errors = validateSupplier(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const payload = normalizeSupplier(req.body);
    const { name, contact_id, street, postal_code, city, country } = payload;
    const result = await db.query(
      `
        INSERT INTO suppliers(
            user_id,name, contact_id, street, postal_code, city, country
        )
            VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
        `,
      [user_id, name, contact_id, street, postal_code, city, country],
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("addSupplier error:", error);
    if (error.code === "23505") {
      return res
        .status(400)
        .json({ error: "Supplier name already exists for this user" });
    }
    if (error.code === "23503") {
      return res
        .status(400)
        .json({ error: "Referenced contact_id does not exist" });
    }
    return res.status(500).json({ error: error.message });
  }
};
