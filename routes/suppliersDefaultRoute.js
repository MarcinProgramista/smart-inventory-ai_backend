import express from "express";
import {
  getSuppliersDefault,
  addSupplierDefault,
  updateSupplierDefault,
} from "../controllers/suppliersDefaultController.js";

const router = express.Router();

router.get("/", getSuppliersDefault);
router.post("/", addSupplierDefault);
router.put("/:id", updateSupplierDefault);
export default router;
