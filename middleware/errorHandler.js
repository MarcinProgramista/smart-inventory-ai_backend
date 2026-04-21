import { logEvents } from "./logger.js";

export const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");

  console.error("❌ ERROR:", err);

  res.status(500).json({
    status: "error",
    message: err.message,
  });
};
