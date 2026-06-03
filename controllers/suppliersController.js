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
        user_id,
        name,
        contact_id,
        street,
        postal_code,
        city,
        country
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
      return res.status(400).json({
        errors: ["Supplier name already exists"],
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        errors: ["Referenced contact_id does not exist"],
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * update supplier
 */
export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({
      error: "Invalid supplier id",
    });
  }
  try {
    const errors = validateSupplier(req.body, { isUpdate: true });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const payload = normalizeSupplier(req.body);
    const { name, contact_id, street, postal_code, city, country } = payload;
    const result = await db.query(
      `
        UPDATE suppliers
        SET 
            name = $1,
            contact_id = $2,
            street = $3,
            postal_code = $4,
            city = $5,
            country = $6
        WHERE id = $7
        RETURNING *
        `,
      [name, contact_id, street, postal_code, city, country, id],
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    return res.json({
      updated: true,
      supplier: result.rows[0],
    });
  } catch (error) {
    console.error("updateSupplier error:", error);
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

/**
 * delete supplier
 */
export const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({
      error: "Invalid supplier id ",
    });
  }

  try {
    const result = await db.query(
      "DELETE FROM suppliers WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId],
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Supplier not found" });
    res.json({ success: true, deleted: result.rows[0] });
  } catch (error) {
    console.error("deleteSupplier error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const searchSuppliersAdvanced = async (req, res) => {
  const userId = req.user.id;

  const {
    q = "",
    country,
    city,
    sort = "name",
    order = "asc",
    page = 1,
    limit = 20,
  } = req.query;

  // =====================================
  // SORT VALIDATION
  // =====================================

  const allowedSort = ["name", "city", "country", "created_at"];

  const sortBy = allowedSort.includes(sort) ? sort : "name";

  const orderBy = order.toLowerCase() === "desc" ? "DESC" : "ASC";

  // =====================================
  // PAGINATION
  // =====================================

  const currentPage = Number(page);
  const pageLimit = Number(limit);
  const offset = (currentPage - 1) * pageLimit;

  // =====================================
  // DYNAMIC QUERY
  // =====================================

  const values = [userId];

  let where = `
    WHERE s.user_id = $1
  `;

  // =====================================
  // SEARCH
  // =====================================

  if (q.trim()) {
    values.push(`%${q}%`);

    where += `
      AND (
        s.name ILIKE $${values.length}
        OR s.city ILIKE $${values.length}
        OR s.street ILIKE $${values.length}
        OR s.postal_code ILIKE $${values.length}
        OR c.first_name ILIKE $${values.length}
        OR c.last_name ILIKE $${values.length}
        OR c.email ILIKE $${values.length}
      )
    `;
  }

  // =====================================
  // FILTER COUNTRY
  // =====================================

  if (country) {
    values.push(country);

    where += `
      AND s.country = $${values.length}
    `;
  }

  // =====================================
  // FILTER CITY
  // =====================================

  if (city) {
    values.push(`%${city}%`);

    where += `
      AND s.city ILIKE $${values.length}
    `;
  }

  try {
    // =====================================
    // DATA QUERY
    // =====================================

    const dataQuery = `
      SELECT
        s.*,
        c.first_name,
        c.last_name,
        c.email,
        c.mobile_phone
      FROM suppliers s
      LEFT JOIN contacts c
        ON c.id = s.contact_id
      ${where}
      ORDER BY s.${sortBy} ${orderBy}
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `;

    // =====================================
    // COUNT QUERY
    // =====================================

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM suppliers s
      LEFT JOIN contacts c
        ON c.id = s.contact_id
      ${where}
    `;

    // =====================================
    // EXECUTE
    // =====================================

    const [dataResult, countResult] = await Promise.all([
      db.query(dataQuery, [...values, pageLimit, offset]),
      db.query(countQuery, values),
    ]);

    // =====================================
    // RESPONSE
    // =====================================

    return res.json({
      page: currentPage,
      limit: pageLimit,
      total: Number(countResult.rows[0].total),
      items: dataResult.rows,
    });
  } catch (error) {
    console.error("searchSuppliersAdvanced error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};
