import { db } from "../db.js";
import { normalizeSupplierPayload } from "../utils/validators/normalizeSupplierDefault.js";
import { validateSupplierDefault } from "../utils/validators/validateSupplierDefault.js";

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

/* =============
    Add supplier
================*/
export const addSupplierDefault = async (req, res) => {
  try {
    const payload = normalizeSupplierPayload(req.body);
    const errors = validateSupplierDefault(payload);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { name, street, contact, email, phone, postal_code, city, country } =
      payload;

    const result = await db.query(
      `
      INSERT INTO suppliers_default (
        name,  street, contact, email, phone, postal_code, city, country
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [name, street, contact, email, phone, postal_code, city, country],
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log("addSupplierDefault error:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "Supplier name already exists " });
    }

    return res.status(500).json({ error: error.message });
  }
};
