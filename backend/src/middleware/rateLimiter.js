/**
 * Lightweight in-memory rate limiter middleware
 * Protects endpoints from abusive polling or request flooding.
 */

const requestCounts = new Map(); // key -> [timestamps]

const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute
  const maxRequests = options.max || 120; // 120 requests per minute

  return (req, res, next) => {
    const key = req.ip || req.headers['x-forwarded-for'] || req.user?._id || 'global';
    const now = Date.now();

    let timestamps = requestCounts.get(key) || [];
    // Prune requests older than windowMs
    timestamps = timestamps.filter((time) => now - time < windowMs);

    if (timestamps.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please slow down to preserve attention and system bandwidth.',
        retryAfterSeconds: Math.ceil(windowMs / 1000)
      });
    }

    timestamps.push(now);
    requestCounts.set(key, timestamps);
    next();
  };
};

module.exports = rateLimiter;
