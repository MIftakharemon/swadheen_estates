import { z } from 'zod'

export const publicLeadSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.').max(80),
  phone: z.string().trim().min(7, 'Please add a phone number.').max(30),
  email: z.string().trim().email('Please use a valid email address.').max(160),
  note: z.string().trim().max(1000).optional().default(''),
  propertyId: z.string().trim().max(80).optional(),
  propertySlug: z.string().trim().max(120).optional(),
  honeypot: z.string().max(0).optional().default(''),
})

export type PublicLeadInput = z.infer<typeof publicLeadSchema>
