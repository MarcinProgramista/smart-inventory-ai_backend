import express from "express";
import { getSuppliers } from "../controllers/suppliersController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.get("/", verifyJWT, getSuppliers);
export default router;
