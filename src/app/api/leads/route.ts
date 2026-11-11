import { NextResponse } from 'next/server'
import { publicLeadSchema } from '@/features/leads/schemas/lead.schema'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { isSameOrigin } from '@/lib/security/validate-origin'
import { env } from '@/lib/env'

function getClientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local-client'
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Request not allowed.' }, { status: 403 })
  const rateLimit = checkRateLimit(`lead:${getClientKey(request)}`, 5, 60_000)
  if (!rateLimit.allowed)
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ error: 'Please send a valid request.' }, { status: 400 })
  }

  const parsed = publicLeadSchema.safeParse(raw)
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Please check the highlighted details and try again.' },
      { status: 400 },
    )
  if (parsed.data.honeypot) return NextResponse.json({ ok: true })

  if (env.TURNSTILE_SECRET_KEY) {
    const token = request.headers.get('x-turnstile-token')
    if (!token)
      return NextResponse.json({ error: 'Please complete the verification and try again.' }, { status: 400 })
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: getClientKey(request),
      }),
    })
    const result = (await verification.json()) as { success?: boolean }
    if (!result.success)
      return NextResponse.json({ error: 'Please complete the verification and try again.' }, { status: 400 })
  }

  try {
    if (process.env.DATABASE_URL) {
      const { db } = await import('@/lib/db')
      const property = parsed.data.propertySlug
        ? await db.property.findUnique({ where: { slug: parsed.data.propertySlug }, select: { id: true } })
        : null
      await db.lead.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          note: parsed.data.note,
          propertyId: property?.id,
          source: 'WEBSITE',
          score: 20,
        },
      })
    }
    return NextResponse.json({ ok: true, message: 'Your request has been received.' }, { status: 201 })
  } catch (error) {
    console.error('lead_submission_failed', error instanceof Error ? error.message : 'unknown error')
    return NextResponse.json({ error: 'We could not save that request. Please try again.' }, { status: 500 })
  }
}
