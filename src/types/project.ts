// Web-facing project shape — the DB Project model plus derived counts, shared
// by the public Projects section and the admin panel.
export type Project = {
  id: string
  slug: string
  name: string
  location: string
  description: string
  coverImage: string
  totalUnits: number
  deliveredAt?: string | null
  propertyCount?: number
  updatedAt?: string
}
