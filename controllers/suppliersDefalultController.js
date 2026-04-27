import { db } from "../db.js";

/* =============
    Ger all suppliers
================*/
export const getSuppliersDefault = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM suppliers_default ORDER BY name ASC",
    );
    res.json(result.rows);
  } catch (error) {
    console.log("getSuppliers error:", error);
    res.status(500).json({ error: error.message });
  }
};
