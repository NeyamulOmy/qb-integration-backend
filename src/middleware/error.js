const { logger } = require("../utils/logger");
const { HttpError } = require("../utils/http");

// Centralized error responder. Never leak secrets/tokens.
function errorHandler(err, _req, res, _next) {
  const status = err instanceof HttpError ? err.status : 500;
  const message = err.message || "Internal Server Error";
  if (status >= 500) logger.error({ err }, "Unhandled error");
  return res.status(status).json({ error: message });
}

module.exports = { errorHandler };