import express from "express";
import { getSuppliersDefault } from "../controllers/suppliersDefalultController.js";

const router = express.Router();

router.get("/", getSuppliersDefault);

export default router;
