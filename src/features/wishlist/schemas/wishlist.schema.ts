import { z } from 'zod'

export const wishlistToggleSchema = z.object({
  slug: z.string().trim().min(1, 'Please send a property.').max(120),
})

export type WishlistToggleInput = z.infer<typeof wishlistToggleSchema>
