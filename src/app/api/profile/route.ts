import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { profileSchema } from '@/features/profile/schemas/profile.schema'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { isSameOrigin } from '@/lib/security/validate-origin'

// The signed-in member's own personal information: name, email and phone.
// Email is returned read-only — it is the sign-in identity and is never
// changed here. Any signed-in role (customer or staff) may use this route,
// so the admin panel's profile form shares it with the public site.

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

  if (!process.env.DATABASE_URL)
    return NextResponse.json({ error: 'Your profile is unavailable right now.' }, { status: 503 })

  try {
    const { db } = await import('@/lib/db')
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, phone: true, role: true },
    })
    if (!user) return NextResponse.json({ error: 'Your profile could not be found.' }, { status: 404 })
    return NextResponse.json({ ok: true, user })
  } catch (error) {
    console.error('profile_load_failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'We could not load your profile.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 })

  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

  const rateLimit = checkRateLimit(`profile:${session.user.id}`, 10, 60_000)
  if (!rateLimit.allowed)
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Please send a valid request.' }, { status: 400 })
  }

  const parsed = profileSchema.safeParse(raw)
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Please check the highlighted details and try again.' },
      { status: 400 },
    )

  if (!process.env.DATABASE_URL)
    return NextResponse.json({ error: 'Your profile is unavailable right now.' }, { status: 503 })

  try {
    const { db } = await import('@/lib/db')
    const user = await db.user.update({
      where: { id: session.user.id },
      data: { name: parsed.data.name, phone: parsed.data.phone },
      select: { name: true, email: true, phone: true, role: true },
    })
    return NextResponse.json({ ok: true, user })
  } catch (error) {
    console.error('profile_save_failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'We could not save your details.' }, { status: 500 })
  }
}
