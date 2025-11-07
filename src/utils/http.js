class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status || 500;
  }
}
const http = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL: 500,
};
module.exports = { HttpError, http };