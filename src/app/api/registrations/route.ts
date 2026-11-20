import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { can } from '@/lib/auth/rbac'
import { env } from '@/lib/env'

// Staff-only: recent account sign-ups, newest first, so the admin panel can
// show who registered from the public site.
export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  if (!can({ userId: session.user.id, role: session.user.role }, 'lead:read'))
    return NextResponse.json({ error: 'You do not have permission to view registrations.' }, { status: 403 })

  if (!env.DATABASE_URL) return NextResponse.json({ ok: true, registrations: [] })

  try {
    const { db } = await import('@/lib/db')
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 24,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    return NextResponse.json({
      ok: true,
      registrations: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('registration_list_failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ ok: true, registrations: [] })
  }
}
