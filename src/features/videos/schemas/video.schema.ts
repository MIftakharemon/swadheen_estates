import { z } from 'zod'

export const videoKindSchema = z.enum(['SHORT', 'VIDEO'])

export const videoInputSchema = z.object({
  projectSlug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/),
  kind: videoKindSchema,
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).default(''),
  youtubeUrl: z.string().trim().url().max(500),
  published: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(999).default(0),
})

export type VideoInput = z.infer<typeof videoInputSchema>

export function parseYouTubeUrl(
  value: string,
): { youtubeId: string; normalizedUrl: string; thumbnailUrl: string } | null {
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '')
    if (host !== 'youtube.com' && host !== 'youtu.be') return null
    const segments = url.pathname.split('/').filter(Boolean)
    const id =
      host === 'youtu.be'
        ? segments[0]
        : (url.searchParams.get('v') ??
          (segments[0] === 'shorts' || segments[0] === 'embed' || segments[0] === 'live'
            ? segments[1]
            : undefined))
    if (!id || !/^[A-Za-z0-9_-]{6,20}$/.test(id)) return null
    return {
      youtubeId: id,
      normalizedUrl: `https://www.youtube.com/watch?v=${id}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    }
  } catch {
    return null
  }
}
