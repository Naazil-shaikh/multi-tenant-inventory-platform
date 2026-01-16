export const errorHandler = (err, req, res, next) => {
  console.error(" GLOBAL ERROR HANDLER ");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("Status:", err.statusCode || 500);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
