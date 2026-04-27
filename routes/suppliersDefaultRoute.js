import express from "express";
import {
  getSuppliersDefault,
  addSupplierDefault,
} from "../controllers/suppliersDefalultController.js";

const router = express.Router();

router.get("/", getSuppliersDefault);
router.post("/", addSupplierDefault);
export default router;
