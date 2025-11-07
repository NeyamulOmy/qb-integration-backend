
const express = require("express");
const cookieParser = require("cookie-parser");
const { corsMiddleware } = require("./middleware/cors");
const app = express();
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_, res) => res.json({ ok: true }));

module.exports = { app };
