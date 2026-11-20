import { z } from 'zod'

// Public sign-up input. The password floor (8) matches the credentials
// provider in src/auth.ts so a fresh account can always sign in.
export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Please tell us your name.').max(80),
    email: z.string().trim().toLowerCase().email('Please use a valid email address.').max(160),
    password: z.string().min(8, 'Please use at least 8 characters.').max(128),
    confirmPassword: z.string().min(8, 'Please use at least 8 characters.').max(128),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'The passwords do not match.',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
