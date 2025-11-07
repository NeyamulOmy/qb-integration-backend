const { Router } = require("express");
const router = Router();
router.use("/auth/qbo", require("./qbo.routes"));


module.exports = router;
