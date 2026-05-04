import express from "express";

import {
  getCategoriesDefault,
  addCategoryDefault,
  updateCategoryDefault,
  deleteCategoryDefault,
} from "../controllers/categoriesDefaultController.js";

const router = express.Router();

router.get("/", getCategoriesDefault);
router.post("/", addCategoryDefault);
router.put("/:id", updateCategoryDefault);
router.delete("/:id", deleteCategoryDefault);

export default router;
