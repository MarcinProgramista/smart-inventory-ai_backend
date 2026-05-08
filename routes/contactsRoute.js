import express from "express";
import {
  addContact,
  getAllContacts,
} from "../controllers/contactsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getAllContacts);
router.post("/", verifyJWT, addContact);
export default router;
