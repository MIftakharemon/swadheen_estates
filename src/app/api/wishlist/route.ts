import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { wishlistToggleSchema } from '@/features/wishlist/schemas/wishlist.schema'
import { listSavedSlugs, toggleSavedProperty } from '@/features/wishlist/services/wishlist.service'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { isSameOrigin } from '@/lib/security/validate-origin'

function getClientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local-client'
}

// The signed-in customer's saved slugs. Anonymous visitors get a 401, which
// the client turns into the "sign in to save" prompt.
export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  if (!process.env.DATABASE_URL) return NextResponse.json({ ok: true, slugs: [] })

  try {
    const slugs = await listSavedSlugs(session.user.id)
    return NextResponse.json({ ok: true, slugs })
  } catch (error) {
    console.error('wishlist_list_failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ ok: false, slugs: [] }, { status: 500 })
  }
}

// Toggle a property in the caller's wishlist.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 })

  const rateLimit = checkRateLimit(`wishlist:${getClientKey(request)}`, 30, 60_000)
  if (!rateLimit.allowed)
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })

  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Please send a valid request.' }, { status: 400 })
  }

  const parsed = wishlistToggleSchema.safeParse(raw)
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Please check the highlighted details and try again.' },
      { status: 400 },
    )

  if (!process.env.DATABASE_URL)
    return NextResponse.json({ error: 'The wishlist is unavailable right now.' }, { status: 503 })

  try {
    const result = await toggleSavedProperty(session.user.id, parsed.data.slug)
    if (!result) return NextResponse.json({ error: 'Property not found.' }, { status: 404 })
    return NextResponse.json({ ok: true, saved: result.saved })
  } catch (error) {
    console.error('wishlist_toggle_failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'We could not save that property.' }, { status: 500 })
  }
}
