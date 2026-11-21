import 'server-only'
import type { Property } from '@/types/property'
import type { Project } from '@/types/project'
import { getPropertyBySlug, properties as staticProperties } from '@/data/properties'
import { staticProjects } from '@/data/projects'
import { env } from '@/lib/env'
import { mapDbProperty } from './db-property.mapper'

// Every public listing query funnels through here. The database is the source
// of truth once the catalogue is synced; a missing DATABASE_URL (or a query
// failure) degrades to the static catalogue instead of breaking the page.

const propertyOrder = [{ sortOrder: 'asc' }, { createdAt: 'asc' }] as const

function logFailure(scope: string, error: unknown) {
  console.error(scope, error instanceof Error ? error.message : 'unknown error')
}

function mapProject(row: {
  id: string
  slug: string
  name: string
  location: string
  description: string
  coverImage: string
  totalUnits: number
  deliveredAt: Date | null
  updatedAt: Date
  _count?: { properties?: number }
}): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    location: row.location,
    description: row.description,
    coverImage: row.coverImage,
    totalUnits: row.totalUnits,
    deliveredAt: row.deliveredAt ? row.deliveredAt.toISOString() : null,
    propertyCount: row._count?.properties ?? 0,
    updatedAt: row.updatedAt.toISOString(),
  }
}

// Published listings for the public catalogue. Returns null when there is no
// usable database so callers can fall back to the static catalogue; an empty
// array means "the admin removed everything" and is respected as such.
export async function getPublishedProperties(): Promise<Property[] | null> {
  if (!env.DATABASE_URL) return null
  try {
    const { db } = await import('@/lib/db')
    const rows = await db.property.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: propertyOrder,
      include: { project: { select: { name: true, slug: true } } },
    })
    if (rows.length === 0 && staticProperties.length > 0) {
      const total = await db.property.count()
      if (total === 0) return null // unsynced database → static catalogue
    }
    return rows.map(mapDbProperty)
  } catch (error) {
    logFailure('published_properties_failed', error)
    return null
  }
}

// Single listing for a detail page. Distinguishes "unpublished/deleted in the
// admin" (404) from "no database yet" (static fallback) so an admin removal
// never reappears from the static catalogue.
export async function resolvePublicProperty(slug: string): Promise<Property | null> {
  const fallback = () => getPropertyBySlug(slug) ?? null
  if (!env.DATABASE_URL) return fallback()
  try {
    const { db } = await import('@/lib/db')
    const row = await db.property.findUnique({
      where: { slug },
      include: { project: { select: { name: true, slug: true } } },
    })
    if (row) return row.status === 'PUBLISHED' ? mapDbProperty(row) : null
    const total = await db.property.count()
    return total === 0 ? fallback() : null
  } catch (error) {
    logFailure('resolve_public_property_failed', error)
    return fallback()
  }
}

// All projects for the public Projects section (DB is authoritative; the
// static catalogue covers setups without a database).
export async function getPublicProjects(): Promise<Project[] | null> {
  if (!env.DATABASE_URL) return null
  try {
    const { db } = await import('@/lib/db')
    const rows = await db.project.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { properties: true } } },
    })
    if (rows.length === 0 && staticProjects.length > 0) return null
    return rows.map(mapProject)
  } catch (error) {
    logFailure('public_projects_failed', error)
    return null
  }
}

export async function resolvePublicProject(slug: string): Promise<Project | null> {
  const fallback = () => staticProjects.find((project) => project.slug === slug) ?? null
  if (!env.DATABASE_URL) return fallback()
  try {
    const { db } = await import('@/lib/db')
    const row = await db.project.findUnique({
      where: { slug },
      include: { _count: { select: { properties: true } } },
    })
    if (row) return mapProject(row)
    const total = await db.project.count()
    return total === 0 ? fallback() : null
  } catch (error) {
    logFailure('resolve_public_project_failed', error)
    return fallback()
  }
}

// The listings shown inside a project page, matched by project relation or by
// the projectSlug kept in webFields (projects created before the relation was
// set). Null → caller uses the static catalogue.
export async function getProjectProperties(slug: string): Promise<Property[] | null> {
  if (!env.DATABASE_URL) return null
  try {
    const { db } = await import('@/lib/db')
    const project = await db.project.findUnique({ where: { slug }, select: { id: true } })
    const rows = await db.property.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { projectId: project?.id ?? '__no_project__' },
          { webFields: { path: ['projectSlug'], equals: slug } },
        ],
      },
      orderBy: propertyOrder,
      include: { project: { select: { name: true, slug: true } } },
    })
    if (rows.length === 0 && staticProperties.some((item) => item.projectSlug === slug)) {
      const total = await db.property.count()
      if (total === 0) return null
    }
    return rows.map(mapDbProperty)
  } catch (error) {
    logFailure('project_properties_failed', error)
    return null
  }
}
