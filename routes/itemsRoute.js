import express from "express";
import { getAllItems } from "../controllers/itemsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getAllItems);

export default router;
