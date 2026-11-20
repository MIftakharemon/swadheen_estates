import { describe, expect, it } from 'vitest'
import { registerSchema } from '@/features/auth/schemas/register.schema'

describe('register schema', () => {
  it('accepts a valid sign-up and normalises the email', () => {
    const result = registerSchema.safeParse({
      name: 'Nusrat Jahan',
      email: '  Nusrat@Example.COM ',
      password: 'a-very-long-password',
      confirmPassword: 'a-very-long-password',
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.email).toBe('nusrat@example.com')
  })

  it('rejects short names and malformed emails', () => {
    const result = registerSchema.safeParse({
      name: 'N',
      email: 'not-an-email',
      password: 'a-very-long-password',
      confirmPassword: 'a-very-long-password',
    })
    expect(result.success).toBe(false)
  })

  it('rejects passwords shorter than the eight-character floor', () => {
    const result = registerSchema.safeParse({
      name: 'Nusrat Jahan',
      email: 'nusrat@example.com',
      password: '1234567',
      confirmPassword: '1234567',
    })
    expect(result.success).toBe(false)
  })

  it('accepts a password of exactly eight characters', () => {
    const result = registerSchema.safeParse({
      name: 'Nusrat Jahan',
      email: 'nusrat@example.com',
      password: '12345678',
      confirmPassword: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejects mismatched password confirmation', () => {
    const result = registerSchema.safeParse({
      name: 'Nusrat Jahan',
      email: 'nusrat@example.com',
      password: 'a-very-long-password',
      confirmPassword: 'a-different-password',
    })
    expect(result.success).toBe(false)
  })
})
