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
    const errors = validateSupplierDefault(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const payload = normalizeSupplierPayload(req.body);

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
      return res.status(409).json({ error: "Supplier name already exists" });
    }

    return res.status(500).json({ error: error.message });
  }
};

/* =============
    update supplier_default
================*/
export const updateSupplierDefault = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. walidacja
    const errors = validateSupplierDefault(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // 2. normalizacja
    const payload = normalizeSupplierPayload(req.body);

    const { name, street, contact, email, phone, postal_code, city, country } =
      payload;

    // 3. update
    const result = await db.query(
      `
      UPDATE suppliers_default
      SET 
        name = $1,
        street = $2,
        contact = $3,
        email = $4,
        phone = $5,
        postal_code = $6,
        city = $7,
        country = $8
      WHERE id = $9
      RETURNING *
      `,
      [name, street, contact, email, phone, postal_code, city, country, id],
    );

    // 4. czy istnieje
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // 5. response
    return res.json(result.rows[0]);
  } catch (error) {
    console.log("updateSupplierDefault error:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "Supplier name already exists" });
    }

    return res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE SUPPLIER DEFAULT
 */
export const deleteSupplierDefault = async (req, res) => {
  const idNum = Number(req.params.id);

  if (!Number.isInteger(idNum) || idNum <= 0) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const result = await db.query(
      "DELETE FROM suppliers_default WHERE id = $1 RETURNING *",
      [idNum],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("deleteSupplierDefault error:", error);
    return res.status(500).json({ error: error.message });
  }
};
