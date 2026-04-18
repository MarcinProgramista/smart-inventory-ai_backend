import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { corsOptions } from "./config/corsOptions.js";
import db from "./db.js";
import { logger } from "./middleware/logger.js";
dotenv.config();
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);
// Test route
app.get("/", (req, res) => {
  res.send("Smart InventoryAI API is running...");
});

app.post("/echo", (req, res) => {
  res.json({
    received: req.body,
  });
});

// Full health status
app.get("/health", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      status: "healthy",
      db: "connected",
      time: result.rows[0].now,
    });
  } catch (err) {
    res.status(503).json({
      status: "unhealthy",
      db: "disconnected",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
