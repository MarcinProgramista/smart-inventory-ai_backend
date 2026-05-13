import { db } from "../db.js";
import { validateItem } from "../utils/validators/itemValidator.js";
import { normalizeItem } from "../utils/validators/normalizeItem.js";

/**
 * get all itmes
 */
export const getAllItems = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        error: "user_id required",
      });
    }

    const query = `
      SELECT 
        i.id,
        i.user_id,
        i.name,
        i.quantity,
        i.min_quantity,
        i.price,
        i.description,
        i.created_at,
        i.supplier_id,

        s.name AS supplier_name,

        c.first_name AS contact_first_name,
        c.last_name AS contact_last_name,
        c.mobile_phone AS contact_phone,
        c.email AS contact_email

      FROM items i

      LEFT JOIN suppliers s 
        ON s.id = i.supplier_id

      LEFT JOIN contacts c 
        ON c.id = s.contact_id

      WHERE i.user_id = $1

      ORDER BY i.created_at DESC;
    `;

    const { rows } = await db.query(query, [userId]);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("getAllItems error:", error);

    return res.status(500).json({
      error: "Failed to fetch items",
    });
  }
};

/**
 * add item
 */
export const addItem = async (req, res) => {
  const userId = Number(req.user.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      error: "user_id required",
    });
  }
  const payload = normalizeItem(req.body);
  const errors = validateItem(payload);
  if (errors.length > 0) return res.status(400).json({ errors });

  try {
    const result = await db.query(
      `
        INSERT INTO items
          (user_id, category_id, name, quantity, min_quantity, supplier_id, price, description)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (name, supplier_id, user_id)
        DO UPDATE SET quantity = items.quantity + EXCLUDED.quantity
        RETURNING *, (xmax = 0) AS created;
      `,
      [
        userId,
        payload.category_id,
        payload.name,
        payload.quantity,
        payload.min_quantity,
        payload.supplier_id,
        payload.price,
        payload.description,
      ],
    );
    const item = result.rows[0];

    // Pobierz pełne dane z JOIN
    const fullData = await db.query(
      `
      SELECT 
        i.*,
        s.name AS supplier_name,
        c.name AS category_name
      FROM items i
      LEFT JOIN suppliers s ON s.id = i.supplier_id
      LEFT JOIN categories c ON c.id = i.category_id
      WHERE i.id = $1
      `,
      [item.id],
    );
    const fullItem = fullData.rows[0];

    if (item.created) {
      return res.status(201).json({
        id: fullItem.id,
        item: fullItem,
        created: true,
        updated: false,
      });
    } else {
      return res.status(200).json({
        id: fullItem.id,
        item: fullItem,
        created: false,
        updated: true,
      });
    }
  } catch (error) {
    console.error("addItem error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
