const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(asyncHandler(req, res, next)).catch((error) => next(err));
  };
};

export { asyncHandler };
