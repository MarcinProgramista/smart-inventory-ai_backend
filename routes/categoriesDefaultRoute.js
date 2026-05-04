import express from "express";

import {
  getCategoriesDefault,
  addCategoryDefault,
  updateCategoryDefault,
} from "../controllers/categoriesDefaultController.js";

const router = express.Router();

router.get("/", getCategoriesDefault);
router.post("/", addCategoryDefault);
router.put("/:id", updateCategoryDefault);

export default router;
