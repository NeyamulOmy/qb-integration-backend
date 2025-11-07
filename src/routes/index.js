const { Router } = require("express");
const router = Router();
router.use("/auth/qbo", require("./qbo.routes"));
router.use("/invoices", require("./invoice.routes"));

module.exports = router;
