const cors = require("cors");
const { allowedOrigins } = require("../config/env");

// Handles wildcard dev tools (no Origin) and a strict allowlist in prod
const corsMiddleware = cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);             // Postman/cURL
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
});

module.exports = { corsMiddleware };
