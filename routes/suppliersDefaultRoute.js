import express from "express";
import {
  getSuppliersDefault,
  addSupplierDefault,
  updateSupplierDefault,
  deleteSupplierDefault,
} from "../controllers/suppliersDefaultController.js";

const router = express.Router();

router.get("/", getSuppliersDefault);
router.post("/", addSupplierDefault);
router.put("/:id", updateSupplierDefault);
router.delete("/:id", deleteSupplierDefault);

export default router;
