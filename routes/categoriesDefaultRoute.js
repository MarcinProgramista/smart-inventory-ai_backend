import express from "express";

import { getCategoriesDefault } from "../controllers/categoriesDefaultController.js";

const router = express.Router();

router.get("/", getCategoriesDefault);

export default router;
