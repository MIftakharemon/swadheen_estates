import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { can } from '@/lib/auth/rbac'
import { isSameOrigin } from '@/lib/security/validate-origin'
import { scopeFromBody, scopeWhere } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 })

  const body = (await request.json().catch(() => null)) as { scope?: string } | null
  const scope = scopeFromBody(body)
  const session = await auth()

  if (scope === 'admin') {
    if (!session?.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    if (!can({ userId: session.user.id, role: session.user.role }, 'lead:read'))
      return NextResponse.json(
        { error: 'You do not have permission to update notifications.' },
        { status: 403 },
      )
  }

  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: true, updated: 0 })

  try {
    const { db } = await import('@/lib/db')
    const result = await db.notification.updateMany({
      where: { ...scopeWhere(scope, session?.user?.id), readAt: null },
      data: { readAt: new Date() },
    })
    return NextResponse.json({ ok: true, updated: result.count })
  } catch (error) {
    console.error(
      'notifications_mark_read_failed',
      error instanceof Error ? error.message : 'unknown error',
    )
    return NextResponse.json({ ok: true, updated: 0 })
  }
}
