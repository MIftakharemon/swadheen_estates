import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { can } from '@/lib/auth/rbac'
import { env } from '@/lib/env'
import { isSameOrigin } from '@/lib/security/validate-origin'
import { listingSaveSchema } from '@/features/listings/schemas/listing.schema'
import { buildPropertyWriteData,
  propertyFormToWeb,
} from '@/features/listings/services/property-persistence'
import { projectDto, propertyDto } from '@/features/listings/services/listing-dto'

// The admin workspace is staff-only; customers also hold property:read for the
// public site, so staff status is checked against the same role list the
// admin layout uses.
const STAFF_ROLES = ['SUPER_ADMIN', 'MANAGER', 'SALES_AGENT', 'CONTENT_EDITOR']

function isUniqueViolation(error: unknown): boolean {
  return (error as { code?: string })?.code === 'P2002'
}

function logFailure(scope: string, error: unknown) {
  console.error(scope, error instanceof Error ? error.message : 'unknown error')
}

async function requireStaffRead() {
  const session = await auth()
  if (!session?.user)
    return { response: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) }
  const role = session.user.role
  if (!role || !STAFF_ROLES.includes(role) || !can({ userId: session.user.id, role }, 'property:read'))
    return {
      response: NextResponse.json({ error: 'You do not have permission to view listings.' }, { status: 403 }),
    }
  return { session }
}

async function requireWrite(request: Request) {
  if (!isSameOrigin(request))
    return { response: NextResponse.json({ error: 'Request not allowed.' }, { status: 403 }) }
  const session = await auth()
  if (!session?.user)
    return { response: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }) }
  if (!can({ userId: session.user.id, role: session.user.role }, 'property:write'))
    return {
      response: NextResponse.json(
        { error: 'You do not have permission to manage listings.' },
        { status: 403 },
      ),
    }
  return { session }
}

// GET /api/admin/listings — every property and project, drafts included, so
// the admin panel can edit the full catalogue.
export async function GET() {
  const access = await requireStaffRead()
  if ('response' in access) return access.response
  if (!env.DATABASE_URL)
    return NextResponse.json({ ok: true, properties: [], projects: [] })
  try {
    const { db } = await import('@/lib/db')
    const [propertyRows, projectRows] = await Promise.all([
      db.property.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        include: { project: { select: { name: true, slug: true } } },
      }),
      db.project.findMany({
        orderBy: { createdAt: 'asc' },
        include: { _count: { select: { properties: true } } },
      }),
    ])
    return NextResponse.json({
      ok: true,
      properties: propertyRows.map(propertyDto),
      projects: projectRows.map(projectDto),
    })
  } catch (error) {
    logFailure('listing_list_failed', error)
    return NextResponse.json({ error: 'The listings could not be loaded.' }, { status: 500 })
  }
}

// POST /api/admin/listings — create a property or a project; the chosen kind
// decides which section of the public web it lands in.
export async function POST(request: Request) {
  const access = await requireWrite(request)
  if ('response' in access) return access.response
  const parsed = listingSaveSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success)
    return NextResponse.json({ error: 'Please check the listing details.' }, { status: 400 })
  if (!env.DATABASE_URL)
    return NextResponse.json({ error: 'The database is not configured.' }, { status: 503 })
  try {
    const { db } = await import('@/lib/db')
    const data = parsed.data
    if (data.kind === 'PROPERTY') {
      const projectRow = data.property.projectSlug
        ? await db.project.findUnique({
            where: { slug: data.property.projectSlug },
            select: { id: true, name: true },
          })
        : null
      const web = propertyFormToWeb(data.property)
      const withProject = projectRow ? { ...web, project: projectRow.name } : web
      const { projectSlug: _projectSlug, ...writeData } = buildPropertyWriteData(withProject, {
        sortOrder: await db.property.count(),
        published: data.property.published,
      })
      const row = await db.property.create({
        data: { ...writeData, projectId: projectRow?.id ?? null },
      })
      return NextResponse.json({ ok: true, property: propertyDto(row) }, { status: 201 })
    }
    const { videoUrl, ...projectFields } = data.project
    const row = await db.project.create({
      data: {
        ...projectFields,
        videoUrl: videoUrl || null,
        deliveredAt: data.project.deliveredAt ? new Date(data.project.deliveredAt) : null,
      },
    })
    return NextResponse.json({ ok: true, project: projectDto(row) }, { status: 201 })
  } catch (error) {
    if (isUniqueViolation(error))
      return NextResponse.json(
        { error: 'A listing with this slug already exists.' },
        { status: 409 },
      )
    logFailure('listing_create_failed', error)
    return NextResponse.json({ error: 'The listing could not be saved.' }, { status: 500 })
  }
}
