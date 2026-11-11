type Entry = { count: number; resetAt: number }

const buckets = new Map<string, Entry>()

export type RateLimitResult = { allowed: boolean; remaining: number; resetAt: number }

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)
  const entry = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + windowMs }
  entry.count += 1
  buckets.set(key, entry)
  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
  }
}

export function resetRateLimits() {
  buckets.clear()
}
