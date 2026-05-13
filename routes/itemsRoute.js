import express from "express";
import {
  getAllItems,
  addItem,
  deleteItem,
} from "../controllers/itemsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getAllItems);
router.post("/", verifyJWT, addItem);
router.delete("/:id", verifyJWT, deleteItem);
export default router;
