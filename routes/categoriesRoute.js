import express from "express";
import {
  getCategories,
  addCategory,
} from "../controllers/categoriesController.js";
import verifyJWT from "../middleware/verifyJWT.js";
const router = express.Router();

router.get("/", getCategories);
router.post("/", verifyJWT, addCategory);

export default router;
