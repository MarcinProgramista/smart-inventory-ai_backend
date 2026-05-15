import express from "express";
import {
  getAllItems,
  addItem,
  deleteItem,
  updateItem,
  searchItemsAdvanced,
} from "../controllers/itemsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getAllItems);
router.get("/search", verifyJWT, searchItemsAdvanced);
router.post("/", verifyJWT, addItem);
router.patch("/:id", verifyJWT, updateItem);
router.delete("/:id", verifyJWT, deleteItem);
export default router;
