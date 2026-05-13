import express from "express";
import { getAllItems, addItem } from "../controllers/itemsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getAllItems);
router.post("/", verifyJWT, addItem);
export default router;
