import { z } from 'zod'

// Personal information the signed-in member can change themselves: their
// name and phone number. Email stays read-only — it is the sign-in identity,
// so changing it here would orphan the session. An empty phone clears the
// stored number (sign-up never collects one, so most accounts start blank).
export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.').max(80),
  phone: z
    .string()
    .trim()
    .max(32)
    .refine(
      (value) =>
        value === '' ||
        (/^[+]?[\d\s\-()]{6,20}$/.test(value) && value.replace(/\D/g, '').length >= 6),
      { message: 'Please use a valid phone number.' },
    )
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
})

export type ProfileInput = z.infer<typeof profileSchema>
