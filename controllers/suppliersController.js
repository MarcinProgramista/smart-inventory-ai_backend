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
