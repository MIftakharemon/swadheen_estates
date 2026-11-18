import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { can } from '@/lib/auth/rbac'
import { scopeFromRequest, scopeWhere } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const scope = scopeFromRequest(request)
  const session = await auth()

  if (scope === 'admin') {
    if (!session?.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    if (!can({ userId: session.user.id, role: session.user.role }, 'lead:read'))
      return NextResponse.json(
        { error: 'You do not have permission to view notifications.' },
        { status: 403 },
      )
  }

  if (!process.env.DATABASE_URL)
    return NextResponse.json({ ok: true, unread: 0, notifications: [] })

  try {
    const { db } = await import('@/lib/db')
    const where = scopeWhere(scope, session?.user?.id)
    const [rows, unread] = await Promise.all([
      db.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: 25 }),
      db.notification.count({ where: { ...where, readAt: null } }),
    ])
    return NextResponse.json({
      ok: true,
      unread,
      notifications: rows.map((row) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        body: row.body,
        link: row.link,
        meta: row.meta,
        read: row.readAt !== null,
        createdAt: row.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('notifications_list_failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ ok: true, unread: 0, notifications: [] })
  }
}
