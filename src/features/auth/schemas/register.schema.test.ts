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

  it('rejects passwords shorter than the credentials provider minimum', () => {
    const result = registerSchema.safeParse({
      name: 'Nusrat Jahan',
      email: 'nusrat@example.com',
      password: 'short',
      confirmPassword: 'short',
    })
    expect(result.success).toBe(false)
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
