const { Router } = require("express");
const { asyncHandler } = require("../middleware/asyncHandler");
const { getInvoices, postInvoice } = require("../controllers/invoice.controller");

const r = Router();
r.get("/", asyncHandler(getInvoices));
r.post("/", asyncHandler(postInvoice));

module.exports = r;