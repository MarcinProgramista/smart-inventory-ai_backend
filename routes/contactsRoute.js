import express from "express";
import { getAllContacts } from "../controllers/contactsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getAllContacts);

export default router;
