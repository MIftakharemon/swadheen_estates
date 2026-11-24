import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { can } from '@/lib/auth/rbac'
import { env } from '@/lib/env'
import { isSameOrigin } from '@/lib/security/validate-origin'
import { listingKindSchema, listingSaveSchema } from '@/features/listings/schemas/listing.schema'
import {
  buildPropertyWriteData,
  propertyFormToWeb,
} from '@/features/listings/services/property-persistence'
import { parseWebFields } from '@/features/listings/services/web-fields'
import { projectDto, propertyDto } from '@/features/listings/services/listing-dto'

function isUniqueViolation(error: unknown): boolean {
  return (error as { code?: string })?.code === 'P2002'
}

function logFailure(scope: string, error: unknown) {
  console.error(scope, error instanceof Error ? error.message : 'unknown error')
}

async function authorize(request: Request) {
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

// PATCH /api/admin/listings/[id] — full-form update (the dialog always submits
// every field), so an edit replaces exactly what the admin sees.
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const access = await authorize(request)
  if ('response' in access) return access.response
  const { id } = await context.params
  const parsed = listingSaveSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success)
    return NextResponse.json({ error: 'Please check the listing details.' }, { status: 400 })
  if (!env.DATABASE_URL)
    return NextResponse.json({ error: 'The database is not configured.' }, { status: 503 })
  try {
    const { db } = await import('@/lib/db')
    const data = parsed.data
    if (data.kind === 'PROPERTY') {
      const existing = await db.property.findUnique({ where: { id } })
      if (!existing) return NextResponse.json({ error: 'Listing not found.' }, { status: 404 })
      const previousFields = parseWebFields(existing.webFields)
      const projectRow = data.property.projectSlug
        ? await db.project.findUnique({
            where: { slug: data.property.projectSlug },
            select: { id: true, name: true },
          })
        : null
      // Keep the previous project label when the slug is unchanged but the
      // Project row itself was removed; otherwise resolve it fresh.
      const previousSlug = previousFields.projectSlug
      const previousLabel = previousFields.project
      const keepLabel =
        !projectRow &&
        Boolean(data.property.projectSlug) &&
        data.property.projectSlug === previousSlug &&
        Boolean(previousLabel)
      const web = propertyFormToWeb(data.property)
      const withProject = projectRow
        ? { ...web, project: projectRow.name }
        : keepLabel && previousLabel
          ? { ...web, project: previousLabel }
          : web
      const { projectSlug: _projectSlug, ...writeData } = buildPropertyWriteData(withProject, {
        sortOrder: existing.sortOrder,
        published: data.property.published,
      })
      const row = await db.property.update({
        where: { id },
        data: { ...writeData, projectId: projectRow?.id ?? null },
        include: { project: { select: { name: true, slug: true } } },
      })
      return NextResponse.json({ ok: true, property: propertyDto(row) })
    }
    const projectRow = await db.project.findUnique({ where: { id } })
    if (!projectRow) return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
    const { videoUrl, ...projectFields } = data.project
    const row = await db.project.update({
      where: { id },
      data: {
        ...projectFields,
        videoUrl: videoUrl || null,
        deliveredAt: data.project.deliveredAt ? new Date(data.project.deliveredAt) : null,
      },
      include: { _count: { select: { properties: true } } },
    })
    return NextResponse.json({ ok: true, project: projectDto(row) })
  } catch (error) {
    if (isUniqueViolation(error))
      return NextResponse.json(
        { error: 'A listing with this slug already exists.' },
        { status: 409 },
      )
    logFailure('listing_update_failed', error)
    return NextResponse.json({ error: 'The listing could not be updated.' }, { status: 500 })
  }
}

// DELETE /api/admin/listings/[id]?kind=PROPERTY|PROJECT — enquiries keep their
// history but detach from the listing; project videos go with the project.
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const access = await authorize(request)
  if ('response' in access) return access.response
  const { id } = await context.params
  const kind = listingKindSchema.safeParse(new URL(request.url).searchParams.get('kind'))
  if (!kind.success)
    return NextResponse.json({ error: 'Please specify the listing kind.' }, { status: 400 })
  if (!env.DATABASE_URL)
    return NextResponse.json({ error: 'The database is not configured.' }, { status: 503 })
  try {
    const { db } = await import('@/lib/db')
    if (kind.data === 'PROPERTY') {
      await db.lead.updateMany({ where: { propertyId: id }, data: { propertyId: null } })
      await db.property.delete({ where: { id } })
    } else {
      await db.property.updateMany({ where: { projectId: id }, data: { projectId: null } })
      await db.project.delete({ where: { id } })
    }
    return NextResponse.json({ ok: true, id })
  } catch (error) {
    logFailure('listing_delete_failed', error)
    return NextResponse.json({ error: 'The listing could not be removed.' }, { status: 500 })
  }
}
