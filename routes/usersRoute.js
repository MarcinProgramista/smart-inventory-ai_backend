import express from "express";

import {
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUser);

export default router;
