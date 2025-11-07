const { z } = require("zod");

const createInvoiceSchema = z.object({
  clientName: z.string().trim().min(3).max(80),
  email: z.email(),
  dueDate: z.string().refine(v => !Number.isNaN(Date.parse(v)), "Invalid dueDate"),
  amount: z.union([z.string(), z.number()])
           .transform(v => Number(v))
           .refine(v => Number.isFinite(v) && v > 0, "Amount must be > 0"),
  status: z.enum(["Draft", "Paid"]).optional(),
  description: z.string().max(500).optional(),
  syncToQBO: z.boolean().optional(),
});

module.exports = { createInvoiceSchema };