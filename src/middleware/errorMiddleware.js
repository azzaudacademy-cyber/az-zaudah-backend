export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(res.statusCode || 500).json({
    error: err.message || "Server error"
  });
};
