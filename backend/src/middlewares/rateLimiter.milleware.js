import rateLimit from "express-rate-limit";

export const standardRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // VERY strict
  message: {
    success: false,
    message: "Too many auth attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
