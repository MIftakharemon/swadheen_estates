import { beforeEach, describe, expect, it } from 'vitest'
import { checkRateLimit, resetRateLimits } from '@/lib/security/rate-limit'

describe('rate limiter', () => {
  beforeEach(() => resetRateLimits())

  it('allows requests within the window and blocks the next one', () => {
    expect(checkRateLimit('ip:one', 2).allowed).toBe(true)
    expect(checkRateLimit('ip:one', 2).allowed).toBe(true)
    expect(checkRateLimit('ip:one', 2).allowed).toBe(false)
  })

  it('keeps buckets isolated by key', () => {
    checkRateLimit('ip:one', 1)
    expect(checkRateLimit('ip:two', 1).allowed).toBe(true)
  })
})
