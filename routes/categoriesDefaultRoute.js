import express from "express";

import {
  getCategoriesDefault,
  addCategoryDefault,
} from "../controllers/categoriesDefaultController.js";

const router = express.Router();

router.get("/", getCategoriesDefault);
router.post("/", addCategoryDefault);

export default router;
