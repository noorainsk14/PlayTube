// middlewares/errorHandler.js
import { ApiError } from "../utils/ApiError.js";

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.error,
    });
  }

  console.error(err); // log unexpected errors

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}

export default errorHandler;
