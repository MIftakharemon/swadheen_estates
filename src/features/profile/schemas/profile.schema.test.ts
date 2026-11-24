import { describe, expect, it } from 'vitest'
import { profileSchema } from '@/features/profile/schemas/profile.schema'

describe('profile schema', () => {
  it('accepts a name and phone number', () => {
    const result = profileSchema.safeParse({ name: 'Swadheen Ahmed', phone: '+880 1712-345678' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Swadheen Ahmed')
      expect(result.data.phone).toBe('+880 1712-345678')
    }
  })

  it('accepts a missing or empty phone and stores it as null', () => {
    const missing = profileSchema.safeParse({ name: 'Swadheen Ahmed' })
    expect(missing.success).toBe(true)
    if (missing.success) expect(missing.data.phone).toBe(null)

    const empty = profileSchema.safeParse({ name: 'Swadheen Ahmed', phone: '   ' })
    expect(empty.success).toBe(true)
    if (empty.success) expect(empty.data.phone).toBe(null)
  })

  it('trims the name', () => {
    const result = profileSchema.safeParse({ name: '  Swadheen Ahmed  ', phone: '' })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.name).toBe('Swadheen Ahmed')
  })

  it('rejects a one-character name', () => {
    const result = profileSchema.safeParse({ name: 'S', phone: '+8801712345678' })
    expect(result.success).toBe(false)
  })

  it('rejects a phone number with letters or too few digits', () => {
    expect(profileSchema.safeParse({ name: 'Swadheen Ahmed', phone: 'call me' }).success).toBe(false)
    expect(profileSchema.safeParse({ name: 'Swadheen Ahmed', phone: '12345' }).success).toBe(false)
  })
})
