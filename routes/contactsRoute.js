import express from "express";
import {
  addContact,
  getAllContacts,
  updateContact,
  deleteContact,
  getContact,
  searchContactsAdvanced,
} from "../controllers/contactsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getAllContacts);

router.get("/search", verifyJWT, searchContactsAdvanced);

router.get("/:id", verifyJWT, getContact);

router.post("/", verifyJWT, addContact);

router.patch("/:id", verifyJWT, updateContact);

router.delete("/:id", verifyJWT, deleteContact);
export default router;
