import express from "express";
import {
  addSupplier,
  getSuppliers,
  updateSupplier,
} from "../controllers/suppliersController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getSuppliers);
router.post("/", verifyJWT, addSupplier);
router.patch("/:id", verifyJWT, updateSupplier);

export default router;
