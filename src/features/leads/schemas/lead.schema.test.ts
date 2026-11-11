import { describe, expect, it } from 'vitest'
import { publicLeadSchema } from '@/features/leads/schemas/lead.schema'

describe('public lead schema', () => {
  it('accepts the minimum valid enquiry', () => {
    const result = publicLeadSchema.safeParse({
      name: 'Nusrat Jahan',
      phone: '+8801712345678',
      email: 'nusrat@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('rejects malformed email and short phone values', () => {
    const result = publicLeadSchema.safeParse({ name: 'N', phone: '123', email: 'not-email' })
    expect(result.success).toBe(false)
  })

  it('rejects a filled honeypot field', () => {
    const result = publicLeadSchema.safeParse({
      name: 'A valid name',
      phone: '+8801712345678',
      email: 'a@example.com',
      honeypot: 'bot',
    })
    expect(result.success).toBe(false)
  })
})
