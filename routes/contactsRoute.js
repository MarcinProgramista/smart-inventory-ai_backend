import express from "express";
import {
  addContact,
  getAllContacts,
  updateContact,
  deleteContact,
  getContact,
} from "../controllers/contactsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getAllContacts);
router.post("/", verifyJWT, addContact);
router.patch("/:id", verifyJWT, updateContact);
router.delete("/:id", verifyJWT, deleteContact);
router.get("/:id", verifyJWT, getContact);
export default router;
