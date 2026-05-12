import { db } from "../db.js";

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
