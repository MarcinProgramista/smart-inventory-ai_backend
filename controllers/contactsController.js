import { db } from "../db.js";
import { validateContact } from "../utils/validators/contactValidator.js";
import { normalizeContactPayload } from "../utils/validators/normalizeContact.js";

/**
 * get all contacts
 */
export const getAllContacts = async (req, res) => {
  const userId = Number(req.user.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: "user_id required" });
  }
  try {
    const result = await db.query(
      "SELECT * FROM contacts WHERE user_id = $1 ORDER BY last_name ASC",
      [userId],
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("getContacts error:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * add contact
 */
export const addContact = async (req, res) => {
  try {
    const errors = validateContact(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const payload = normalizeContactPayload(req.body);

    const { user_id, first_name, last_name, role, mobile_phone, email } =
      payload;

    const result = await db.query(
      "INSERT INTO contacts (user_id, first_name, last_name, role, mobile_phone, email) VALUES ($1,$2,$3,$4,$5,$6)  RETURNING *",
      [user_id, first_name, last_name, role, mobile_phone, email],
    );
    return res.status(201).json({
      message: "Contact created successfully",
      contact: result.rows[0],
    });
  } catch (error) {
    console.error("addContact error:", error);
    //duplikaty email
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ field: "email", message: "Email already exists" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * update contact
 */
export const updateContact = async (req, res) => {
  const { id } = req.params;

  try {
    const errors = validateContact(req.body, { isUpdate: true });

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const payload = normalizeContactPayload(req.body);

    const { first_name, last_name, role, mobile_phone, email } = payload;

    // user z JWT
    const user_id = req.user.id;

    const result = await db.query(
      `
      UPDATE contacts
      SET first_name = $1,
          last_name = $2,
          role = $3,
          mobile_phone = $4,
          email = $5,
          user_id = $6,
          updated_at = NOW()
        WHERE id = $7 AND user_id = $8
      RETURNING *
      `,
      [first_name, last_name, role, mobile_phone, email, user_id, id, user_id],
    );

    if (!result.rows.length) {
      return res.status(404).json({
        error: "Contact not found",
      });
    }

    return res.json({
      updated: true,
      contact: result.rows[0],
      message: "Contact updated successfully",
    });
  } catch (error) {
    console.error("updateContact error:", error);

    if (error.code === "23505") {
      return res.status(400).json({
        errors: {
          email: "Email already exists",
        },
      });
    }

    return res.status(500).json({
      error: error.message,
    });
  }
};

/**
 * delete contact
 */
export const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM contacts WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id],
    );
    if (!result.rows.length) {
      return res.status(400).json({ error: "Contact not found" });
    }
    return res.json({
      deleted: true,
      message: `Contact ${id} deleted`,
      contact: result.rows[0],
    });
  } catch (error) {
    console.error("deleteContact error:", error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * get single contact
 */
export const getContact = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const result = await db.query(
      `
        SELECT * FROM contacts
        WHERE id = $1 AND user_id = $2
    `,
      [id, userId],
    );
    if (!result.rows.length) {
      return req.status(404).json({ error: "Contact not found" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.log("getContactById error:", error);
    return res.status(500).json({ error: error.message });
  }
};
