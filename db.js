import pg from "pg";
import env from "dotenv";

env.config();

export const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// 🔌 Connect to DB
db.connect()
  .then(() => console.log("📦 Successfully connected to database"))
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });

// ⚠️ Unexpected DB errors
db.on("error", (err) => {
  console.error("❗Unexpected database error:", err);
  process.exit(1);
});

// 🧹 Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Closing database connection...`);
  try {
    await db.end();
    console.log("✔️ Database connection closed successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing database connection:", err);
    process.exit(1);
  }
};

db.query("SELECT current_database()").then((res) => {
  console.log("📌 Connected to DB:", res.rows[0].current_database);
});
// Linux/macOS system signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// 💥 Unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  gracefulShutdown("UNHANDLED_REJECTION");
});

export default db;
