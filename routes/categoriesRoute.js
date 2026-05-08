import express from "express";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getCategories);
router.post("/", verifyJWT, addCategory);
router.patch("/", verifyJWT, updateCategory);
router.delete("/:id", verifyJWT, deleteCategory);

export default router;
