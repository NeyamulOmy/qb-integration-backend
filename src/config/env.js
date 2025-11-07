
require("dotenv").config();
const { z } = require("zod");

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5050"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),
  QBO_CLIENT_ID: z.string().min(1),
  QBO_CLIENT_SECRET: z.string().min(1),
  QBO_REDIRECT_URL: z.string().url(),
  QBO_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
});

const env = EnvSchema.parse(process.env);
const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map(s => s.trim());

module.exports = { env, allowedOrigins };
