import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions.js";
import db from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import { normalizeSupplierPayload } from "./utils/validators/normalizeSupplierDefault.js";
import { validateSupplierDefault } from "./utils/validators/validateSupplierDefault.js";
import suppliersDefault from "./routes/suppliersDefaultRoute.js";
import categoriesDefault from "./routes/categoriesDefaultRoute.js";
import registerRoute from "./routes/registerRoute.js";
import usersRoute from "./routes/usersRoute.js";
import loginRoute from "./routes/authRoute.js";
import categoriesRoute from "./routes/categoriesRoute.js";
import contactsRoute from "./routes/contactsRoute.js";
import supplierRoute from "./routes/suppliersRoute.js";
import itmesRoute from "./routes/itemsRoute.js";
dotenv.config();
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(logger);
app.use(cookieParser());
// Test route
app.get("/", (req, res) => {
  res.send("Smart InventoryAI API is running...");
});

app.post("/test-normalize", (req, res) => {
  try {
    const data = normalizeSupplierPayload(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/test-validate", (req, res) => {
  const errors = validateSupplierDefault(req.body);

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  res.json({ message: "OK" });
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

app.use("/api/register", registerRoute);
app.use("/api/users", usersRoute);
app.use("/api/auth", loginRoute);

app.use("/api/categories", categoriesRoute);
app.use("/api/contacts", contactsRoute);
app.use("/api/suppliers", supplierRoute);
app.use("/api/items", itmesRoute);

app.use("/api/suppliers-default", suppliersDefault);
app.use("/api/categories-default", categoriesDefault);

if (process.env.NODE_ENV !== "production") {
  app.get("/error", (req, res) => {
    throw new Error("Test error handler");
  });
}
console.log("ENV:", process.env.NODE_ENV);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
