
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_, res) => res.json({ ok: true }));

module.exports = { app };
