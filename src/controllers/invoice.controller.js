const { HttpError, http } = require("../utils/http");
const { createInvoice, listInvoices } = require("../services/invoice.service");
const { createInvoiceSchema } = require("../validators/invoice.schema");

// GET /invoices
async function getInvoices(_req, res) {
  const rows = await listInvoices();
  return res.json(rows);
}

// POST /invoices
async function postInvoice(req, res) {
  const parsed = createInvoiceSchema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    throw new HttpError(http.BAD_REQUEST, first?.message || "Invalid payload");
  }
  const saved = await createInvoice(parsed.data);
  return res.status(201).json(saved);
}

module.exports = { getInvoices, postInvoice };
