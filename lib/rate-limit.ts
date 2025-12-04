/**
 * Simple in-memory rate limiter for protecting endpoints
 * Note: This works for single-instance deployments. For multi-instance,
 * use Redis-based rate limiting.
 */

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export type RateLimitConfig = {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
};

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds?: number;
};

/**
 * Check and update rate limit for a given key
 * @param key Unique identifier (e.g., IP address, user ID)
 * @param config Rate limit configuration
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  
  const record = rateLimitStore.get(key);
  
  // If no record or window has expired, create new record
  if (!record || record.resetAt < now) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: config.limit - 1,
      resetAt,
    };
  }
  
  // Window still active, check if limit exceeded
  if (record.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }
  
  // Increment count
  record.count++;
  rateLimitStore.set(key, record);
  
  return {
    success: true,
    remaining: config.limit - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  // Check common proxy headers
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  
  // Fallback - in production this should be from the connection
  return "unknown";
}

// Pre-configured rate limits for different endpoints
export const RATE_LIMITS = {
  // Login: 5 attempts per minute per IP
  login: { limit: 5, windowSeconds: 60 },
  // Signup: 3 attempts per 5 minutes per IP
  signup: { limit: 3, windowSeconds: 300 },
  // Password reset request: 3 per 15 minutes per IP
  passwordReset: { limit: 3, windowSeconds: 900 },
  // Seller form: 5 per hour per IP
  sellerForm: { limit: 5, windowSeconds: 3600 },
  // General API: 60 requests per minute
  api: { limit: 60, windowSeconds: 60 },
} as const;

