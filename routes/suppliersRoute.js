import express from "express";
import {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
  searchSuppliersAdvanced,
} from "../controllers/suppliersController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getSuppliers);
router.get("/search", verifyJWT, searchSuppliersAdvanced);
router.post("/", verifyJWT, addSupplier);
router.patch("/:id", verifyJWT, updateSupplier);
router.delete("/:id", verifyJWT, deleteSupplier);

export default router;
