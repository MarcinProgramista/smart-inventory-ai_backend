import { allowedOrigins } from "./allowedOrigins.js";

const corsOptions = {
  origin: (origin, callback) => {
    // 🔹 Zezwól na brak origin podczas developmentu (Postman, Python, curl)
    if (!origin && process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    // 🔹 Sprawdź, czy origin znajduje się na liście
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
  optionsSuccessStatus: 200,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  exposedHeaders: ["Authorization"],

  maxAge: 86400, // cache preflight na 24h
};

export { corsOptions };
