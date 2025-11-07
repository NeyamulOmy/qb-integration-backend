const { Router } = require("express");
const { asyncHandler } = require("../middleware/asyncHandler");
const { authStart, authCallback, qboState } = require("../controllers/qbo.controller");

const r = Router();
r.get("/start", asyncHandler(authStart));
r.get("/callback", asyncHandler(authCallback));
r.get("/state", asyncHandler(qboState));

module.exports = r;
