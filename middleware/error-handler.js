const { customAPIError } = require("../error/custom-error");
const errorMiddleware = (err, req, res, next) => {
  if (err instanceof customAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  res.status(500).json({ msg: err.message });
};
module.exports = errorMiddleware;
