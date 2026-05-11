import express from "express";
import {
  addSupplier,
  getSuppliers,
} from "../controllers/suppliersController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getSuppliers);
router.post("/", verifyJWT, addSupplier);
export default router;
