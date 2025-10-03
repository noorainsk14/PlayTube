export function responseFormatter(req, res, next) {
  const originalJson = res.json;

  res.json = function (data) {
    // If data already looks like an ApiResponse, send as is
    if (data && data.statusCode && typeof data.success === "boolean") {
      return originalJson.call(this, data);
    }

    // Default success response wrapper
    const statusCode =
      res.statusCode >= 200 && res.statusCode < 300 ? res.statusCode : 200;

    const responsePayload = {
      statusCode,
      success: true,
      message: data?.message || "Request successful",
      data: data?.data || data,
    };

    return originalJson.call(this, responsePayload);
  };

  next();
}
